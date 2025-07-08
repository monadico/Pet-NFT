"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { PrivyProvider } from "@privy-io/react-auth";
import { PetsProviderWrapper } from "../components/PetsProviderWrapper";
import { NetworkEnforcer } from "../components/NetworkEnforcer";
import { monadTestnet } from "../scaffold.config";

// Re-export for backward compatibility
export { monadTestnet };

// 🚨 CRITICAL: Configure Wagmi to ONLY support Monad testnet
const config = createConfig({
  chains: [monadTestnet], // ONLY Monad testnet
  transports: {
    [monadTestnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a loading state during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // 🚨 CRITICAL: Configure Privy to ONLY support Monad testnet
        appearance: {
          theme: 'light',
          accentColor: '#836ef9',
          showWalletLoginFirst: false, // Show email login first for better UX
        },
        // 🚨 CRITICAL: Only allow Monad testnet - this restricts ALL wallets to this chain
        supportedChains: [monadTestnet],
        defaultChain: monadTestnet,
        // Configure embedded wallets for email users
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
        },
        // Login methods
        loginMethods: ['email', 'wallet'],
        // 🚨 CRITICAL: Configure external wallets to support all major wallet types
        // Note: supportedChains above restricts ALL these wallets to Monad testnet only
        externalWallets: {
          // ✅ Coinbase Wallet support
          coinbaseWallet: { 
            connectionOptions: 'smartWalletOnly'
          },
          // ✅ WalletConnect support (includes Rainbow, MetaMask, Phantom, Trust, and many others)
          walletConnect: {
            enabled: true
          }
        }
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <NetworkEnforcer />
            <PetsProviderWrapper>
              {children}
            </PetsProviderWrapper>
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
}; 