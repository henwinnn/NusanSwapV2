import StableSwapABI from "../abi/StableSwapABI.json" assert { type: "json" }; // Import ABI dari file JSON
import idrxABI from "../abi/idrxABI.json" assert { type: "json" }; // Import ABI dari file JSON
import usdcABI from "../abi/usdcABI.json" assert { type: "json" }; // Import ABI dari file JSON
import eurcABI from "../abi/eurcABI.json" assert { type: "json" }; // Import ABI dari file JSON
import type { Address } from "viem";

export const stableSwapContract = {
  address: "0xd4C8A44fb17C722A33bBe417Db5E59590010c2e1" as Address,
  abi: StableSwapABI.abi,
} as const;

export const IDRXContract = {
  address: "0xD63029C1a3dA68b51c67c6D1DeC3DEe50D681661" as Address,
  abi: idrxABI.abi,
} as const;

export const USDCContract = {
  address: "0xDE69fF1232314CC96B48d862EC5bFEb927F79444" as Address,
  abi: usdcABI.abi,
} as const;

export const EURCContract = {
  address: "0xA8A5582c0Eb9ff39edB05aB7534B4A4c750fba17" as Address,
  abi: eurcABI.abi,
} as const;
