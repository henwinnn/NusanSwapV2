"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import PoolRow from "./pool-row";
import StatsCard from "../ui/stats-card";
// import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

// Sample data for pools
const poolsData = [
  {
    id: "1",
    name: "USDC-EURC-IDRX",
    tokens: [
      { symbol: "USDC", color: "#2775CA" },
      { symbol: "EURC", color: "#0052B4" },
      { symbol: "IDRX", color: "#FF0000" },
    ],
    poolCount: 1,
    tvl: 18049217.72,
    volume24h: 81430575.0,
    fee: 0.57,
  },
  {
    id: "2",
    name: "USDC-EURC",
    tokens: [
      { symbol: "USDC", color: "#2775CA" },
      { symbol: "EURC", color: "#0052B4" },
    ],
    poolCount: 59,
    tvl: 328803322.32,
    volume24h: 101262815.0,
    fee: 0.15,
  },
  {
    id: "3",
    name: "USDC-IDRX",
    tokens: [
      { symbol: "USDC", color: "#2775CA" },
      { symbol: "IDRX", color: "#FF0000" },
    ],
    poolCount: 36,
    tvl: 1914782.1,
    volume24h: 30551457.0,
    fee: 0.3,
  },
  {
    id: "4",
    name: "EURC-IDRX",
    tokens: [
      { symbol: "EURC", color: "#0052B4" },
      { symbol: "IDRX", color: "#FF0000" },
    ],
    poolCount: 38,
    tvl: 4569370.18,
    volume24h: 10812556.0,
    fee: 0.28,
  },
];

export default function PoolsInterface() {
  // const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFrame, setTimeFrame] = useState<"24h" | "ALL">("24h");

  // Filter pools based on search query
  const filteredPools = poolsData.filter((pool) =>
    pool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total stats
  const totalTVL = poolsData.reduce((sum, pool) => sum + pool.tvl, 0);
  const totalVolume = poolsData.reduce((sum, pool) => sum + pool.volume24h, 0);

  return (
    <div className="w-full max-w-6xl mt-24">
      {/* Title */}
      <motion.div
        className="flex flex-col items-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white tracking-tight">
          WOWOswap Pools
        </h1>
        <p className="text-gray-400 mt-1">Provide liquidity and earn fees</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatsCard
          title="Total Value Locked"
          value={totalTVL}
          format="currency"
          prefix="$"
        />
        <StatsCard
          title="Swap Volume"
          value={totalVolume}
          format="currency"
          prefix="$"
          timeFrame={timeFrame}
          onTimeFrameChange={setTimeFrame}
        />
      </div>

      {/* Main pools card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-gray-900 border-gray-800 shadow-xl overflow-hidden rounded-3xl">
          <CardContent className="p-0">
            {/* Search and Create Pool */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by token name, symbol, mint"
                  className="w-full bg-gray-800 border-0 rounded-xl py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-white/20 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* <Button
                className="ml-4 bg-gray-200 hover:bg-white text-black rounded-xl px-4 py-2 flex items-center"
                onClick={() => router.push("/pool/create")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Pool
              </Button> */}
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 text-sm text-gray-400 border-b border-gray-800">
              <div className="col-span-4">Pool</div>
              <div className="col-span-3 flex items-center">
                TVL <ChevronDown className="h-4 w-4 ml-1" />
              </div>
              <div className="col-span-3 flex items-center">
                Vol <ChevronDown className="h-4 w-4 ml-1" />
              </div>
              <div className="col-span-2 flex items-center">
                Fee/TVL <ChevronDown className="h-4 w-4 ml-1" />
              </div>
            </div>

            {/* Pool Rows */}
            <div className="divide-y divide-gray-800">
              {filteredPools.length > 0 ? (
                filteredPools.map((pool) => (
                  <PoolRow key={pool.id} pool={pool} />
                ))
              ) : (
                <div className="p-8 text-center text-gray-400">
                  No pools found matching your search criteria
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="mt-8 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p>WOWOSwap v1.0 • Liquidity Pools</p>
      </motion.div>
    </div>
  );
}
