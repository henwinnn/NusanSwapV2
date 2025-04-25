"use client";

import { motion } from "framer-motion";
import TokenSelector from "./token-selector";
import { Token } from "./swap-interface";
import { truncateToDecimals } from "@/util/helper";

interface InputTokenProps {
  direction: "from" | "to";
  decimal: number;
  selectedToken: Token;

  otherTokenId: string;
  tokens: Token[];
  amountIn: string;
  setFromToken: (token: Token) => void;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputToken({
  direction,
  decimal,
  selectedToken,

  otherTokenId,
  tokens,
  amountIn,
  setFromToken,
  handleAmountChange,
}: InputTokenProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm text-gray-400">{direction}</label>
        <span className="text-sm text-gray-400">
          {/* Balance: {selectedToken.balance.toLocaleString()}{" "}
                        {selectedToken.symbol} */}
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <TokenSelector
          selectedToken={selectedToken}
          otherTokenId={otherTokenId}
          tokens={tokens}
          onSelect={setFromToken}
        />
        {direction == "from" ? (
          <input
            type="number"
            value={amountIn}
            onChange={handleAmountChange}
            onKeyDown={(e) => {
              if (["ArrowUp", "ArrowDown", "e", "-"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            onWheel={(e) => e.currentTarget.blur()} // disables scroll increment
            min="0"
            className="flex-1 bg-gray-800 border-0 rounded-xl p-3 text-white text-xl focus:ring-2 focus:ring-white/20 focus:outline-none transition-all duration-300 hover:bg-gray-750 focus:bg-gray-750"
            placeholder="0.00"
          />
        ) : (
          <div className="flex-1 bg-gray-800 rounded-xl p-3 text-white text-xl transition-all duration-300 hover:bg-gray-750">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {parseFloat(
                truncateToDecimals(Number(amountIn), decimal).toFixed(decimal)
              ).toLocaleString(undefined, {
                maximumFractionDigits: decimal,
              })}
            </motion.span>
          </div>
        )}
      </div>
    </div>
  );
}
