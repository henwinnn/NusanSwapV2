"use client";

import { Token } from "./swap-interface";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface SwapButtonProps {
  fromToken: Token;
  toToken: Token;
  amount: string;
  address: `0x${string}` | undefined;
  hasEnoughBalance: boolean;
  isConnected: boolean;
  handleSwapTransaction: () => void;
}

const getButtonTitle = (
  hasEnoughBalance: boolean,
  isConnected: boolean
): string => {
  if (!isConnected) {
    return "Wallet Not Connected";
  } else if (hasEnoughBalance) {
    return "Swap";
  } else {
    return "Insufficient Funds";
  }
};

export default function SwapButton({
  fromToken,
  toToken,
  amount,
  address,
  hasEnoughBalance,
  isConnected,
  handleSwapTransaction,
}: SwapButtonProps) {
  console.log("isConnected", isConnected);
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        className="w-full h-14 text-lg font-medium bg-white hover:bg-gray-200 text-black rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
        onClick={handleSwapTransaction}
        disabled={
          !amount ||
          !address ||
          fromToken.id === toToken.id ||
          !hasEnoughBalance ||
          !isConnected
        }
      >
        <motion.div
          className="flex items-center"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {getButtonTitle(hasEnoughBalance, isConnected)}
          <ArrowRight className="ml-2 w-5 h-5" />
        </motion.div>
      </Button>
    </motion.div>
  );
}
