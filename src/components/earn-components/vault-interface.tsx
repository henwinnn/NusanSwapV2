"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatsCard from "@/components/ui/stats-card";
import TokenSelectorModal from "./token-selector-modal";
import OpportunitySelectorModal from "./opportunity-selector-modal";

// Sample token data
interface Token {
  symbol: string;
  name: string;
  address: string;
  balance: number;
  color: string;
}

interface Vault {
  id: string;
  name: string;
  symbol: string;
  color: string;
  apy: number;
  tvl: number;
  yearlyReward: number;
  riskLevel: "low" | "medium" | "high";
}

const tokenData: Token[] = [
  {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    address: "0x42000...00006",
    balance: 0,
    color: "#627EEA",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x83358...02913",
    balance: 0,
    color: "#2775CA",
  },
  {
    symbol: "WMATIC",
    name: "Wrapped Matic",
    address: "0x0d500...f1270",
    balance: 0,
    color: "#8247E5",
  },
  {
    symbol: "WETH",
    name: "Wrapped Ethereum (Polygon)",
    address: "0x7ceB2...9f619",
    balance: 0,
    color: "#627EEA",
  },
];

// Sample vault data
const vaultData: Vault[] = [
  {
    id: "usdc-vault",
    name: "USDC Vault",
    symbol: "USDC",
    color: "#2775CA",
    apy: 4.09,
    tvl: 18049217.72,
    yearlyReward: 0,
    riskLevel: "low",
  },
  {
    id: "eurc-vault",
    name: "EURC Vault",
    symbol: "EURC",
    color: "#0052B4",
    apy: 3.85,
    tvl: 12803322.32,
    yearlyReward: 0,
    riskLevel: "low",
  },
  {
    id: "idrx-vault",
    name: "IDRX Vault",
    symbol: "IDRX",
    color: "#FF0000",
    apy: 5.12,
    tvl: 9914782.1,
    yearlyReward: 0,
    riskLevel: "medium",
  },
  {
    id: "dai-vault",
    name: "DAI Vault",
    symbol: "DAI",
    color: "#F5AC37",
    apy: 4.28,
    tvl: 15782341.5,
    yearlyReward: 0,
    riskLevel: "low",
  },
  {
    id: "usdt-vault",
    name: "USDT Vault",
    symbol: "USDT",
    color: "#26A17B",
    apy: 3.45,
    tvl: 21567890.3,
    yearlyReward: 0,
    riskLevel: "low",
  },
  {
    id: "weth-vault",
    name: "WETH Vault",
    symbol: "WETH",
    color: "#627EEA",
    apy: 3.22,
    tvl: 8765432.1,
    yearlyReward: 0,
    riskLevel: "medium",
  },
  {
    id: "matic-vault",
    name: "MATIC Vault",
    symbol: "MATIC",
    color: "#8247E5",
    apy: 0.82,
    tvl: 5432109.8,
    yearlyReward: 0,
    riskLevel: "high",
  },
];

