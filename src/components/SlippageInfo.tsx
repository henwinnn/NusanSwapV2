"use client";

interface SlippageInfoProps {
  slippageTolerance: number;
}

export default function SlippageInfo({ slippageTolerance }: SlippageInfoProps) {
  return (
    <div className="flex justify-between items-center text-xs text-gray-400 px-1">
      <span>Slippage Tolerance:</span>
      <span className="font-medium text-gray-300">{slippageTolerance}%</span>
    </div>
  );
}
