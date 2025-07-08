"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react";
import { createPublicClient, http } from "viem";
import { useWatchContractEvent } from "wagmi";
import scaffoldConfig, { monadTestnet } from "../scaffold.config";
import deployedContracts from "../contracts/deployedContracts";

const chainId = scaffoldConfig.targetNetworks[0].id;
const PetNFTABI = deployedContracts[chainId].PetNFT.abi;
const PetNFTAddress = deployedContracts[chainId].PetNFT.address;

// Pets data context
interface PetsData {
  ownedTokens: bigint[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshPets: () => Promise<void>;
}

const PetsContext = createContext<PetsData>({
  ownedTokens: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  refreshPets: async () => {},
});

export const usePetsData = () => useContext(PetsContext);

interface PetsProviderProps {
  children: ReactNode;
  address?: string;
}

export const PetsProvider = ({ children, address }: PetsProviderProps) => {
  const [ownedTokens, setOwnedTokens] = useState<bigint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchOwnedPets = async (userAddress: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const publicClient = createPublicClient({
        chain: monadTestnet,
        transport: http(),
      });

      // Get balance
      const balance = await publicClient.readContract({
        address: PetNFTAddress,
        abi: PetNFTABI,
        functionName: "balanceOf",
        args: [userAddress as `0x${string}`],
      });

      if (Number(balance) === 0) {
        setOwnedTokens([]);
        setLastUpdated(new Date());
        setIsLoading(false);
        return;
      }

      // Get total supply with fallback
      let totalTokens = 0;
      try {
        const totalSupply = await publicClient.readContract({
          address: PetNFTAddress,
          abi: PetNFTABI,
          functionName: "totalSupply",
          args: [],
        });
        totalTokens = Number(totalSupply);
      } catch (totalSupplyError) {
        console.log("totalSupply not available, using fallback approach:", totalSupplyError);
        totalTokens = 1000;
      }

      // Check ownership of tokens
      const ownedTokenIds: bigint[] = [];
      const batchSize = 5;
      
      for (let i = 0; i < totalTokens; i += batchSize) {
        const batch = [];
        const endIndex = Math.min(i + batchSize, totalTokens);
        
        for (let tokenId = i; tokenId < endIndex; tokenId++) {
          batch.push(
            publicClient.readContract({
              address: PetNFTAddress,
              abi: PetNFTABI,
              functionName: "ownerOf",
              args: [BigInt(tokenId)],
            }).then(owner => ({ tokenId: BigInt(tokenId), owner, exists: true }))
            .catch((error) => {
              console.log(`Token ${tokenId} check failed:`, error.message);
              return { tokenId: BigInt(tokenId), owner: null, exists: false };
            })
          );
        }
        
        const results = await Promise.all(batch);
        
        for (const result of results) {
          if (result.exists && result.owner && result.owner.toLowerCase() === userAddress.toLowerCase()) {
            ownedTokenIds.push(result.tokenId);
          }
        }
        
        // Early exit if we found all tokens
        if (ownedTokenIds.length === Number(balance)) {
          console.log(`Found all ${Number(balance)} tokens, stopping search at token ${i + batchSize - 1}`);
          break;
        }
        
        // Small delay between batches
        if (i + batchSize < totalTokens) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      setOwnedTokens(ownedTokenIds);
      setLastUpdated(new Date());
    } catch (e) {
      console.error("Failed to fetch owned tokens", e);
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPets = useCallback(async () => {
    if (address) {
      await fetchOwnedPets(address);
    }
  }, [address]);

  // Load pets immediately when address changes
  useEffect(() => {
    if (address) {
      console.log("Address connected, loading pets data...");
      fetchOwnedPets(address);
    } else {
      // Clear data when disconnected
      setOwnedTokens([]);
      setLastUpdated(null);
      setError(null);
    }
  }, [address]);

  // 🎯 REAL-TIME EVENT WATCHING: Watch for Transfer events to detect new mints
  // This replaces the periodic refresh and only updates when there's actually a new mint
  useWatchContractEvent({
    address: PetNFTAddress,
    abi: PetNFTABI,
    eventName: "Transfer",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onLogs: (logs: any) => {
      if (!address) return;
      
      // Check if any of the Transfer events involve our address
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const relevantTransfers = logs.filter((log: any) => {
        const { from, to } = log.args;
        // New mint: from === 0x0 (zero address) and to === our address
        // OR transfer to our address from someone else
        return (from === '0x0000000000000000000000000000000000000000' && to?.toLowerCase() === address.toLowerCase()) ||
               (to?.toLowerCase() === address.toLowerCase());
      });
      
      if (relevantTransfers.length > 0) {
        console.log(`🎉 Detected ${relevantTransfers.length} relevant Transfer event(s), refreshing pets...`);
        refreshPets();
      }
    },
    // Only watch events if we have an address
    enabled: !!address,
  });

  const contextValue: PetsData = {
    ownedTokens,
    isLoading,
    error,
    lastUpdated,
    refreshPets,
  };

  return (
    <PetsContext.Provider value={contextValue}>
      {children}
    </PetsContext.Provider>
  );
}; 