import StableSwapABI from "../abi/StableSwapABI.json" assert { type: "json" }; // Import ABI dari file JSON
import idrxABI from "../abi/idrxABI.json" assert { type: "json" }; // Import ABI dari file JSON
import usdcABI from "../abi/usdcABI.json" assert { type: "json" }; // Import ABI dari file JSON
import eurcABI from "../abi/eurcABI.json" assert { type: "json" }; // Import ABI dari file JSON
import type { Address } from "viem";

export const stableSwapContract = {
  address: "0x3cf706CC14ba5d552f1357237E8ed848433c703A" as Address,
  abi: StableSwapABI.abi,
} as const;

export const IDRXContract = {
  address: "0xe8Cfe76957686F15C79853F36B441AaC60D630C1" as Address,
  abi: idrxABI.abi,
} as const;

export const USDCContract = {
  address: "0x917d538E1b50A1A4C821E9E70d3cbc95c46398E2" as Address,
  abi: usdcABI.abi,
} as const;

export const EURCContract = {
  address: "0x32c02cD6DE264146Aec46002ff1B7c85a8922f88" as Address,
  abi: eurcABI.abi,
} as const;
