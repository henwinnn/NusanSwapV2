"use client";

import { formatUnits } from "viem";
// import { TokensMapping } from "@/custom-hooks/readContracts";
import { Token } from "./swap-interface";
import { formatUSD } from "@/util/helper";

interface CardHeaderProps {
  mappingToken: Token[];
  toToken: Token;
  setAmountIn: (value: string) => void;
  setFromToken: (value: Token) => void;
  handleSwap: () => void;
}

export default function AvailableBalance({
  mappingToken,
  toToken,
  setAmountIn,
  setFromToken,
  handleSwap,
}: CardHeaderProps) {
  const handleInputAll = (token: Token) => {
    const decimal = token.id == "idrx" ? 1e2 : 1e6;
    if (token.index == toToken.index) {
      handleSwap();
    } else {
      setFromToken(token);
    }
    console.log({ token });
    if (Number(token.balance) / decimal < 0.000001) {
      setAmountIn((0).toString());
    } else {
      setAmountIn((Number(token.balance) / decimal).toString());
    }
  };
  // const mappingToken = TokensMapping(address);
  return (
    <div className="bg-gray-800/50 rounded-xl p-3">
      <h3 className="text-sm text-gray-400 mb-2">Available Balance</h3>
      <div className="grid grid-cols-3 gap-2">
        {mappingToken.map((token) => {
          const decimal = token.id == "idrx" ? 2 : 6;
          return (
            <div
              key={token.id}
              onClick={() => {
                handleInputAll(token);
              }}
              className="flex flex-col items-center cursor-pointer"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                style={{ backgroundColor: token.color }}
              >
                <span className="text-xs font-bold text-white">
                  {token.symbol.charAt(0)}
                </span>
              </div>
              <span className="text-white text-sm font-medium">
                {token.symbol}
              </span>
              <span className="text-gray-400 text-xs">
                {formatUSD(formatUnits(token.balance, decimal))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
