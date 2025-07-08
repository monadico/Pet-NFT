"use client";

import { useEffect, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import scaffoldConfig from "../scaffold.config";

export const NetworkEnforcer = () => {
  const [mounted, setMounted] = useState(false);
  const [lastChainId, setLastChainId] = useState<number | undefined>(undefined);
  
  // 🚨 WAGMI V2 PATTERN: Use useAccount as single source of truth
  const { chain, isConnected } = useAccount();
  const { switchChain, isPending, error } = useSwitchChain();
  
  // Get current chain ID (can be from connected chain or unknown network)
  const currentChainId = chain?.id;
  const targetNetwork = scaffoldConfig.targetNetworks[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track network changes for enforcement
  useEffect(() => {
    if (!mounted) return;
    
    // Log network change if chainId changed
    if (currentChainId !== lastChainId && lastChainId !== undefined) {
      console.log(`🔄 Network changed: ${getNetworkName(lastChainId)} → ${getNetworkName(currentChainId)}`);
    }
    
    setLastChainId(currentChainId);
  }, [mounted, currentChainId, lastChainId]);

  // Helper function to get network name
  const getNetworkName = (id: number | undefined) => {
    if (!id) return 'Unknown';
    const networks: Record<number, string> = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      11155111: 'Sepolia Testnet',
      137: 'Polygon Mainnet',
      80001: 'Polygon Mumbai',
      56: 'BSC Mainnet',
      97: 'BSC Testnet',
      43114: 'Avalanche Mainnet',
      43113: 'Avalanche Fuji',
      250: 'Fantom Mainnet',
      4002: 'Fantom Testnet',
      42161: 'Arbitrum One',
      421613: 'Arbitrum Goerli',
      10: 'Optimism',
      420: 'Optimism Goerli',
      8453: 'Base',
      84531: 'Base Goerli',
      10143: 'Monad Testnet',
      31337: 'Localhost',
    };
    return networks[id] || `Unknown Network (${id})`;
  };

  // 🚨 WAGMI V2 PATTERN: Detect unsupported network
  // If isConnected is true but chain is undefined, user is on unsupported network
  const isUnsupportedNetwork = isConnected && !chain;
  
  useEffect(() => {
    if (!mounted) return;
    
    if (isUnsupportedNetwork) {
      console.warn(`🚨 Unsupported network detected - please switch to ${targetNetwork.name}`);
    } else if (isConnected && chain && currentChainId !== targetNetwork.id) {
      console.warn(`🚨 Wrong network: ${chain.name} - requires ${targetNetwork.name}`);
    }
  }, [mounted, isConnected, chain, isUnsupportedNetwork, currentChainId, targetNetwork]);

  // Don't render anything during SSR
  if (!mounted) return null;

  // Don't show warning if not connected
  if (!isConnected) return null;

  // 🚨 WAGMI V2 PATTERN: Only show UI if user is on unsupported OR wrong supported network
  const shouldShowWarning = isUnsupportedNetwork || (chain && currentChainId !== targetNetwork.id);
  if (!shouldShowWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.34 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            🚨 {isUnsupportedNetwork ? 'Unsupported Network' : 'Wrong Network'} Detected
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            This app only works on <strong>{targetNetwork.name}</strong>.
            <br />
            {isUnsupportedNetwork ? (
              <span>You&apos;re connected to an <strong>unsupported network</strong>.</span>
            ) : (
              <span>You&apos;re currently connected to <strong>{chain?.name} (Chain ID {currentChainId})</strong>.</span>
            )}
            <br />
            <br />
            <span className="text-red-600 font-semibold">
              For your safety, please switch to the correct network.
            </span>
          </p>
          
          <div className="flex flex-col space-y-2">
            {/* Check if wallet supports switching (wagmi v2 pattern) */}
            {switchChain ? (
              <button
                onClick={() => {
                  switchChain({ chainId: targetNetwork.id });
                }}
                disabled={isPending}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Switching Network...
                  </>
                ) : (
                  `Switch to ${targetNetwork.name}`
                )}
              </button>
            ) : (
              <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                <p>Your wallet does not support automatic network switching.</p>
                <p>Please manually switch to <strong>{targetNetwork.name}</strong> in your wallet.</p>
              </div>
            )}
            
            {/* Show error if switch failed */}
            {error && (
              <div className="text-sm text-red-600 p-3 bg-red-50 rounded">
                <p>Failed to switch network: {error.message}</p>
                <p>Please try switching manually in your wallet.</p>
              </div>
            )}
            
            <div className="text-xs text-gray-400 mt-2">
              <p><strong>Required Network:</strong> {targetNetwork.name}</p>
              <p><strong>Required Chain ID:</strong> {targetNetwork.id}</p>
              <p><strong>Your Chain ID:</strong> {currentChainId || 'Unknown'}</p>
              <p><strong>RPC URL:</strong> {targetNetwork.rpcUrls.default.http[0]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 