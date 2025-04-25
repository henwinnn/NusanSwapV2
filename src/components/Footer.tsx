"use client";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.div
      className="mt-8 text-center text-gray-500 text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      <p>WOWOswap v1.0 • Simulated Exchange</p>
    </motion.div>
  );
}
