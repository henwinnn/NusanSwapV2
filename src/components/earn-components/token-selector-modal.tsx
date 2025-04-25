"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import UIModal from "@/components/ui/ui-modal";

interface TokenData {
  symbol: string;
  name: string;
  address: string;
  balance: number;
  color: string;
  icon?: string;
}

interface TokenSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: TokenData) => void;
  tokens: TokenData[];
}

export default function TokenSelectorModal({
  isOpen,
  onClose,
  onSelect,
  tokens,
}: TokenSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Filter tokens based on search query and active filter
  const filteredTokens = tokens.filter((token) => {
    const matchesSearch =
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "stables") {
      return (
        matchesSearch &&
        ["USDC", "USDT", "DAI", "EURC", "IDRX"].includes(token.symbol)
      );
    }
    if (activeFilter === "other") {
      return (
        matchesSearch &&
        !["USDC", "USDT", "DAI", "EURC", "IDRX"].includes(token.symbol)
      );
    }
    return matchesSearch;
  });

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Token"
      className="max-w-lg"
    >
      {/* Search Input */}
      <div className="p-4 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="0x... or Name"
            className="w-full bg-gray-50 border-0 rounded-xl py-3 pl-10 pr-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center px-6 py-4 w-full">
        <div className="flex space-x-5">
          <button
            className={`px-8 py-2 rounded-full border ${
              activeFilter === "all"
                ? "bg-blue-50 border-blue-200 text-blue-800"
                : "bg-white border-gray-200 text-gray-600"
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          <button
            className={`px-8 py-2 rounded-full border ${
              activeFilter === "stables"
                ? "bg-blue-50 border-blue-200 text-blue-800"
                : "bg-white border-gray-200 text-gray-600"
            }`}
            onClick={() => setActiveFilter("stables")}
          >
            Stables
          </button>
          <button
            className={`px-8 py-2 rounded-full border ${
              activeFilter === "other"
                ? "bg-blue-50 border-blue-200 text-blue-800"
                : "bg-white border-gray-200 text-gray-600"
            }`}
            onClick={() => setActiveFilter("other")}
          >
            Other
          </button>
        </div>

        <div className="relative ml-5">
          <button className="flex items-center px-4 py-2 rounded-full border border-gray-200 text-gray-600 whitespace-nowrap">
            All networks
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Token List */}
      <div className="max-h-[400px] overflow-y-auto">
        {filteredTokens.map((token) => (
          <div
            key={token.address}
            className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-t border-gray-100"
            onClick={() => {
              onSelect(token);
              onClose();
            }}
          >
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: token.color }}
              >
                <span className="text-sm font-bold text-white">
                  {token.symbol.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{token.symbol}</h3>
                <p className="text-gray-500 text-sm">
                  {token.address.substring(0, 6)}...
                  {token.address.substring(token.address.length - 5)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">0.00</p>
              <p className="text-gray-500 text-sm">N/A</p>
            </div>
          </div>
        ))}
      </div>
    </UIModal>
  );
}
