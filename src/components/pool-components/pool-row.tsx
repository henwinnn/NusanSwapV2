"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
// import { useRouter } from "next/navigation";

interface PoolToken {
  symbol: string;
  color: string;
}

interface PoolProps {
  id: string;
  name: string;
  tokens: PoolToken[];
  poolCount: number;
  tvl: number;
  volume24h: number;
  fee: number;
}

export default function PoolRow({ pool }: { pool: PoolProps }) {
  // const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRowClick = () => {
    // For now, just toggle expansion. Later could navigate to pool details
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="cursor-pointer hover:bg-gray-800/50 transition-colors duration-200">
      <div
        className="grid grid-cols-12 gap-4 p-4 items-center"
        onClick={handleRowClick}
      >
        {/* Pool Name and Tokens */}
        <div className="col-span-4 flex items-center">
          <div className="flex -space-x-2 mr-3">
            {pool.tokens.map((token, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full border-2 border-gray-900 flex items-center justify-center"
                style={{ backgroundColor: token.color, zIndex: 10 - index }}
              >
                <span className="text-xs font-bold text-white">
                  {token.symbol.charAt(0)}
                </span>
              </div>
            ))}
          </div>
          <div>
            <div className="font-medium text-white">{pool.name}</div>
            <div className="text-xs text-gray-400">{pool.poolCount} pools</div>
          </div>
        </div>

        {/* TVL */}
        <div className="col-span-3 font-medium text-white">
          ${pool.tvl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </div>

        {/* Volume */}
        <div className="col-span-3 font-medium text-white">
          $
          {pool.volume24h.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </div>

        {/* Fee */}
        <div className="col-span-2 font-medium text-white flex items-center justify-between">
          <span>{pool.fee.toFixed(2)}%</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </motion.div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 pb-4 text-gray-400"
        >
          <div className="bg-gray-800 rounded-xl p-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm mb-1">Pool Details</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Creation Date:</div>
                <div className="text-white">Jan 15, 2023</div>
                <div>Total Liquidity:</div>
                <div className="text-white">${pool.tvl.toLocaleString()}</div>
                <div>Fee Tier:</div>
                <div className="text-white">{pool.fee}%</div>
              </div>
            </div>
            <div>
              <div className="text-sm mb-1">Your Position</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Liquidity:</div>
                <div className="text-white">$0.00</div>
                <div>Unclaimed Fees:</div>
                <div className="text-white">$0.00</div>
              </div>
              <button
                className="mt-2 w-full bg-white text-black rounded-xl py-1 text-sm font-medium hover:bg-gray-200 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add liquidity logic here
                }}
              >
                Add Liquidity
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
