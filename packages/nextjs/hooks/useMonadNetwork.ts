import { useChainId } from "wagmi";
import scaffoldConfig from "../scaffold.config";

export const useMonadNetwork = () => {
  const chainId = useChainId();
  const targetNetwork = scaffoldConfig.targetNetworks[0];
  
  const isCorrectNetwork = chainId === targetNetwork.id;
  const currentNetwork = {
    chainId,
    name: isCorrectNetwork ? targetNetwork.name : `Unknown Network (${chainId})`,
    isTestnet: isCorrectNetwork ? targetNetwork.testnet : false,
  };

  return {
    isCorrectNetwork,
    currentNetwork,
    requiredNetwork: targetNetwork,
  };
}; 