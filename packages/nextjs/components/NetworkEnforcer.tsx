"use client";

import { useEffect, useState } from "react";
import { useSwitchChain, useChainId, useDisconnect } from "wagmi";
import { useAuth } from "../hooks/useAuth";
import scaffoldConfig from "../scaffold.config";

export const NetworkEnforcer = () => {
  const [mounted, setMounted] = useState(false);
  const [showForceDisconnect, setShowForceDisconnect] = useState(false);
  const { isConnected, authMethod } = useAuth();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const targetNetwork = scaffoldConfig.targetNetworks[0];
    if (isConnected && chainId !== targetNetwork.id) {
      console.error(`🚨 NetworkEnforcer: Wrong network detected! Chain ID: ${chainId}, Expected: ${targetNetwork.id}`);
      
      // For wallet connections, show force disconnect option after failed switch attempts
      if (authMethod === 'wallet') {
        setShowForceDisconnect(true);
      }
      
      // Try to automatically switch first
      try {
        switchChain({ chainId: targetNetwork.id });
      } catch (error) {
        console.error("Automatic network switch failed:", error);
        
        // If switch fails, show force disconnect
        setShowForceDisconnect(true);
      }
    } else {
      // Reset force disconnect when on correct network
      setShowForceDisconnect(false);
    }
  }, [mounted, isConnected, chainId, switchChain, authMethod]);

  // Don't render anything during SSR
  if (!mounted) return null;

  // Don't show warning if not connected
  if (!isConnected) return null;

  // Don't show warning if on correct network
  if (chainId === scaffoldConfig.targetNetworks[0].id) return null;

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
            🚨 Wrong Network Detected
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            This app only works on <strong>{scaffoldConfig.targetNetworks[0].name}</strong>.
            <br />
            You&apos;re currently connected to <strong>Chain ID {chainId}</strong>.
            <br />
            <br />
            <span className="text-red-600 font-semibold">
              For your safety, please switch to the correct network or disconnect your wallet.
            </span>
          </p>
          
          <div className="flex flex-col space-y-2">
            {/* Primary action: Switch network */}
            <button
              onClick={() => {
                try {
                  switchChain({ chainId: scaffoldConfig.targetNetworks[0].id });
                } catch (error) {
                  console.error("Failed to switch network:", error);
                  setShowForceDisconnect(true);
                }
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
                `Switch to ${scaffoldConfig.targetNetworks[0].name}`
              )}
            </button>
            
            {/* Secondary action: Force disconnect (only show if switch fails or for wallet users) */}
            {(showForceDisconnect || authMethod === 'wallet') && (
              <button
                onClick={() => {
                  console.log("🚨 Force disconnecting user due to wrong network");
                  disconnect();
                  setShowForceDisconnect(false);
                }}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                🚨 Force Disconnect (Wrong Network)
              </button>
            )}
            
            <div className="text-xs text-gray-400 mt-2">
              <p><strong>Required Network:</strong> {scaffoldConfig.targetNetworks[0].name}</p>
              <p><strong>Required Chain ID:</strong> {scaffoldConfig.targetNetworks[0].id}</p>
              <p><strong>Your Chain ID:</strong> {chainId}</p>
              <p><strong>RPC URL:</strong> {scaffoldConfig.targetNetworks[0].rpcUrls.default.http[0]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 