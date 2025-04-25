"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { Token } from "./swap-interface";

interface ConversionRateDisplayProps {
  fromToken: Token;
  toToken: Token;
  rate: string;
  rateHistory: number[];
}

export default function ConversionRateDisplay({
  fromToken,
  toToken,
  rate,
  rateHistory,
}: ConversionRateDisplayProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [prevRate, setPrevRate] = useState(rate);
  const [trend, setTrend] = useState<"up" | "down" | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw mini chart
  useEffect(() => {
    if (canvasRef.current && rateHistory.length > 1) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Calculate min and max for scaling
      const min = Math.min(...rateHistory) * 0.99;
      const max = Math.max(...rateHistory) * 1.01;
      const range = max - min;

      // Draw line
      ctx.beginPath();
      ctx.strokeStyle =
        trend === "up" ? "#10b981" : trend === "down" ? "#ef4444" : "#ffffff";
      ctx.lineWidth = 2;

      rateHistory.forEach((value, index) => {
        if (index === 0 && rateHistory.length === 1) {
          // If only one point, draw a horizontal line
          ctx.moveTo(0, height / 2);
          ctx.lineTo(width, height / 2);
        } else if (index === 0) {
          // First point
          const x = (index / (rateHistory.length - 1)) * width;
          const y = height - ((value - min) / range) * height;
          ctx.moveTo(x, y);
        } else {
          // Subsequent points
          const x = (index / (rateHistory.length - 1)) * width;
          const y = height - ((value - min) / range) * height;
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    }
  }, [rateHistory, trend]);

  useEffect(() => {
    if (prevRate !== rate) {
      setIsUpdating(true);
      setTrend(rate > prevRate ? "up" : "down");
      setPrevRate(rate);

      const timer = setTimeout(() => {
        setIsUpdating(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [rate, prevRate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <motion.div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Minimalist conversion rate display */}
        <div className="text-center">
          {/* Title */}
          <motion.h2
            className="text-gray-400 text-sm font-medium mb-1"
            animate={{ opacity: isHovered ? 1 : 0.7 }}
          >
            Live Exchange Rate
          </motion.h2>

          {/* Main rate display */}
          <div className="flex items-center justify-center mb-2">
            <motion.div
              className="flex items-center"
              animate={{
                x: isHovered ? -5 : 0,
                scale: isHovered ? 1.05 : 1,
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                style={{ backgroundColor: fromToken.color }}
              >
                <span className="text-xs font-bold text-white">
                  {fromToken.symbol.charAt(0)}
                </span>
              </div>
              <span className="text-white font-medium">{fromToken.symbol}</span>
            </motion.div>

            <motion.div
              className="mx-3"
              animate={{
                rotate: isUpdating ? 90 : 0,
                scale: isHovered ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {trend === "up" ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : trend === "down" ? (
                <TrendingDown className="h-5 w-5 text-red-500" />
              ) : (
                <span className="text-gray-400">→</span>
              )}
            </motion.div>

            <motion.div
              className="flex items-center"
              animate={{
                x: isHovered ? 5 : 0,
                scale: isHovered ? 1.05 : 1,
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                style={{ backgroundColor: toToken.color }}
              >
                <span className="text-xs font-bold text-white">
                  {toToken.symbol.charAt(0)}
                </span>
              </div>
              <span className="text-white font-medium">{toToken.symbol}</span>
            </motion.div>
          </div>

          {/* Rate value */}
          <motion.div
            key={rate.toString()}
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: isHovered ? 1.1 : 1,
            }}
            className={`text-4xl font-bold mb-2 ${
              trend === "up"
                ? "text-green-500"
                : trend === "down"
                ? "text-red-500"
                : "text-white"
            }`}
            transition={{ duration: 0.3 }}
          >
            {parseFloat(rate).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}
          </motion.div>

          {/* Mini chart - only visible on hover */}
          <motion.div
            className="h-12 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              height: isHovered ? 48 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <canvas
              ref={canvasRef}
              width={300}
              height={48}
              className="w-full h-full"
            />
          </motion.div>

          {/* Rate description */}
          <motion.p
            className="text-gray-400 text-xs mt-1"
            animate={{ opacity: isHovered ? 1 : 0.7 }}
          >
            1 {fromToken.symbol} ={" "}
            {parseFloat(rate).toLocaleString(undefined, {
              maximumFractionDigits: 6,
            })}{" "}
            {toToken.symbol}
          </motion.p>
        </div>

        {/* Pulse animation on rate update */}
        <AnimatePresence>
          {isUpdating && (
            <motion.div
              className="absolute inset-0 rounded-full bg-white/5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.2, scale: 1.2 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.5 }}
              style={{ zIndex: -1 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
