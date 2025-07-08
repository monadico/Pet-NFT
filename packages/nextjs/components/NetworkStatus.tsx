"use client";

import { useAccount } from 'wagmi';

/**
 * A component that displays the user's network status using wagmi v2 patterns.
 * This follows the canonical patterns described in the developer guide.
 */
export const NetworkStatus = () => {
  const { chain, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
        <span>Please connect your wallet to continue.</span>
      </div>
    );
  }

  // 🚨 WAGMI V2 PATTERN: Core verification logic
  // If `useAccount` returns `isConnected: true` but `chain: undefined`,
  // it means the wallet is connected to a chain that is not present
  // in the `chains` array of your `createConfig` function.
  if (!chain) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
        <span>You are connected to an unsupported network.</span>
      </div>
    );
  }

  // If we reach this point, the user is connected to a supported network.
  return (
    <div className="flex items-center gap-2 text-sm text-green-600">
      <div className="w-2 h-2 rounded-full bg-green-500"></div>
      <span>Connected to: {chain.name} (ID: {chain.id})</span>
    </div>
  );
}; 