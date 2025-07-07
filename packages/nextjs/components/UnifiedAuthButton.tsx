"use client";

import { useAuth } from "../hooks/useAuth";
import { usePrivy } from "@privy-io/react-auth";
import { useConnect } from "wagmi";
import { useState, useEffect } from "react";

export const UnifiedAuthButton = () => {
  const { address, authMethod } = useAuth();
  const { login: privyLogin, logout: privyLogout } = usePrivy();
  const { connectors, connect } = useConnect();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDisconnect = () => {
    if (authMethod === "email") {
      privyLogout();
    } else {
      // For wallet connections, we'll just close the modal
      setShowAuthModal(false);
    }
  };

  const handleEmailLogin = () => {
    privyLogin();
    setShowAuthModal(false);
  };

  const handleWalletConnect = (connector: ReturnType<typeof useConnect>['connectors'][0]) => {
    connect({ connector });
    setShowAuthModal(false);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button className="btn-monad">
        Connect Account
      </button>
    );
  }

  if (address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full border"
             style={{ 
               backgroundColor: 'rgba(131, 110, 249, 0.1)',
               borderColor: 'rgba(131, 110, 249, 0.2)'
             }}>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium" style={{ color: '#0e100f' }}>
            {authMethod === "email" ? "Email Account" : "Wallet Connected"}
          </span>
        </div>
        <div className="text-sm font-mono" style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <button
          onClick={handleDisconnect}
          className="text-sm px-3 py-1 rounded-full transition-all duration-200 hover:bg-red-50 hover:text-red-600"
          style={{ color: 'rgba(14, 16, 15, 0.7)' }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowAuthModal(true)}
        className="btn-monad"
      >
        Connect Account
      </button>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden"
               style={{ boxShadow: '0 20px 60px rgba(131, 110, 249, 0.3)' }}>
            {/* Header */}
            <div className="px-6 py-4"
                 style={{ background: 'linear-gradient(135deg, #836ef9 0%, #200052 100%)' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Connect Your Account</h3>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-white/80 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-center mb-6" style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
                Choose how you&apos;d like to connect to PetVault
              </p>

              <div className="space-y-4">
                {/* Email Option */}
                <div className="p-4 border rounded-2xl cursor-pointer transition-all duration-200 hover:border-green-300 hover:bg-green-50"
                     style={{ borderColor: 'rgba(131, 110, 249, 0.2)' }}
                     onClick={handleEmailLogin}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">📧</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1" style={{ color: '#0e100f' }}>
                        Email Account
                      </h4>
                      <p className="text-sm mb-2" style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
                        Quick and easy - no wallet required
                      </p>
                      <ul className="text-xs space-y-1" style={{ color: 'rgba(14, 16, 15, 0.6)' }}>
                        <li>• Instant transactions</li>
                        <li>• No approval prompts</li>
                        <li>• Perfect for beginners</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Wallet Options */}
                <div className="p-4 border rounded-2xl cursor-pointer transition-all duration-200 hover:border-blue-300 hover:bg-blue-50"
                     style={{ borderColor: 'rgba(131, 110, 249, 0.2)' }}
                     onClick={() => handleWalletConnect(connectors[0])}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">🔗</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1" style={{ color: '#0e100f' }}>
                        Crypto Wallet
                      </h4>
                      <p className="text-sm mb-2" style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
                        Connect your MetaMask or other wallet
                      </p>
                      <ul className="text-xs space-y-1" style={{ color: 'rgba(14, 16, 15, 0.6)' }}>
                        <li>• Full custody of assets</li>
                        <li>• Traditional Web3 experience</li>
                        <li>• Requires transaction approval</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-xl" style={{ backgroundColor: 'rgba(131, 110, 249, 0.05)' }}>
                <p className="text-xs text-center" style={{ color: 'rgba(14, 16, 15, 0.6)' }}>
                  Both options are secure and let you fully interact with your digital pets
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 