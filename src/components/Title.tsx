"use client";

import { motion } from "framer-motion";

export default function Title() {
  return (
    <motion.div
      className="flex flex-col items-center mb-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-white tracking-tight">WOWOSwap</h1>
      <p className="text-gray-400 mt-1">Seamless Stablecoin Swaps</p>
    </motion.div>
  );
}
