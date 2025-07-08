"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { PrivyProvider } from "@privy-io/react-auth";
import { PetsProviderWrapper } from "../components/PetsProviderWrapper";
import { NetworkEnforcer } from "../components/NetworkEnforcer";
import { monadTestnet } from "../scaffold.config";
import { mainnet, sepolia, polygon, polygonMumbai, bsc, bscTestnet, arbitrum, arbitrumGoerli, optimism, optimismGoerli, base, baseGoerli } from "wagmi/chains";

// Re-export for backward compatibility
export { monadTestnet };

// 🚨 WAGMI V2 PATTERN: Multi-chain detection with single-chain enforcement
// This configuration allows wagmi to detect when users switch to ANY of these networks,
// but the NetworkEnforcer component enforces ONLY Monad testnet usage.
// 
// KEY PRINCIPLE: In wagmi v2, if a user connects to a network NOT in this chains array,
// useAccount() will return { isConnected: true, chain: undefined }
// This undefined chain object is how we detect "unsupported" networks.
const config = createConfig({
  chains: [
    monadTestnet,        // ✅ Required network
    mainnet,             // 🔍 For detection only
    sepolia,             // 🔍 For detection only  
    polygon,             // 🔍 For detection only
    polygonMumbai,       // 🔍 For detection only
    bsc,                 // 🔍 For detection only
    bscTestnet,          // 🔍 For detection only
    arbitrum,            // 🔍 For detection only
    arbitrumGoerli,      // 🔍 For detection only
    optimism,            // 🔍 For detection only
    optimismGoerli,      // 🔍 For detection only
    base,                // 🔍 For detection only
    baseGoerli,          // 🔍 For detection only
  ],
  transports: {
    [monadTestnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
    [arbitrum.id]: http(),
    [arbitrumGoerli.id]: http(),
    [optimism.id]: http(),
    [optimismGoerli.id]: http(),
    [base.id]: http(),
    [baseGoerli.id]: http(),
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
        // 🔍 DETECTION: Configure Privy appearance and settings
        appearance: {
          theme: 'light',
          accentColor: '#836ef9',
          showWalletLoginFirst: false, // Show email login first for better UX
        },
        // 🚨 WAGMI V2 PATTERN: Support multiple chains for detection but enforce Monad testnet via NetworkEnforcer
        supportedChains: [
          monadTestnet,        // ✅ Required network
          mainnet,             // 🔍 For detection only
          sepolia,             // 🔍 For detection only
          polygon,             // 🔍 For detection only
          polygonMumbai,       // 🔍 For detection only
          bsc,                 // 🔍 For detection only
          bscTestnet,          // 🔍 For detection only
          arbitrum,            // 🔍 For detection only
          arbitrumGoerli,      // 🔍 For detection only
          optimism,            // 🔍 For detection only
          optimismGoerli,      // 🔍 For detection only
          base,                // 🔍 For detection only
          baseGoerli,          // 🔍 For detection only
        ],
        defaultChain: monadTestnet,
        // Configure embedded wallets for email users
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
        },
        // Login methods
        loginMethods: ['email', 'wallet'],
        // 🚨 WAGMI V2 PATTERN: Configure external wallets to support all major wallet types
        // Note: We support multiple chains for DETECTION but NetworkEnforcer enforces Monad testnet only
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