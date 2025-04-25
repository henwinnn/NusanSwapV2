"use client";

import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Percent, Settings2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface CardHeaderProps {
  isSlippageOpen: boolean;
  slippageTolerance: number;
  setIsSlippageOpen: (value: boolean) => void;
  handleSlippageChange: (value: number) => void;
}

export default function CardHeaderSlippage({
  isSlippageOpen,
  slippageTolerance,
  setIsSlippageOpen,
  handleSlippageChange,
}: CardHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-white font-medium">Swap Tokens</h2>
      <Popover open={isSlippageOpen} onOpenChange={setIsSlippageOpen}>
        <PopoverTrigger asChild>
          <motion.button
            className="flex items-center justify-center cursor-pointer w-8 h-8 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-750 hover:text-white transition-all duration-200"
            // whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: isSlippageOpen ? 180 : 0 }}
            transition={{ duration: 0 }}
          >
            <Settings2 className="w-4 h-4" />
            <span className="sr-only">Slippage Tolerance Settings</span>
          </motion.button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4 bg-gray-800 border-gray-700 text-white rounded-xl">
          <div className="space-y-4">
            <div className="flex items-center">
              <Percent className="w-4 h-4 mr-2 text-gray-400" />
              <h3 className="text-sm font-medium">Slippage Tolerance</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {[0.1, 0.5, 1.0, 2.0].map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSlippageChange(value)}
                  className={cn(
                    "rounded-full px-3 py-1 h-auto text-xs font-medium cursor-pointer",
                    slippageTolerance === value
                      ? "bg-white text-black border-white"
                      : "bg-gray-750 text-gray-300 border-gray-700 hover:bg-gray-700"
                  )}
                >
                  {value}%
                </Button>
              ))}
              <div className="flex items-center bg-gray-750 rounded-full px-3 py-1 border border-gray-700">
                <input
                  type="text"
                  value={
                    slippageTolerance === 0.1 ||
                    slippageTolerance === 0.5 ||
                    slippageTolerance === 1.0 ||
                    slippageTolerance === 2.0
                      ? ""
                      : slippageTolerance
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^(\d*\.?\d{0,1})$/.test(value) || value === "") {
                      handleSlippageChange(Number.parseFloat(value) || 0);
                    }
                  }}
                  className="w-10 bg-transparent text-white text-xs text-center focus:outline-none"
                  placeholder="Custom"
                />
                <span className="text-xs text-gray-400">%</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Your transaction will revert if the price changes unfavorably by
              more than this percentage.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
