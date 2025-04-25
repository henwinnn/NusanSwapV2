"use client";

import { useState } from "react";
import { ChevronDown, ArrowDown, HelpCircle } from "lucide-react";
import UIModal from "@/components/ui/ui-modal";

interface VaultData {
  id: string;
  name: string;
  symbol: string;
  color: string;
  apy: number;
  tvl: number;
  yearlyReward: number;
  riskLevel: "low" | "medium" | "high";
}

interface OpportunitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (vault: VaultData) => void;
  vaults: VaultData[];
}

export default function OpportunitySelectorModal({
  isOpen,
  onClose,
  onSelect,
  vaults,
}: OpportunitySelectorModalProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortByAPY, setSortByAPY] = useState(true);

  // Sort vaults by APY (descending)
  const sortedVaults = [...vaults].sort((a, b) =>
    sortByAPY ? b.apy - a.apy : a.apy - b.apy
  );

  return (
    <UIModal isOpen={isOpen} onClose={onClose} title="Select Opportunity">
      {/* Filters */}
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex space-x-2">
          <button
            className={`px-6 py-2 rounded-full border ${
              activeFilter === "all"
                ? "bg-blue-50 border-blue-200 text-blue-800"
                : "bg-white border-gray-200 text-gray-600"
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
        </div>

        <div className="relative">
          <button className="flex items-center px-4 py-2 rounded-full border border-gray-200 text-gray-600">
            All networks
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
        <div className="text-gray-500 text-sm">Asset</div>
        <div className="flex items-center">
          <button
            className="text-gray-500 text-sm flex items-center"
            onClick={() => setSortByAPY(!sortByAPY)}
          >
            APY
            <ArrowDown
              className={`ml-1 h-4 w-4 transition-transform ${
                sortByAPY ? "" : "rotate-180"
              }`}
            />
          </button>
          <div className="text-gray-500 text-sm ml-8">Info</div>
        </div>
      </div>

      {/* Vault List */}
      <div className="max-h-[400px] overflow-y-auto">
        {sortedVaults.map((vault) => (
          <div
            key={vault.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-t border-gray-100"
            onClick={() => {
              onSelect(vault);
              onClose();
            }}
          >
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: vault.color }}
              >
                <span className="text-sm font-bold text-white">
                  {vault.symbol.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{vault.name}</h3>
                <p className="text-blue-500 text-sm">
                  + ${vault.yearlyReward.toFixed(2)} over 1y
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="font-bold text-gray-900 text-xl">
                {vault.apy.toFixed(2)}%
              </p>
              <button className="ml-6 text-gray-400">
                <HelpCircle className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </UIModal>
  );
}
