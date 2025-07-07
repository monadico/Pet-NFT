"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePrivy } from "@privy-io/react-auth";
import { useAuth } from "../hooks/useAuth";

export const UnifiedAuthButton = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { login } = usePrivy();
  const { isConnected, address, authMethod, disconnect } = useAuth();

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  if (isConnected && address) {

    return (
      <div className="flex items-center gap-2">
        <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
          <div className="text-gray-600">
            {authMethod === 'email' ? '📧 Email' : '🔗 Wallet'}
          </div>
          <div className="font-mono text-xs">
            {showFullAddress ? address : `${address.slice(0, 6)}...${address.slice(-4)}`}
          </div>
          <div className="flex gap-1 mt-1">
            <button
              onClick={() => setShowFullAddress(!showFullAddress)}
              className="text-blue-500 hover:text-blue-700 text-xs"
            >
              {showFullAddress ? 'Hide' : 'Show'} Full
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={copyAddress}
              className="text-green-500 hover:text-green-700 text-xs"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <button
          onClick={disconnect}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowAuthModal(true)}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        Connect Account
      </button>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Connect Your Account</h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Email Authentication */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">📧 Login with Email</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Quick and easy - we&apos;ll create a wallet for you
                </p>
                <button
                  onClick={() => {
                    login();
                    setShowAuthModal(false);
                  }}
                  className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Continue with Email
                </button>
              </div>

              {/* Wallet Authentication */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">🔗 Connect Wallet</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Use your existing wallet (MetaMask, WalletConnect, etc.)
                </p>
                <div className="w-full">
                  <ConnectButton.Custom>
                    {({
                      account,
                      chain,
                      openConnectModal,
                      authenticationStatus,
                      mounted,
                    }) => {
                      const ready = mounted && authenticationStatus !== 'loading';
                      const connected = ready && account && chain;

                      return (
                        <div
                          {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                              opacity: 0,
                              pointerEvents: 'none',
                              userSelect: 'none',
                            },
                          })}
                        >
                          {(() => {
                            if (!connected) {
                              return (
                                <button
                                  onClick={() => {
                                    openConnectModal();
                                    setShowAuthModal(false);
                                  }}
                                  type="button"
                                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                  Connect Wallet
                                </button>
                              );
                            }

                            return null;
                          })()}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 