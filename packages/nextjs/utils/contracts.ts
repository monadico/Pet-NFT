import scaffoldConfig from "../scaffold.config";
import deployedContracts from "../contracts/deployedContracts";

// Get current chain ID from scaffold config
export const getChainId = () => scaffoldConfig.targetNetworks[0].id;

// Get contract info for current chain
export const getContractInfo = (contractName: keyof typeof deployedContracts[10143]) => {
  const chainId = getChainId();
  return deployedContracts[chainId][contractName];
};

// Check if user is on correct network
export const isCorrectNetwork = (currentChainId: number | undefined) => {
  if (!currentChainId) return false;
  return scaffoldConfig.isChainAllowed(currentChainId);
};

// Get target network info
export const getTargetNetwork = () => scaffoldConfig.targetNetworks[0]; 