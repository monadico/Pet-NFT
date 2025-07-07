"use client";

import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { createPublicClient, http } from "viem";
import { monadTestnet } from "../app/providers";
import deployedContracts from "../contracts/deployedContracts";
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

interface PetWithId extends Pet {
  tokenId: string;
}

const PetCarouselCard = ({ pet }: { pet: PetWithId }) => {
  return (
    <div className="flex-shrink-0 w-80 mx-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
           style={{ boxShadow: '0 8px 32px rgba(131, 110, 249, 0.15)' }}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={pet.image}
            alt={pet.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2" style={{ color: '#0e100f' }}>
            {pet.name}
          </h3>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {pet.attributes.slice(0, 2).map((attr, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ 
                  backgroundColor: 'rgba(131, 110, 249, 0.1)',
                  color: '#836ef9'
                }}
              >
                {attr.value}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
              Token #{pet.tokenId}
            </span>
            <span className="text-xs px-2 py-1 rounded-full" 
                  style={{ 
                    backgroundColor: 'rgba(160, 5, 93, 0.1)',
                    color: '#a0055d'
                  }}>
              🏥 Health Record
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PetCarousel = () => {
  const [pets, setPets] = useState<PetWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Get total supply to know how many pets exist
  const { data: totalSupply } = useReadContract({
    address: PetNFTAddress,
    abi: PetNFTABI,
    functionName: "totalSupply",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !totalSupply) return;

    const fetchRecentPets = async () => {
      setIsLoading(true);
      try {
        const recentPets: PetWithId[] = [];
        const maxPets = Math.min(Number(totalSupply), 10); // Show last 10 pets
        
        // Fetch the most recent pets (starting from the highest token ID)
        for (let i = Number(totalSupply) - 1; i >= Math.max(0, Number(totalSupply) - maxPets); i--) {
          try {
            const publicClient = createPublicClient({
              chain: monadTestnet,
              transport: http(),
            });

            const tokenURI = await publicClient.readContract({
              address: PetNFTAddress,
              abi: PetNFTABI,
              functionName: "tokenURI",
              args: [BigInt(i)],
            }) as string;

            if (tokenURI) {
              const dataUri = tokenURI as string;
              const json = atob(dataUri.substring(dataUri.indexOf(",") + 1));
              const pet = JSON.parse(json) as Pet;
              
              recentPets.push({
                ...pet,
                tokenId: i.toString()
              });
            }
          } catch (error) {
            console.error(`Failed to fetch pet ${i}:`, error);
          }
        }

        setPets(recentPets);
      } catch (error) {
        console.error("Failed to fetch recent pets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPets();
  }, [totalSupply, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#0e100f' }}>
              Recent Patient Registrations
            </h2>
            <p className="text-lg" style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
              Meet the pets recently registered in our veterinary system
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2"
                 style={{ borderColor: '#836ef9' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#0e100f' }}>
              Recent Patient Registrations
            </h2>
            <p className="text-lg mb-8" style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
              No pets have been registered yet. Be the first to start building medical records!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#0e100f' }}>
            Recent Patient Registrations
          </h2>
          <p className="text-lg" style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
            Meet the pets recently registered in our veterinary system
          </p>
        </div>
        
        <div className="relative">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
          
          {/* Moving carousel */}
          <div className="carousel-container">
            <div className="carousel-track">
              {/* First set of pets */}
              {pets.map((pet, index) => (
                <PetCarouselCard key={`first-${index}`} pet={pet} />
              ))}
              {/* Duplicate set for seamless loop */}
              {pets.map((pet, index) => (
                <PetCarouselCard key={`second-${index}`} pet={pet} />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .carousel-container {
          overflow: hidden;
        }
        
        .carousel-track {
          display: flex;
          animation: scroll 30s linear infinite;
          width: fit-content;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .carousel-track:hover {
          animation-play-state: paused;
        }
        
        @media (max-width: 768px) {
          .carousel-track {
            animation-duration: 20s;
          }
        }
      `}</style>
    </div>
  );
}; 