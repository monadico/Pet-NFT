"use client";

import { useEffect, useState } from "react";
import { AddHistoryModal } from "../components/AddHistoryModal";
import { PetHistoryList } from "../components/PetHistoryList";
import { useAuth } from "../hooks/useAuth";
import { useScaffoldReadContract } from "../hooks/scaffold-eth/useScaffoldReadContract";
import Image from "next/image";
import { usePetsData } from "../hooks/usePetsData";

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
  const { ownedTokens, isLoading, error, lastUpdated, refreshPets } = usePetsData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show refresh button if data is older than 1 minute
  const isDataStale = lastUpdated && (Date.now() - lastUpdated.getTime()) > 60000;

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
        <p className="mb-4" style={{ color: 'rgba(14, 16, 15, 0.7)' }}>{error}</p>
        <button 
          onClick={refreshPets}
          className="btn-monad"
        >
          Try Again
        </button>
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
        <div className="space-y-3">
          <button 
            onClick={() => window.location.href = '/#mint'}
            className="btn-monad"
          >
            Register First Patient
          </button>
          {isDataStale && (
            <button 
              onClick={refreshPets}
              className="block mx-auto text-sm px-4 py-2 rounded-full border transition-all duration-200 hover:bg-purple-50"
              style={{ color: '#836ef9', borderColor: '#836ef9' }}
            >
              🔄 Refresh Data
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Data status and refresh controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold" style={{ color: '#0e100f' }}>
            Patient Records ({ownedTokens.length})
          </h2>
          {lastUpdated && (
            <span className="text-sm px-3 py-1 rounded-full" 
                  style={{ 
                    backgroundColor: 'rgba(131, 110, 249, 0.1)',
                    color: 'rgba(14, 16, 15, 0.7)'
                  }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
        <button 
          onClick={refreshPets}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 hover:bg-purple-50 disabled:opacity-50"
          style={{ color: '#836ef9', borderColor: '#836ef9' }}
        >
          <span className={isLoading ? 'animate-spin' : ''}>🔄</span>
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Pets grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ownedTokens.map((tokenId) => (
          <PetCard key={tokenId.toString()} tokenId={tokenId} />
        ))}
      </div>
    </div>
  );
}; 