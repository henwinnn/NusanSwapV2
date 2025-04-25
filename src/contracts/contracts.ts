import StableSwapABI from "../abi/StableSwapABI.json" assert { type: "json" }; // Import ABI dari file JSON
import idrxABI from "../abi/idrxABI.json" assert { type: "json" }; // Import ABI dari file JSON
import usdcABI from "../abi/usdcABI.json" assert { type: "json" }; // Import ABI dari file JSON
import eurcABI from "../abi/eurcABI.json" assert { type: "json" }; // Import ABI dari file JSON
import type { Address } from "viem";

export const stableSwapContract = {
  address: "0x60D761a20794B10EB63385a91e851211B119279E" as Address,
  abi: StableSwapABI.abi,
} as const;

export const IDRXContract = {
  address: "0x3aa7F0BE54a24061229f7c2a4d8c1aA832b014F7" as Address,
  abi: idrxABI.abi,
} as const;

export const USDCContract = {
  address: "0xA22C3A30eE83Fd0a9dcBaf189373A127F55519c8" as Address,
  abi: usdcABI.abi,
} as const;

export const EURCContract = {
  address: "0xD2D6635E5d79c4852b44Ff9138E74b11dD55386c" as Address,
  abi: eurcABI.abi,
} as const;
