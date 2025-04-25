"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"
import type { Token } from "./swap-interface"

interface RateDisplayProps {
  fromToken: Token
  toToken: Token
  rate: number
}

export default function RateDisplay({ fromToken, toToken, rate }: RateDisplayProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [prevRate, setPrevRate] = useState(rate)
  const [trend, setTrend] = useState<"up" | "down" | null>(null)

  useEffect(() => {
    if (prevRate !== rate) {
      setIsUpdating(true)
      setTrend(rate > prevRate ? "up" : "down")
      setPrevRate(rate)

      const timer = setTimeout(() => {
        setIsUpdating(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [rate, prevRate])

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-800/50">
      <div className="flex items-center">
        <motion.div
          animate={isUpdating ? { rotate: 360 } : {}}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="mr-2 text-gray-400"
        >
          <RefreshCw className="h-4 w-4" />
        </motion.div>
        <span className="text-sm text-gray-400">Exchange Rate</span>
      </div>

      <motion.div
        className="flex items-center"
        animate={{
          color:
            trend === "up"
              ? ["#ffffff", "#10b981", "#ffffff"]
              : trend === "down"
                ? ["#ffffff", "#ef4444", "#ffffff"]
                : "#ffffff",
        }}
        transition={{ duration: 1 }}
      >
        <span className="text-sm font-medium">1 {fromToken.symbol} = </span>
        <motion.span
          key={rate.toString()}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium"
        >
          {rate.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          })}
        </motion.span>
        <span className="text-sm font-medium ml-1">{toToken.symbol}</span>

        {trend && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="ml-1"
          >
            {trend === "up" ? "↑" : "↓"}
          </motion.span>
        )}
      </motion.div>
    </div>
  )
}

