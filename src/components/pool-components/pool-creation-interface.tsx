"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Info, ArrowRight, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import TokenSelector from "../token-selector";
import type { Token } from "../swap-interface";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Sample tokens for selection
const availableTokens: Token[] = [
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    color: "#2775CA",
    balance: BigInt(125075),
    index: 0,
  },
  {
    id: "eurc",
    name: "Euro Coin",
    symbol: "EURC",
    color: "#0052B4",
    balance: BigInt(89032),
    index: 1,
  },
  {
    id: "idrx",
    name: "Indonesian Rupiah",
    symbol: "IDRX",
    color: "#FF0000",
    balance: BigInt(7500000),
    index: 2,
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    color: "#14F195",
    balance: BigInt(4550),
    index: 3,
  },
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    color: "#F7931A",
    balance: BigInt(50),
    index: 4,
  },
];

// Fee tiers
const feeTiers = [
  { value: "0.01", label: "0.01% - Best for very stable pairs" },
  { value: "0.05", label: "0.05% - Best for stable pairs" },
  { value: "0.3", label: "0.3% - Best for most pairs" },
  { value: "1", label: "1% - Best for exotic pairs" },
];

// Bin steps
const binSteps = [
  { value: "0.01", label: "0.01 - Very narrow price range" },
  { value: "0.1", label: "0.1 - Narrow price range" },
  { value: "0.5", label: "0.5 - Medium price range" },
  { value: "1", label: "1.0 - Wide price range" },
];

