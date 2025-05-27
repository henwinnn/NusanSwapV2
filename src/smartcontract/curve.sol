// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title IDRXStableSwap
 * @notice Stable swap AMM implementation for IDRX, USDC, and EURC
 * @dev Based on Curve Finance StableSwap mechanism
 * - IDRX: 2 decimals
 * - USDC: 6 decimals
 * - EURC: 6 decimals
 *
 * Conversion rates:
 * - 1 USDC = 16500 IDRX
 * - 1 EURC = 17944 IDRX
 */

library Math {
    function abs(uint256 x, uint256 y) internal pure returns (uint256) {
        return x >= y ? x - y : y - x;
    }
}

contract IDRXStableSwap {
    // Number of tokens
    uint256 private constant N = 3;
    // Amplification coefficient multiplied by N^(N - 1)
    // Higher value makes the curve more flat
    // Lower value makes the curve more like constant product AMM
    uint256 private constant A = 1000 * (N ** (N - 1));
    uint256 private constant SWAP_FEE = 300; // 0.3%
    // Liquidity fee for imbalanced deposits/withdrawals
    uint256 private constant LIQUIDITY_FEE = (SWAP_FEE * N) / (4 * (N - 1));
    uint256 private constant FEE_DENOMINATOR = 1e6;

    // Token addresses: IDRX, USDC, EURC
    address[N] public tokens;

    // Token decimals
    uint8[N] public decimals = [2, 6, 6]; // IDRX (2), USDC (6), EURC (6)

    // Multipliers to normalize each token to 18 decimals
    // IDRX: 10^16 (18-2)
    // USDC: 10^12 (18-6) * 16500 conversion rate
    // EURC: 10^12 (18-6) * 17944 conversion rate
    uint256[N] private multipliers;

    // Current balances of each token
    uint256[N] public balances;

    // LP token details
    uint256 private constant DECIMALS = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    // Track user deposits for each token
    mapping(address => uint256[N]) public userDeposits;

    // Events
    event AddLiquidity(
        address indexed provider,
        uint256[N] tokenAmounts,
        uint256 sharesMinted
    );
    event RemoveLiquidity(
        address indexed provider,
        uint256[N] tokenAmounts,
        uint256 sharesBurned
    );
    event RemoveLiquidityOne(
        address indexed provider,
        uint256 tokenIndex,
        uint256 tokenAmount,
        uint256 sharesBurned
    );
    event Swap(
        address indexed user,
        uint256 tokenIndexFrom,
        uint256 tokenIndexTo,
        uint256 amountIn,
        uint256 amountOut
    );

    constructor(address[N] memory _tokens) {
        tokens = _tokens;

        // Set multipliers based on decimals and conversion rates
        multipliers[0] = 10 ** (18 - decimals[0]); // IDRX to 18 decimals
        multipliers[1] = 10 ** (18 - decimals[1]) * 16500; // USDC normalized with conversion rate
        multipliers[2] = 10 ** (18 - decimals[2]) * 17944; // EURC normalized with conversion rate
    }

    function _mint(address _to, uint256 _amount) private {
        balanceOf[_to] += _amount;
        totalSupply += _amount;
    }

    function _burn(address _from, uint256 _amount) private {
        balanceOf[_from] -= _amount;
        totalSupply -= _amount;
    }

    // Return precision-adjusted balances, normalized to 18 decimals
    function _xp() private view returns (uint256[N] memory xp) {
        for (uint256 i = 0; i < N; ++i) {
            xp[i] = balances[i] * multipliers[i];
        }
    }

    /**
     * @notice Calculate D, sum of balances in a perfectly balanced pool
     * If balances of x_0, x_1, ... x_(n-1) then sum(x_i) = D
     * @param xp Precision-adjusted balances
     * @return D
     */
    function _getD(uint256[N] memory xp) private pure returns (uint256) {
        /*
        Newton's method to compute D
        -----------------------------
        f(D) = ADn^n + D^(n + 1) / (n^n prod(x_i)) - An^n sum(x_i) - D 
        f'(D) = An^n + (n + 1) D^n / (n^n prod(x_i)) - 1

                     (as + np)D_n
        D_(n+1) = -----------------------
                  (a - 1)D_n + (n + 1)p

        a = An^n
        s = sum(x_i)
        p = (D_n)^(n + 1) / (n^n prod(x_i))
        */
        uint256 a = A * N; // An^n

        uint256 s; // x_0 + x_1 + ... + x_(n-1)
        for (uint256 i = 0; i < N; ++i) {
            s += xp[i];
        }

        // Newton's method
        // Initial guess, d <= s
        uint256 d = s;
        uint256 d_prev;
        for (uint256 i = 0; i < 255; ++i) {
            // p = D^(n + 1) / (n^n * x_0 * ... * x_(n-1))
            uint256 p = d;
            for (uint256 j = 0; j < N; ++j) {
                p = (p * d) / (N * xp[j]);
            }
            d_prev = d;
            d = ((a * s + N * p) * d) / ((a - 1) * d + (N + 1) * p);

            if (Math.abs(d, d_prev) <= 1) {
                return d;
            }
        }
        revert("D didn't converge");
    }

    /**
     * @notice Calculate the new balance of token j given the new balance of token i
     * @param i Index of token in
     * @param j Index of token out
     * @param x New balance of token i (precision adjusted)
     * @param xp Current precision-adjusted balances
     */
    function _getY(
        uint256 i,
        uint256 j,
        uint256 x,
        uint256[N] memory xp
    ) private pure returns (uint256) {
        /*
        Newton's method to compute y
        -----------------------------
        y = x_j

        f(y) = y^2 + y(b - D) - c

                    y_n^2 + c
        y_(n+1) = --------------
                   2y_n + b - D

        where
        s = sum(x_k), k != j
        p = prod(x_k), k != j
        b = s + D / (An^n)
        c = D^(n + 1) / (n^n * p * An^n)
        */
        uint256 a = A * N;
        uint256 d = _getD(xp);
        uint256 s;
        uint256 c = d;

        uint256 _x;
        for (uint256 k = 0; k < N; ++k) {
            if (k == i) {
                _x = x;
            } else if (k == j) {
                continue;
            } else {
                _x = xp[k];
            }

            s += _x;
            c = (c * d) / (N * _x);
        }
        c = (c * d) / (N * a);
        uint256 b = s + d / a;

        // Newton's method
        uint256 y_prev;
        // Initial guess, y <= d
        uint256 y = d;
        for (uint256 _i = 0; _i < 255; ++_i) {
            y_prev = y;
            y = (y * y + c) / (2 * y + b - d);
            if (Math.abs(y, y_prev) <= 1) {
                return y;
            }
        }
        revert("y didn't converge");
    }

    /**
     * @notice Calculate the new balance of token i given precision-adjusted
     * balances xp and liquidity d
     * @param i Index of token to calculate the new balance
     * @param xp Precision-adjusted balances
     * @param d Liquidity d
     * @return New balance of token i
     */
    function _getYD(
        uint256 i,
        uint256[N] memory xp,
        uint256 d
    ) private pure returns (uint256) {
        uint256 a = A * N;
        uint256 s;
        uint256 c = d;

        uint256 _x;
        for (uint256 k = 0; k < N; ++k) {
            if (k != i) {
                _x = xp[k];
            } else {
                continue;
            }

            s += _x;
            c = (c * d) / (N * _x);
        }
        c = (c * d) / (N * a);
        uint256 b = s + d / a;

        // Newton's method
        uint256 y_prev;
        // Initial guess, y <= d
        uint256 y = d;
        for (uint256 _i = 0; _i < 255; ++_i) {
            y_prev = y;
            y = (y * y + c) / (2 * y + b - d);
            if (Math.abs(y, y_prev) <= 1) {
                return y;
            }
        }
        revert("y didn't converge");
    }

    /**
     * @notice Get virtual price for one LP token
     * @dev Virtual price is the current value of one LP token in terms of underlying tokens
     * @return Virtual price normalized to 1e18 (18 decimals)
     */
    function getVirtualPrice() external view returns (uint256) {
        uint256 d = _getD(_xp());
        uint256 _totalSupply = totalSupply;
        if (_totalSupply > 0) {
            return (d * 10 ** DECIMALS) / _totalSupply;
        }
        return 0;
    }

    /**
     * @notice Swap dx amount of token i for token j
     * @param i Index of token in
     * @param j Index of token out
     * @param dx Token in amount
     * @param minDy Minimum token out
     * @return dy Amount of token j received
     */
    function swap(
        uint256 i,
        uint256 j,
        uint256 dx,
        uint256 minDy
    ) external returns (uint256 dy) {
        require(i != j, "IDRXStableSwap: Cannot swap same token");
        require(i < N && j < N, "IDRXStableSwap: Token index out of range");

        IERC20(tokens[i]).transferFrom(msg.sender, address(this), dx);

        // Calculate dy
        uint256[N] memory xp = _xp();
        uint256 x = xp[i] + dx * multipliers[i];

        uint256 y0 = xp[j];
        uint256 y1 = _getY(i, j, x, xp);
        // y0 must be >= y1, since x has increased
        // -1 to round down
        dy = (y0 - y1 - 1) / multipliers[j];

        // Subtract fee from dy
        uint256 fee = (dy * SWAP_FEE) / FEE_DENOMINATOR;
        dy -= fee;
        require(dy >= minDy, "IDRXStableSwap: Output amount below minimum");

        balances[i] += dx;
        balances[j] -= dy;

        IERC20(tokens[j]).transfer(msg.sender, dy);

        emit Swap(msg.sender, i, j, dx, dy);

        return dy;
    }

    /**
     * @notice Add liquidity to the pool
     * @param amounts Amounts of tokens to deposit
     * @param minShares Minimum LP tokens to mint
     * @return shares LP tokens minted
     */
    function addLiquidity(
        uint256[N] calldata amounts,
        uint256 minShares
    ) external returns (uint256 shares) {
        // Calculate current liquidity d0
        uint256 _totalSupply = totalSupply;
        uint256 d0;
        uint256[N] memory old_xs = _xp();
        if (_totalSupply > 0) {
            d0 = _getD(old_xs);
        }

        // Transfer tokens in
        uint256[N] memory new_xs;
        for (uint256 i = 0; i < N; ++i) {
            uint256 amount = amounts[i];
            if (amount > 0) {
                IERC20(tokens[i]).transferFrom(
                    msg.sender,
                    address(this),
                    amount
                );
                new_xs[i] = old_xs[i] + amount * multipliers[i];
            } else {
                new_xs[i] = old_xs[i];
            }
        }

        // Calculate new liquidity d1
        uint256 d1 = _getD(new_xs);
        require(d1 > d0, "IDRXStableSwap: Liquidity didn't increase");

        // Recalculate D accounting for fee on imbalance
        uint256 d2;
        if (_totalSupply > 0) {
            for (uint256 i = 0; i < N; ++i) {
                // Calculate ideal balance and apply fee on imbalance
                uint256 idealBalance = (old_xs[i] * d1) / d0;
                uint256 diff = Math.abs(new_xs[i], idealBalance);
                new_xs[i] -= (LIQUIDITY_FEE * diff) / FEE_DENOMINATOR;
            }
            d2 = _getD(new_xs);
        } else {
            d2 = d1;
        }

        // Update balances
        for (uint256 i = 0; i < N; ++i) {
            balances[i] += amounts[i];
        }

        // Shares to mint = (d2 - d0) / d0 * total supply
        // d1 >= d2 >= d0
        if (_totalSupply > 0) {
            shares = ((d2 - d0) * _totalSupply) / d0;
        } else {
            shares = d2;
        }
        require(
            shares >= minShares,
            "IDRXStableSwap: Insufficient shares minted"
        );
        _mint(msg.sender, shares);

        // Update user deposits
        for (uint256 i = 0; i < N; i++) {
            userDeposits[msg.sender][i] += amounts[i];
        }

        emit AddLiquidity(msg.sender, amounts, shares);

        return shares;
    }

    /**
     * @notice Get user deposit amounts
     * @param user User address
     * @return User's deposit amounts for each token
     */
    function getUserDeposits(
        address user
    ) external view returns (uint256[N] memory) {
        return userDeposits[user];
    }

    /**
     * @notice Remove liquidity from the pool proportionally
     * @param shares LP token amount to burn
     * @param minAmountsOut Minimum token amounts to receive
     * @return amountsOut Token amounts received
     */
    function removeLiquidity(
        uint256 shares,
        uint256[N] calldata minAmountsOut
    ) external returns (uint256[N] memory amountsOut) {
        uint256 _totalSupply = totalSupply;
        require(_totalSupply > 0, "IDRXStableSwap: No liquidity");
        require(shares > 0, "IDRXStableSwap: Invalid shares amount");

        for (uint256 i = 0; i < N; ++i) {
            uint256 amountOut = (balances[i] * shares) / _totalSupply;
            require(
                amountOut >= minAmountsOut[i],
                "IDRXStableSwap: Output amount below minimum"
            );

            balances[i] -= amountOut;
            amountsOut[i] = amountOut;

            IERC20(tokens[i]).transfer(msg.sender, amountOut);

            // Update user deposits
            if (userDeposits[msg.sender][i] >= amountOut) {
                userDeposits[msg.sender][i] -= amountOut;
            } else {
                userDeposits[msg.sender][i] = 0;
            }
        }

        _burn(msg.sender, shares);

        emit RemoveLiquidity(msg.sender, amountsOut, shares);

        return amountsOut;
    }

    /**
     * @notice Calculate amount of token i to receive for shares
     * @param shares Shares to burn
     * @param i Index of token to withdraw
     * @return dy Amount of token i to receive
     *         fee Fee for withdraw (already included in dy)
     */
    function _calcWithdrawOneToken(
        uint256 shares,
        uint256 i
    ) private view returns (uint256 dy, uint256 fee) {
        require(i < N, "IDRXStableSwap: Token index out of range");
        uint256 _totalSupply = totalSupply;
        require(_totalSupply > 0, "IDRXStableSwap: No liquidity");

        uint256[N] memory xp = _xp();

        // Calculate d0 and d1
        uint256 d0 = _getD(xp);
        uint256 d1 = d0 - (d0 * shares) / _totalSupply;

        // Calculate reduction in y if D = d1
        uint256 y0 = _getYD(i, xp, d1);
        // d1 <= d0 so y must be <= xp[i]
        uint256 dy0 = (xp[i] - y0) / multipliers[i];

        // Calculate imbalance fee, update xp with fees
        uint256 dx;
        for (uint256 j = 0; j < N; ++j) {
            if (j == i) {
                dx = (xp[j] * d1) / d0 - y0;
            } else {
                // d1 / d0 <= 1
                dx = xp[j] - (xp[j] * d1) / d0;
            }
            xp[j] -= (LIQUIDITY_FEE * dx) / FEE_DENOMINATOR;
        }

        // Recalculate y with xp including imbalance fees
        uint256 y1 = _getYD(i, xp, d1);
        // - 1 to round down
        dy = (xp[i] - y1 - 1) / multipliers[i];
        fee = dy0 - dy;
    }

    /**
     * @notice Calculate amount of token i to receive for shares
     * @param shares Shares to burn
     * @param i Index of token to withdraw
     * @return dy Amount of token i to receive
     *         fee Fee for withdraw (already included in dy)
     */
    function calcWithdrawOneToken(
        uint256 shares,
        uint256 i
    ) external view returns (uint256 dy, uint256 fee) {
        return _calcWithdrawOneToken(shares, i);
    }

    /**
     * @notice Withdraw liquidity in a single token
     * @param shares Shares to burn
     * @param i Token index to withdraw
     * @param minAmountOut Minimum amount of token i that must be withdrawn
     * @return amountOut Token amount received
     */
    function removeLiquidityOneToken(
        uint256 shares,
        uint256 i,
        uint256 minAmountOut
    ) external returns (uint256 amountOut) {
        require(i < N, "IDRXStableSwap: Token index out of range");

        (amountOut, ) = _calcWithdrawOneToken(shares, i);
        require(
            amountOut >= minAmountOut,
            "IDRXStableSwap: Output amount below minimum"
        );

        balances[i] -= amountOut;
        _burn(msg.sender, shares);

        IERC20(tokens[i]).transfer(msg.sender, amountOut);

        // Update user deposits
        if (userDeposits[msg.sender][i] >= amountOut) {
            userDeposits[msg.sender][i] -= amountOut;
        } else {
            userDeposits[msg.sender][i] = 0;
        }

        emit RemoveLiquidityOne(msg.sender, i, amountOut, shares);

        return amountOut;
    }
}

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}
