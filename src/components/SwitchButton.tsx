"use client";

import { motion } from "framer-motion";
import { ArrowDownUp } from "lucide-react";

interface InputTokenProps {
  isSwapping: boolean;
  handleSwap: () => void;
}

export default function SwitchButton({
  isSwapping,
  handleSwap,
}: InputTokenProps) {
  return (
    <div className="relative flex justify-center">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-700" />
      </div>
      <motion.button
        whileHover={{
          scale: 1.1,
          rotate: 180,
          backgroundColor: "#ffffff",
          color: "#000000",
        }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isSwapping ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleSwap}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 border border-gray-700 text-white shadow-lg cursor-pointer"
      >
        <ArrowDownUp className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
