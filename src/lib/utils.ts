import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function abs(x: bigint, y: bigint): bigint {
  return x >= y ? x - y : y - x;
}

// Implementation of _getD function needed for _getY
function getD(xp: bigint[], n: number, a: bigint): bigint {
  // a = A * n^(n-1)

  // Calculate sum of balances
  let sum = BigInt(0);
  for (let i = 0; i < n; i++) {
    sum += xp[i];
  }

  // Initial guess for d
  let d = sum;
  let dPrev: bigint;

  // Newton's method iteration
  for (let i = 0; i < 255; i++) {
    // Calculate p = D^(n+1) / (n^n * x_0 * ... * x_(n-1))
    let p = d;
    for (let j = 0; j < n; j++) {
      // p = p * d / (n * xp[j])
      p = (p * d) / (BigInt(n) * xp[j]);
    }

    dPrev = d;
    // d = (a * sum + n * p) * d / ((a - 1) * d + (n + 1) * p)
    d =
      ((a * sum + BigInt(n) * p) * d) /
      ((a - BigInt(1)) * d + BigInt(n + 1) * p);

    // Check for convergence
    if (abs(d, dPrev) <= BigInt(1)) {
      return d;
    }
  }

  throw new Error("D didn't converge");
}

/**
 * Calculate the new balance of token j given the new balance of token i
 * @param i - Index of token in
 * @param j - Index of token out
 * @param x - New balance of token i
 * @param xp - Current precision-adjusted balances
 * @param n - Number of tokens (constant N in the contract)
 * @param a - Amplification coefficient
 * @returns New balance of token j
 */
function getY(
  i: number,
  j: number,
  x: bigint,
  xp: bigint[],
  n: number,
  a: bigint
): bigint {
  // Ensure inputs are valid
  if (i === j) {
    throw new Error("i and j cannot be the same");
  }
  if (i >= n || j >= n) {
    throw new Error("Invalid token index");
  }

  // Calculate D
  const d = getD(xp, n, a);

  // Prepare values for calculating y
  let s = BigInt(0); // sum
  let c = d; // will be used to compute c

  // Create a copy of xp and replace i with x
  const xpCopy = [...xp];
  xpCopy[i] = x;

  // Calculate s and c
  for (let k = 0; k < n; k++) {
    if (k === j) {
      continue;
    }

    const _x = xpCopy[k];
    s += _x;
    c = (c * d) / (BigInt(n) * _x);
  }

  c = (c * d) / (BigInt(n) * a);
  const b = s + d / a;

  // Newton's method to find y
  let y = d;
  let yPrev: bigint;

  for (let iter = 0; iter < 255; iter++) {
    yPrev = y;
    // y = (y² + c) / (2y + b - d)
    y = (y * y + c) / (BigInt(2) * y + b - d);

    if (abs(y, yPrev) <= BigInt(1)) {
      return y;
    }
  }

  throw new Error("y didn't converge");
}

/**
 * Calculate output amount for swapping dx of token i to token j
 * @param i - Index of token in
 * @param j - Index of token out
 * @param dx - Amount of token i to swap
 * @param balances - Current token balances
 * @param multipliers - Token decimal multipliers
 * @param n - Number of tokens
 * @param a - Amplification coefficient
 * @param swapFee - Fee in ppm (parts per million)
 * @returns Amount of token j to receive
 */
export function calculateSwapOutput(
  i: number,
  j: number,
  dx: bigint,
  balances: bigint[],
  multipliers: bigint[],
  n: number = 3,
  a: bigint = BigInt(1000) * BigInt(n) ** BigInt(n - 1),
  swapFee: bigint = BigInt(300) // 0.03%
): bigint {
  // Get precision-adjusted balances
  const xp: bigint[] = balances.map((bal, idx) => bal * multipliers[idx]);

  // Calculate new x
  const x = xp[i] + dx * multipliers[i];

  // Calculate new y
  const y0 = xp[j];
  const y1 = getY(i, j, x, xp, n, a);

  // y0 must be >= y1, since x has increased
  // -1 to round down
  let dy = (y0 - y1 - BigInt(1)) / multipliers[j];

  // Subtract fee from dy
  const fee = (dy * swapFee) / BigInt(1_000_000); // FEE_DENOMINATOR = 1e6
  dy -= fee;

  return dy;
}

export function getMinDy(output: bigint, slippagePercent: number): bigint {
  const slippage = BigInt(Math.floor(slippagePercent * 100)); // e.g. 0.5% => 50
  const minDy = output - (output * slippage) / BigInt(10_000);
  return minDy;
}
