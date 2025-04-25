"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: number
  format: "currency" | "percentage" | "number"
  prefix?: string
  timeFrame?: "24h" | "ALL"
  onTimeFrameChange?: (timeFrame: "24h" | "ALL") => void
}

export default function StatsCard({ title, value, format, prefix, timeFrame, onTimeFrameChange }: StatsCardProps) {
  const formattedValue =
    format === "currency"
      ? `${prefix || ""}${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      : format === "percentage"
        ? `${value.toFixed(2)}%`
        : value.toLocaleString()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-gray-900 border-gray-800 shadow-xl overflow-hidden rounded-3xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-400 text-sm">{title}</h3>
            {timeFrame && onTimeFrameChange && (
              <div className="flex text-xs bg-gray-800 rounded-lg overflow-hidden">
                <button
                  className={`px-2 py-1 ${timeFrame === "24h" ? "bg-gray-700 text-white" : "text-gray-400"}`}
                  onClick={() => onTimeFrameChange("24h")}
                >
                  24H
                </button>
                <button
                  className={`px-2 py-1 ${timeFrame === "ALL" ? "bg-gray-700 text-white" : "text-gray-400"}`}
                  onClick={() => onTimeFrameChange("ALL")}
                >
                  ALL
                </button>
              </div>
            )}
          </div>
          <div className="text-3xl font-bold text-white">{formattedValue}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
