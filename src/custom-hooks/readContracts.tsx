import { useReadContract, useReadContracts } from "wagmi";
import {
  IDRXContract,
  USDCContract,
  EURCContract,
  stableSwapContract,
} from "../contracts/contracts";
// import { formatEther } from "viem";
// import { formatEUR, formatIDR, formatUSD } from "@/util/helper";

export const useFetchBalances = (userAddress: `0x${string}` | undefined) => {
  const { data, error, isLoading } = useReadContracts({
    contracts: [
      {
        ...IDRXContract,
        functionName: "balanceOf",
        args: [userAddress],
      },
      {
        ...USDCContract,
        functionName: "balanceOf",
        args: [userAddress],
      },
      {
        ...EURCContract,
        functionName: "balanceOf",
        args: [userAddress],
      },
    ],
  });

  // Map the data to a more usable format
  const balances = data
    ? data.map((balance) => ({
        status: balance.status,
        result: balance.result,
        error: balance.error,
      }))
    : [];

  return {
    balances,
    error,
    isLoading,
  };
};

interface Token {
  id: string;
  index: number;
  name: string;
  symbol: string;
  color: string;
  balance: bigint;
}

export function TokensMapping(address: `0x${string}` | undefined): Token[] {
  const { balances } = useFetchBalances(address);
  const tokens: Token[] = [
    {
      id: "idrx",
      index: 0,
      name: "Indonesian Rupiah",
      symbol: "IDRX",
      color: "#FF0000",
      balance:
        balances[0]?.status === "success"
          ? (balances[0].result as bigint)
          : BigInt(0),
    },
    {
      id: "usdc",
      index: 1,
      name: "USD Coin",
      symbol: "USDC",
      color: "#2775CA",
      balance:
        balances[1]?.status === "success"
          ? (balances[1].result as bigint)
          : BigInt(0),
    },
    {
      id: "eurc",
      index: 2,
      name: "Euro Coin",
      symbol: "EURC",
      color: "#0052B4",
      balance:
        balances[2]?.status === "success"
          ? (balances[2].result as bigint)
          : BigInt(0),
    },
  ];

  return tokens;
}

export const usePoolBalances = () => {
  const { data: balanceIDR } = useReadContract({
    address: stableSwapContract.address,
    abi: stableSwapContract.abi,
    functionName: "balances",
    args: [0],
  }) as { data: bigint };
  const { data: balanceUSD } = useReadContract({
    address: stableSwapContract.address,
    abi: stableSwapContract.abi,
    functionName: "balances",
    args: [1],
  }) as { data: bigint };
  const { data: balanceEUR } = useReadContract({
    address: stableSwapContract.address,
    abi: stableSwapContract.abi,
    functionName: "balances",
    args: [2],
  }) as { data: bigint };
  const balances: bigint[] = [balanceIDR, balanceUSD, balanceEUR];
  return balances;
};
