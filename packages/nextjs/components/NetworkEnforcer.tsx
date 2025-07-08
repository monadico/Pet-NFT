"use client";

import { useEffect, useState } from "react";
import { useSwitchChain, useChainId } from "wagmi";
import { useAuth } from "../hooks/useAuth";
import scaffoldConfig from "../scaffold.config";

export const NetworkEnforcer = () => {
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAuth();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const targetNetwork = scaffoldConfig.targetNetworks[0];
    if (isConnected && chainId !== targetNetwork.id) {
      // Try to automatically switch first
      try {
        switchChain({ chainId: targetNetwork.id });
      } catch (error) {
        console.log("Automatic network switch failed:", error);
      }
    }
  }, [mounted, isConnected, chainId, switchChain]);

  // Don't render anything during SSR
  if (!mounted) return null;

  // Don't show warning if not connected
  if (!isConnected) return null;

  // Don't show warning if on correct network
  if (chainId === scaffoldConfig.targetNetworks[0].id) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Wrong Network
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            This app only works on <strong>Monad Testnet</strong>. Please switch your network to continue.
          </p>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => {
                try {
                  switchChain({ chainId: scaffoldConfig.targetNetworks[0].id });
                } catch (error) {
                  console.error("Failed to switch network:", error);
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
                  Switching...
                </>
              ) : (
                `Switch to ${scaffoldConfig.targetNetworks[0].name}`
              )}
            </button>
            <div className="text-xs text-gray-400 mt-2">
              <p><strong>Network:</strong> {scaffoldConfig.targetNetworks[0].name}</p>
              <p><strong>Chain ID:</strong> {scaffoldConfig.targetNetworks[0].id}</p>
              <p><strong>RPC:</strong> {scaffoldConfig.targetNetworks[0].rpcUrls.default.http[0]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 