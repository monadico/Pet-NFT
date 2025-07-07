"use client";

import { useAuth } from "../hooks/useAuth";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";

export const UnifiedAuthButton = () => {
  const { address, authMethod } = useAuth();
  const { login: privyLogin, logout: privyLogout } = usePrivy();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

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
        <div className="relative group">
          <button
            onClick={() => copyToClipboard(address)}
            className="text-sm font-mono px-3 py-1 rounded-full transition-all duration-200 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
            style={{ color: 'rgba(14, 16, 15, 0.7)' }}
            title="Click to copy full address"
          >
            {address.slice(0, 6)}...{address.slice(-4)}
            <span className="ml-1 opacity-50 group-hover:opacity-100 transition-opacity">
              📋
            </span>
          </button>
          
          {/* Copy feedback tooltip */}
          {copied && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-green-600 text-white text-xs rounded-md whitespace-nowrap z-10">
              Copied to clipboard!
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-green-600"></div>
            </div>
          )}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50"
             style={{ 
               position: 'fixed',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
               zIndex: 9999,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               padding: '1rem',
               minHeight: '100vh',
               minWidth: '100vw'
             }}>
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative mx-auto"
               style={{ 
                 boxShadow: '0 20px 60px rgba(131, 110, 249, 0.3)',
                 maxHeight: '90vh',
                 overflowY: 'auto',
                 margin: 'auto',
                 transform: 'translateZ(0)' // Force hardware acceleration for better centering
               }}>
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
                Connect to PetVault to manage your digital pets
              </p>

              <div className="space-y-4">
                {/* Single Connect Option */}
                <div className="p-6 border rounded-2xl cursor-pointer transition-all duration-200 hover:border-purple-300 hover:bg-purple-50"
                     style={{ borderColor: 'rgba(131, 110, 249, 0.2)' }}
                     onClick={handleEmailLogin}>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🔗</span>
                    </div>
                    <div className="text-center">
                      <h4 className="text-lg font-semibold mb-2" style={{ color: '#0e100f' }}>
                        Connect
                      </h4>
                      <p className="text-sm" style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
                        Secure login with multiple wallet options
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-xl" style={{ backgroundColor: 'rgba(131, 110, 249, 0.05)' }}>
                <p className="text-xs text-center" style={{ color: 'rgba(14, 16, 15, 0.6)' }}>
                  Powered by Privy - supports email, social login, and crypto wallets
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 