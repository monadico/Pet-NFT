import { Chain } from "viem";

// Define Monad Testnet here to avoid circular dependency
export const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad', symbol: 'MONAD', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz/'] },
  },
  blockExplorers: {
    default: { name: 'MonadScan', url: 'testnet.monadexplorer.com' },
  },
  testnet: true,
} as const;

export type ScaffoldConfig = {
  targetNetworks: readonly Chain[];
  onlyLocalBurnerWallet: boolean;
  walletConnectProjectId: string;
  walletAutoConnect: boolean;
  // Only allow wallet connections on target networks
  isChainAllowed: (chainId: number) => boolean;
};

const scaffoldConfig = {
  // Target networks that your dApp will connect to
  targetNetworks: [monadTestnet],

  // Only allow connections to target networks
  isChainAllowed: (chainId: number) => {
    return chainId === monadTestnet.id;
  },

  // Only show the local burner wallet when connecting to the local network
  onlyLocalBurnerWallet: true,

  // WalletConnect project ID 
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",

  // Enable auto-connect for wallets
  walletAutoConnect: true,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig; 