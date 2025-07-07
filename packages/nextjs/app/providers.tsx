"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { PrivyProvider } from "@privy-io/react-auth";
import "@rainbow-me/rainbowkit/styles.css";

export const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad', symbol: 'MONAD', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz/'] },
  },
  blockExplorers: {
    default: { name: 'MonadScan', url: 'https://testnet.monadscan.io' },
  },
  testnet: true,
};

const config = getDefaultConfig({
    appName: "Pet NFT - Monad Testnet",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [monadTestnet],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // Configure Privy for your Monad Testnet
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://your-logo-url.com/logo.png', // Replace with your logo
          showWalletLoginFirst: false, // Show email login first for better UX
        },
        // Configure supported chains
        supportedChains: [monadTestnet],
        // Configure embedded wallets
        embeddedWallets: {
          createOnLogin: 'users-without-wallets', // Creates wallet for email users
          requireUserPasswordOnCreate: false, // Simplify user experience
        },
        // Login methods
        loginMethods: ['email', 'wallet'],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
}; 