export default function PoolCreationInterface() {
  const router = useRouter();
  const [baseToken, setBaseToken] = useState<Token>(availableTokens[0]);
  const [quoteTokens, setQuoteTokens] = useState<Token[]>([availableTokens[1]]);
  const [feeTier, setFeeTier] = useState("0.3");
  const [binStep, setBinStep] = useState("0.1");
  const [initialPrice, setInitialPrice] = useState("");
  const [isMultiPool, setIsMultiPool] = useState(false);

  const addQuoteToken = () => {
    if (quoteTokens.length < 2) {
      const availableToken = availableTokens.find(
        (token) =>
          token.id !== baseToken.id &&
          !quoteTokens.some((qt) => qt.id === token.id)
      );
      if (availableToken) {
        setQuoteTokens([...quoteTokens, availableToken]);
        setIsMultiPool(true);
      }
    }
  };

  const removeQuoteToken = (index: number) => {
    if (quoteTokens.length > 1) {
      const newQuoteTokens = [...quoteTokens];
      newQuoteTokens.splice(index, 1);
      setQuoteTokens(newQuoteTokens);
      setIsMultiPool(newQuoteTokens.length > 1);
    }
  };

  const updateQuoteToken = (token: Token, index: number) => {
    const newQuoteTokens = [...quoteTokens];
    newQuoteTokens[index] = token;
    setQuoteTokens(newQuoteTokens);
  };

  const handleInitialPriceChange = (value: string) => {
    if (/^(\d*\.?\d{0,8})$/.test(value) || value === "") {
      setInitialPrice(value);
    }
  };

  const handleCreatePool = () => {
    console.log({
      baseToken,
      quoteTokens,
      feeTier,
      binStep,
      initialPrice,
      isMultiPool,
    });
    router.push("/pool");
  };

  const getAvailableTokensForSelector = (
    currentToken: Token,
    isBase: boolean
  ) => {
    if (isBase) {
      return availableTokens.filter(
        (token) => !quoteTokens.some((qt) => qt.id === token.id)
      );
    } else {
      return availableTokens.filter(
        (token) =>
          token.id !== baseToken.id &&
          !quoteTokens.some(
            (qt) => qt.id !== currentToken.id && qt.id === token.id
          )
      );
    }
  };

  return (
    <div className="w-full max-w-2xl mt-24">
      <motion.div
        className="flex flex-col items-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Pool Creation
        </h1>
        <p className="text-gray-400 mt-1">Select tokens for pool creation</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-gray-900 border-gray-800 shadow-xl overflow-hidden rounded-3xl">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="text-white font-medium">Base token</h3>
                </div>
                <TokenSelector
                  selectedToken={baseToken}
                  tokens={getAvailableTokensForSelector(baseToken, true)}
                  onSelect={setBaseToken}
                  otherTokenId={quoteTokens[0]?.id || ""}
                />
                <div className="mt-2 flex items-center text-orange-500 text-sm bg-orange-500/10 p-2 rounded-lg">
                  <Info className="h-4 w-4 mr-2" />
                  <span>
                    USDC is usually set as the base token when paired with other
                    tokens.
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">
                    Quote token{quoteTokens.length > 1 ? "s" : ""}
                  </h3>
                  {quoteTokens.length < 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
                      onClick={addQuoteToken}
                    >
                      Add token
                    </Button>
                  )}
                </div>

                {quoteTokens.map((token, index) => (
                  <div key={index} className="mb-2 flex items-center">
                    <TokenSelector
                      selectedToken={token}
                      tokens={getAvailableTokensForSelector(token, false)}
                      onSelect={(t) => updateQuoteToken(t, index)}
                      otherTokenId={baseToken.id}
                    />
                    {quoteTokens.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 text-gray-400 hover:text-white"
                        onClick={() => removeQuoteToken(index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}

                <div className="mt-2 text-gray-400 text-sm">
                  {isMultiPool ? (
                    <p>
                      Creating a multi-token pool with {quoteTokens.length}{" "}
                      quote tokens.
                    </p>
                  ) : (
                    <p>
                      For {baseToken.symbol}-{quoteTokens[0].symbol},{" "}
                      {baseToken.symbol} is the base token, and{" "}
                      {quoteTokens[0].symbol} is the quote token representing
                      the price of {baseToken.symbol}.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <h3 className="text-white font-medium">Base Fee</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-800 border-gray-700 text-white">
                        <p className="max-w-xs">
                          The fee tier determines the fee charged to users for
                          swapping in this pool. Higher fees can compensate for
                          higher volatility.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select value={feeTier} onValueChange={setFeeTier}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white rounded-xl">
                    <SelectValue placeholder="Select Base Fee" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {feeTiers.map((tier) => (
                      <SelectItem
                        key={tier.value}
                        value={tier.value}
                        className="hover:bg-gray-700"
                      >
                        {tier.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <h3 className="text-white font-medium">Bin Step</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-800 border-gray-700 text-white">
                        <p className="max-w-xs">
                          The bin step determines the price range for each bin
                          in the pool. Smaller bin steps provide more precise
                          pricing but may require more gas for swaps.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select value={binStep} onValueChange={setBinStep}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white rounded-xl">
                    <SelectValue placeholder="Select Bin Step" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {binSteps.map((step) => (
                      <SelectItem
                        key={step.value}
                        value={step.value}
                        className="hover:bg-gray-700"
                      >
                        {step.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <h3 className="text-white font-medium">Initial Price</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-800 border-gray-700 text-white">
                        <p className="max-w-xs">
                          The initial price sets the starting exchange rate for
                          the pool. This should be close to the current market
                          price.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={initialPrice}
                    onChange={(e) => handleInitialPriceChange(e.target.value)}
                    className="w-full bg-gray-800 border-0 rounded-xl p-3 text-white text-xl focus:ring-2 focus:ring-white/20 focus:outline-none transition-all duration-300 hover:bg-gray-750 focus:bg-gray-750"
                    placeholder="0.00"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 flex items-center">
                    <span>
                      {quoteTokens[0].symbol} per {baseToken.symbol}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-center text-gray-400 text-sm">
                  <div className="flex items-center">
                    <span>
                      Estimated market price: 0.007774 {quoteTokens[0].symbol}{" "}
                      per {baseToken.symbol}
                    </span>
                    <button className="ml-2 text-blue-400 hover:text-blue-300 flex items-center">
                      <span className="text-xs underline">Verify</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full h-14 text-lg font-medium bg-white hover:bg-gray-200 text-black rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  onClick={handleCreatePool}
                  disabled={!initialPrice || Number(initialPrice) <= 0}
                >
                  <motion.div
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    Create Pool
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="mt-8 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p>WOWOSwap v1.0 • Pool Creation</p>
      </motion.div>
    </div>
  );
}