export default function VaultInterface() {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedVault, setSelectedVault] = useState<string | null>(null);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<string>("0.00");

  // New state variables for sorting and display
  const [sortCriteria, setSortCriteria] = useState<"apy" | "tvl" | "risk">(
    "apy"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showAllVaults, setShowAllVaults] = useState(false);

  // Calculate total stats
  const totalTVL = vaultData.reduce((sum, vault) => sum + vault.tvl, 0);
  const avgAPY =
    vaultData.reduce((sum, vault) => sum + vault.apy, 0) / vaultData.length;

  // Sort vaults based on criteria
  const sortVaults = () => {
    return [...vaultData].sort((a, b) => {
      let comparison = 0;

      if (sortCriteria === "apy") {
        comparison = a.apy - b.apy;
      } else if (sortCriteria === "tvl") {
        comparison = a.tvl - b.tvl;
      } else if (sortCriteria === "risk") {
        const riskOrder = { low: 1, medium: 2, high: 3 };
        comparison =
          riskOrder[a.riskLevel as keyof typeof riskOrder] -
          riskOrder[b.riskLevel as keyof typeof riskOrder];
      }

      return sortDirection === "desc" ? -comparison : comparison;
    });
  };

  // Get sorted vaults
  const sortedVaults = sortVaults();

  // Get vaults to display (top 3 or all)
  const displayedVaults = showAllVaults
    ? sortedVaults
    : sortedVaults.slice(0, 3);

  const handleConnectWallet = () => {
    setIsConnected(true);
  };

  const handleTokenSelect = (token: Token) => {
    setSelectedAsset(token.symbol);
    setDepositAmount("100.00"); // Set a default amount for demo
  };

  const handleVaultSelect = (vault: Vault) => {
    setSelectedVault(vault.name);
  };

  // const getSelectedToken = () => {
  //   return tokenData.find((token) => token.symbol === selectedAsset)
  // }

  const getSelectedVault = () => {
    return vaultData.find((vault) => vault.name === selectedVault);
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "desc" ? "asc" : "desc");
  };

  // Change sort criteria
  const changeSortCriteria = (criteria: "apy" | "tvl" | "risk") => {
    if (sortCriteria === criteria) {
      toggleSortDirection();
    } else {
      setSortCriteria(criteria);
      setSortDirection("desc");
    }
  };

  return (
    <div className="w-full max-w-3xl mt-24">
      {/* Title */}
      <motion.div
        className="flex flex-col items-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white tracking-tight">
          NusanSwap Vaults
        </h1>
        <p className="text-gray-400 mt-1">Earn yield on your stablecoins</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatsCard
          title="Total Value Locked"
          value={totalTVL}
          format="currency"
          prefix="$"
        />
        <StatsCard title="Average APY" value={avgAPY} format="percentage" />
      </div>

      {/* Main vault card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-gray-900 border-gray-800 shadow-xl overflow-hidden rounded-3xl">
          <CardContent className="p-6 space-y-6">
            {/* Asset Selection */}
            <div className="space-y-2">
              <h3 className="text-gray-400 text-sm">Asset</h3>
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-light text-white">
                      {selectedAsset ? depositAmount : "0.00"}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {selectedAsset
                        ? `${selectedAsset} Selected`
                        : "No token selected"}
                    </p>
                  </div>
                  <Button
                    className="bg-white hover:bg-gray-100 text-black rounded-full px-4 py-2 flex items-center"
                    onClick={() => setIsTokenModalOpen(true)}
                  >
                    Select
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Opportunity Selection */}
            <div className="space-y-2">
              <h3 className="text-gray-400 text-sm">Opportunity</h3>
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-medium text-white">
                      {selectedVault
                        ? `${getSelectedVault()?.apy.toFixed(2)}% APY`
                        : `Up to ${avgAPY.toFixed(2)}% APY`}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {selectedVault
                        ? `${selectedVault}`
                        : "Select a vault to deposit"}
                    </p>
                  </div>
                  <Button
                    className="bg-white hover:bg-gray-100 text-black rounded-full px-4 py-2 flex items-center"
                    onClick={() => setIsVaultModalOpen(true)}
                  >
                    Select
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Available Vaults with Sorting */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-400 text-sm">Available Vaults</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-gray-400 hover:text-white"
                    >
                      <Filter className="h-4 w-4 mr-1" />
                      Sort by: {sortCriteria.toUpperCase()}
                      {sortDirection === "desc" ? (
                        <ChevronDown className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronUp className="h-4 w-4 ml-1" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-gray-800 border-gray-700 text-white"
                  >
                    <DropdownMenuItem
                      onClick={() => changeSortCriteria("apy")}
                      className="cursor-pointer hover:bg-gray-700"
                    >
                      APY{" "}
                      {sortCriteria === "apy" &&
                        (sortDirection === "desc" ? "↓" : "↑")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => changeSortCriteria("tvl")}
                      className="cursor-pointer hover:bg-gray-700"
                    >
                      TVL{" "}
                      {sortCriteria === "tvl" &&
                        (sortDirection === "desc" ? "↓" : "↑")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => changeSortCriteria("risk")}
                      className="cursor-pointer hover:bg-gray-700"
                    >
                      Risk Level{" "}
                      {sortCriteria === "risk" &&
                        (sortDirection === "desc" ? "↓" : "↑")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                {displayedVaults.map((vault) => (
                  <div
                    key={vault.id}
                    className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedVault(vault.name);
                    }}
                  >
                    <div className="flex justify-between items-center">
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
                          <h3 className="font-medium text-white">
                            {vault.name}
                          </h3>
                          <div className="flex items-center">
                            <p className="text-gray-400 text-sm">
                              TVL: $
                              {vault.tvl.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <span className="mx-2 text-gray-500">•</span>
                            <p
                              className={`text-sm ${
                                vault.riskLevel === "low"
                                  ? "text-green-400"
                                  : vault.riskLevel === "medium"
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                            >
                              {vault.riskLevel.charAt(0).toUpperCase() +
                                vault.riskLevel.slice(1)}{" "}
                              Risk
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">
                          {vault.apy.toFixed(2)}% APY
                        </p>
                        <p className="text-gray-400 text-sm">Variable rate</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More/Less Button */}
              {vaultData.length > 3 && (
                <Button
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white hover:bg-gray-800 mt-2"
                  onClick={() => setShowAllVaults(!showAllVaults)}
                >
                  {showAllVaults ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" /> Show Fewer Vaults
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" /> Show More Vaults
                      ({vaultData.length - 3} more)
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Select Token Or Opportunity Button */}
            <Button
              className="w-full h-14 text-lg font-medium bg-white hover:bg-gray-100 text-black rounded-full transition-all duration-300"
              onClick={
                isConnected
                  ? () => setIsTokenModalOpen(true)
                  : handleConnectWallet
              }
            >
              <motion.div
                className="flex items-center justify-center"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <>Select Token or Opportunity</>
              </motion.div>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Token Selector Modal */}
      <TokenSelectorModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        onSelect={handleTokenSelect}
        tokens={tokenData}
      />

      {/* Opportunity Selector Modal */}
      <OpportunitySelectorModal
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        onSelect={handleVaultSelect}
        vaults={vaultData}
      />

      {/* Footer */}
      <motion.div
        className="mt-8 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p>NusanSwap v1.0 • Yield Vaults</p>
      </motion.div>
    </div>
  );
}
