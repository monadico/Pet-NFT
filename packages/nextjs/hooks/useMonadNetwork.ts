import { useAccount } from "wagmi";
import scaffoldConfig from "../scaffold.config";

/**
 * Hook for Monad network verification using wagmi v2 patterns.
 * This follows the canonical patterns where useAccount is the single source of truth.
 */
export const useMonadNetwork = () => {
  const { chain, isConnected } = useAccount();
  const targetNetwork = scaffoldConfig.targetNetworks[0];
  
  // 🚨 WAGMI V2 PATTERN: chain is undefined for unsupported networks
  const isSupported = isConnected && !!chain;
  const isCorrectNetwork = isSupported && chain.id === targetNetwork.id;
  const isUnsupportedNetwork = isConnected && !chain;
  
  const currentNetwork = {
    chainId: chain?.id,
    name: chain?.name || (isConnected ? 'Unknown Network' : 'Not Connected'),
    isTestnet: chain?.testnet || false,
  };

  return {
    // Connection state
    isConnected,
    isSupported,
    isCorrectNetwork,
    isUnsupportedNetwork,
    
    // Network info
    currentNetwork,
    requiredNetwork: targetNetwork,
    
    // Raw chain object (undefined for unsupported networks)
    chain,
  };
}; 