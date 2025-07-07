import { useScaffoldReadContract, useScaffoldWriteContract } from "./scaffold-eth";
import { useAuth } from "./useAuth";

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
  const { address } = useAuth();

  // Hook for writing to the contract
  const { writeContractAsync: writeHistoryContract } = useScaffoldWriteContract({
    contractName: "PetHistoryNFT",
  });

  // Function to mint a new history item
  const mintHistoryItem = async (
    title: string,
    description: string,
    fileURI: string,
    fileType: string,
    parentContract: string,
    parentTokenId: bigint,
  ) => {
    if (!address) throw new Error("Wallet not connected");

    return await writeHistoryContract({
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