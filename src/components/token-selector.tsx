"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Token } from "./swap-interface"

interface TokenSelectorProps {
  selectedToken: Token;
  otherTokenId: string;
  tokens: Token[];
  onSelect: (token: Token) => void;
}

export default function TokenSelector({
  selectedToken,
  otherTokenId,
  tokens,
  onSelect,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-white h-[52px] pl-3 pr-2 rounded-xl transition-all duration-300 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <div
                className="w-6 h-6 rounded-full mr-2 flex items-center justify-center"
                style={{ backgroundColor: selectedToken.color }}
              >
                <span className="text-xs font-bold text-white">
                  {selectedToken.symbol.charAt(0)}
                </span>
              </div>
              <span className="font-medium mr-1">{selectedToken.symbol}</span>
            </div>
            <motion.div
              animate={{
                rotate: isOpen ? 180 : 0,
                x: isHovered && !isOpen ? 3 : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4 opacity-70" />
            </motion.div>
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-gray-800 border-gray-700 text-white min-w-[160px] rounded-xl overflow-hidden"
        align="start"
      >
        <AnimatePresence>
          {tokens.map((token) => (
            <DropdownMenuItem
              key={token.id}
              disabled={token.id == otherTokenId}
              className={cn(
                "flex items-center py-2 px-3 cursor-pointer hover:bg-gray-700 transition-all duration-200",
                selectedToken.id === token.id && "bg-gray-700"
              )}
              onClick={() => {
                if (token.id !== otherTokenId) {
                  onSelect(token);
                  setIsOpen(false);
                }
              }}
            >
              <motion.div
                className="flex items-center w-full"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                transition={{ duration: 0.15 }}
                whileHover={{ x: 2 }}
              >
                <div
                  className="w-6 h-6 rounded-full mr-2 flex items-center justify-center"
                  style={{ backgroundColor: token.color }}
                >
                  <span className="text-xs font-bold text-white">
                    {token.symbol.charAt(0)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{token.symbol}</span>
                  <span className="text-xs text-gray-400">{token.name}</span>
                </div>
                {selectedToken.id === token.id && (
                  <Check className="ml-auto h-4 w-4 text-white" />
                )}
              </motion.div>
            </DropdownMenuItem>
          ))}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

