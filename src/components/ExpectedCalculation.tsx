"use client";

import { truncateToDecimals } from "@/util/helper";
// import { formatEUR, formatIDR, formatUSD } from "@/util/helper";
import { Token } from "./swap-interface";

interface ExpectedCalculationProps {
  fromToken: Token;
  toToken: Token;
  rate: string;
  convertedAmount: number;
  swapFee: number;
  amountOut: string;
  decimal: number;
}

export default function ExpectedCalculation({
  fromToken,
  toToken,
  rate,
  // convertedAmount,
  swapFee,
  amountOut,
  decimal,
}: ExpectedCalculationProps) {
  const expectedRealValue = decimal === 2 ? 3 : 6;
  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
      <div className="flex items-center mb-2">
        <svg
          className="w-4 h-4 mr-2 text-blue-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        <h3 className="text-sm font-medium text-blue-400">
          Expected Calculation
        </h3>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Exchange Rate:</span>
          <span className="text-white font-medium">
            1 {fromToken.symbol} =
            {parseFloat(
              truncateToDecimals(Number(rate), expectedRealValue).toFixed(
                expectedRealValue
              )
            ).toLocaleString(undefined, {
              maximumFractionDigits: expectedRealValue,
            })}
            &nbsp;
            {toToken.symbol}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Expected Output:</span>
          <span className="text-white font-medium">
            {/* {tempAmount}&nbsp; */}
            {parseFloat(
              truncateToDecimals(Number(amountOut), decimal).toFixed(decimal)
            ).toLocaleString(undefined, {
              maximumFractionDigits: decimal,
            })}
            &nbsp;
            {toToken.symbol}
          </span>
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <svg
            className="w-3 h-3 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span>Rate includes {swapFee}% swap fee</span>
        </div>
      </div>
    </div>
  );
}
