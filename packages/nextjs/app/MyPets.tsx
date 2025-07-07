"use client";

import deployedContracts from "../contracts/deployedContracts";
import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { monadTestnet } from "./providers";
import { AddHistoryModal } from "../components/AddHistoryModal";
import { PetHistoryList } from "../components/PetHistoryList";
import { useAuth } from "../hooks/useAuth";
import { useScaffoldReadContract } from "../hooks/scaffold-eth/useScaffoldReadContract";
import Image from "next/image";

const PetNFTABI = deployedContracts[10143].PetNFT.abi;
const PetNFTAddress = "0x4d834963624Cb1A6f2C7FDFF968cAF0d867050a8" as `0x${string}`;

interface Pet {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

const PetCard = ({ tokenId }: { tokenId: bigint }) => {
  const { data: tokenURI, isLoading: isUriLoading } = useScaffoldReadContract({
    contractName: "PetNFT",
    functionName: "tokenURI",
    args: [tokenId],
  });

  const [pet, setPet] = useState<Pet | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showAddHistory, setShowAddHistory] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (tokenURI && mounted) {
      try {
        const dataUri = tokenURI as string;
        const json = atob(dataUri.substring(dataUri.indexOf(",") + 1));
        setPet(JSON.parse(json));
      } catch (e) {
        console.error("Failed to parse token URI", e);
      }
    }
  }, [tokenURI, mounted]);

  // Show skeleton immediately when mounted (even before contract call)
  if (!mounted) {
    return (
      <div className="card-monad animate-pulse">
        <div className="w-full h-48 rounded-2xl" 
             style={{ backgroundColor: 'rgba(131, 110, 249, 0.1)' }}></div>
        <div className="mt-6 space-y-3">
          <div className="h-6 rounded-2xl w-3/4" 
               style={{ backgroundColor: 'rgba(131, 110, 249, 0.1)' }}></div>
          <div className="h-4 rounded-2xl w-1/2" 
               style={{ backgroundColor: 'rgba(131, 110, 249, 0.1)' }}></div>
          <div className="h-4 rounded-2xl w-2/3" 
               style={{ backgroundColor: 'rgba(131, 110, 249, 0.1)' }}></div>
        </div>
      </div>
    );
  }

  // Show loading skeleton while fetching data
  if (isUriLoading || !pet) {
    return (
      <div className="card-monad animate-pulse">
        <div className="w-full h-48 rounded-2xl" 
             style={{ backgroundColor: 'rgba(131, 110, 249, 0.1)' }}></div>
        <div className="mt-6 space-y-3">
          <div className="h-6 rounded-2xl w-3/4" 
               style={{ backgroundColor: 'rgba(131, 110, 249, 0.1)' }}></div>
          <div className="h-4 rounded-2xl w-1/2" 
               style={{ backgroundColor: 'rgba(131, 110, 249, 0.1)' }}></div>
          <div className="h-4 rounded-2xl w-2/3" 
               style={{ backgroundColor: 'rgba(131, 110, 249, 0.1)' }}></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card-monad group">
        <div className="relative overflow-hidden rounded-2xl">
          <Image 
            src={pet.image} 
            alt={pet.name} 
            width={400} 
            height={192} 
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2 transition-colors duration-200 group-hover:text-purple-600" 
              style={{ color: '#0e100f' }}>
            {pet.name}
          </h3>
          
          <div className="space-y-2 mb-4">
            {pet.attributes.map((attr, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="font-medium" style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
                  {attr.trait_type}:
                </span>
                <span className="text-black px-2 py-1 rounded-full" 
                      style={{ 
                        backgroundColor: 'rgba(131, 110, 249, 0.1)',
                        color: '#0e100f'
                      }}>
                  {attr.value}
                </span>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => setShowAddHistory(true)}
              className="w-full btn-monad"
            >
              <span className="flex items-center justify-center gap-2">
                <span>🏥</span>
                Add Medical Record
              </span>
            </button>
            
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full font-medium py-2 px-4 rounded-2xl border-2 transition-all duration-200 focus:outline-none hover:bg-purple-600 hover:text-white focus:ring-2 focus:ring-purple-300"
              style={{
                backgroundColor: 'white',
                color: '#836ef9',
                borderColor: '#836ef9'
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <span>{showHistory ? "📋" : "📊"}</span>
                {showHistory ? "Hide Medical History" : "View Medical History"}
              </span>
            </button>
          </div>

          {showHistory && (
            <div className="mt-4 p-4 rounded-2xl border"
                 style={{ 
                   backgroundColor: '#fbfaf9',
                   borderColor: 'rgba(131, 110, 249, 0.2)'
                 }}>
              <PetHistoryList petTokenId={tokenId} />
            </div>
          )}
        </div>
      </div>

      {mounted && (
        <AddHistoryModal
          isOpen={showAddHistory}
          onClose={() => setShowAddHistory(false)}
          petTokenId={tokenId}
        />
      )}
    </>
  );
};

export const MyPets = () => {
  const { address } = useAuth();
  const [ownedTokens, setOwnedTokens] = useState<bigint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchOwnedPets = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setLoadingProgress(10);
      
      try {
        const publicClient = createPublicClient({
          chain: monadTestnet,
          transport: http(),
        });

        // Step 1: Get balance
        const balance = await publicClient.readContract({
          address: PetNFTAddress,
          abi: PetNFTABI,
          functionName: "balanceOf",
          args: [address as `0x${string}`],
        });
        
        setLoadingProgress(30);

        if (Number(balance) === 0) {
          setOwnedTokens([]);
          setIsLoading(false);
          return;
        }

        setLoadingProgress(50);

        // Step 2: Try to get total supply, with fallback
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
          // Fallback: assume a reasonable maximum range (e.g., 1000 tokens)
          // In production, you might want to make this configurable
          totalTokens = 1000;
        }

        // Step 3: Check ownership of tokens
        const ownedTokenIds: bigint[] = [];
        
        // Process tokens in smaller batches to avoid overwhelming the RPC
        const batchSize = 5; // Reduced batch size for better reliability
        for (let i = 0; i < totalTokens; i += batchSize) {
          const batch = [];
          const endIndex = Math.min(i + batchSize, totalTokens);
          
          // Create batch of ownership checks
          for (let tokenId = i; tokenId < endIndex; tokenId++) {
            batch.push(
              publicClient.readContract({
                address: PetNFTAddress,
                abi: PetNFTABI,
                functionName: "ownerOf",
                args: [BigInt(tokenId)],
              }).then(owner => ({ tokenId: BigInt(tokenId), owner, exists: true }))
              .catch((error) => {
                // Token might not exist or other error
                console.log(`Token ${tokenId} check failed:`, error.message);
                return { tokenId: BigInt(tokenId), owner: null, exists: false };
              })
            );
          }
          
          // Execute batch in parallel
          const results = await Promise.all(batch);
          
          // Filter for tokens owned by current address
          for (const result of results) {
            if (result.exists && result.owner && result.owner.toLowerCase() === address.toLowerCase()) {
              ownedTokenIds.push(result.tokenId);
            }
          }
          
          // Update progress
          const progress = 50 + (i / totalTokens) * 40; // 50-90% range
          setLoadingProgress(Math.min(90, progress));
          
          // Early exit if we found all tokens
          if (ownedTokenIds.length === Number(balance)) {
            console.log(`Found all ${Number(balance)} tokens, stopping search at token ${i + batchSize - 1}`);
            break;
          }
          
          // Add a small delay between batches to be nice to the RPC
          if (i + batchSize < totalTokens) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        setLoadingProgress(100);
        setOwnedTokens(ownedTokenIds);
      } catch (e) {
        console.error("Failed to fetch owned tokens", e);
        setError(e instanceof Error ? e.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwnedPets();
  }, [address, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="space-y-8">
        {/* Show progress and immediate skeletons */}
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mb-4"
               style={{ borderColor: '#836ef9' }}></div>
          <p className="text-lg mb-2" style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
            Loading patient records...
          </p>
          {loadingProgress > 0 && (
            <div className="w-64 bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300" 
                style={{ 
                  backgroundColor: '#836ef9', 
                  width: `${loadingProgress}%` 
                }}
              ></div>
            </div>
          )}
        </div>
        
        {/* Show skeleton cards immediately */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-monad animate-pulse">
              <div className="w-full h-48 rounded-2xl" 
                   style={{ backgroundColor: 'rgba(131, 110, 249, 0.1)' }}></div>
              <div className="mt-6 space-y-3">
                <div className="h-6 rounded-2xl w-3/4" 
                     style={{ backgroundColor: 'rgba(131, 110, 249, 0.1)' }}></div>
                <div className="h-4 rounded-2xl w-1/2" 
                     style={{ backgroundColor: 'rgba(131, 110, 249, 0.1)' }}></div>
                <div className="h-4 rounded-2xl w-2/3" 
                     style={{ backgroundColor: 'rgba(131, 110, 249, 0.1)' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-red-600 font-medium mb-2">Oops! Something went wrong</p>
        <p style={{ color: 'rgba(14, 16, 15, 0.7)' }}>{error}</p>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
             style={{ backgroundColor: 'rgba(131, 110, 249, 0.1)' }}>
          <span className="text-2xl">🔗</span>
        </div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#0e100f' }}>
          Connect Your Wallet
        </h3>
        <p style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
          Please connect your account to access patient records.
        </p>
      </div>
    );
  }

  if (ownedTokens.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
             style={{ backgroundColor: 'rgba(131, 110, 249, 0.1)' }}>
          <span className="text-2xl">🐾</span>
        </div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#0e100f' }}>
          No Patient Records Yet
        </h3>
        <p className="mb-4" style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
          You haven&apos;t registered any patients yet. Start by registering your first patient to begin their medical record!
        </p>
        <button 
          onClick={() => window.location.href = '/#mint'}
          className="btn-monad"
        >
          Register First Patient
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ownedTokens.map((tokenId) => (
        <PetCard key={tokenId.toString()} tokenId={tokenId} />
      ))}
    </div>
  );
}; 