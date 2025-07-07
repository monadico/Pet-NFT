import { useScaffoldReadContract } from "./scaffold-eth";
import { useAuth } from "./useAuth";
import { useUnifiedTransaction } from "./useUnifiedTransaction";
import deployedContracts from "../contracts/deployedContracts";

export interface HistoryItem {
  title: string;
  description: string;
  fileURI: string;
  fileType: string;
  timestamp: bigint;
  parentContract: string;
  parentTokenId: bigint;
}

export const usePetHistory = () => {
  const { address, isConnected } = useAuth();
  const { writeContract } = useUnifiedTransaction();

  // Function to mint a new history item
  const mintHistoryItem = async (
    title: string,
    description: string,
    fileURI: string,
    fileType: string,
    parentContract: string,
    parentTokenId: bigint,
  ) => {
    if (!isConnected || !address) {
      throw new Error("Please connect your account first");
    }

    const contractInfo = deployedContracts[10143].PetHistoryNFT;
    
    return await writeContract({
      address: contractInfo.address,
      abi: contractInfo.abi,
      functionName: "mintHistoryItem",
      args: [address, title, description, fileURI, fileType, parentContract, parentTokenId],
    });
  };

  // Function to get nested items for a specific pet
  const useNestedItems = (parentContract: string, parentTokenId: bigint) => {
    return useScaffoldReadContract({
      contractName: "PetHistoryNFT",
      functionName: "getNestedItems",
      args: [parentContract, parentTokenId],
    });
  };

  // Function to get history item details
  const useHistoryItem = (tokenId: bigint) => {
    return useScaffoldReadContract({
      contractName: "PetHistoryNFT",
      functionName: "getHistoryItem",
      args: [tokenId],
    });
  };

  // Function to check if an item is nested
  const useIsNested = (tokenId: bigint) => {
    return useScaffoldReadContract({
      contractName: "PetHistoryNFT",
      functionName: "isNested",
      args: [tokenId],
    });
  };

  return {
    mintHistoryItem,
    useNestedItems,
    useHistoryItem,
    useIsNested,
  };
}; 