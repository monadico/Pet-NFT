"use client";

import { useAccount, useReadContract } from "wagmi";
import deployedContracts from "../contracts/deployedContracts";
import { useEffect, useState } from "react";
import { createPublicClient, http, parseAbiItem } from "viem";
import { monadTestnet } from "./providers";

const PetNFTABI = deployedContracts[10143].PetNFT.abi;
const PetNFTAddress = "0x4d834963624Cb1A6f2C7FDFF968cAF0d867050a8";

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
  const { data: tokenURI, isLoading: isUriLoading } = useReadContract({
    address: PetNFTAddress,
    abi: PetNFTABI,
    functionName: "tokenURI",
    args: [tokenId],
  });

  const [pet, setPet] = useState<Pet | null>(null);

  useEffect(() => {
    if (tokenURI) {
      try {
        const dataUri = tokenURI as string;
        const json = atob(dataUri.substring(dataUri.indexOf(",") + 1));
        setPet(JSON.parse(json));
      } catch (e) {
        console.error("Failed to parse token URI", e);
      }
    }
  }, [tokenURI]);

  if (isUriLoading || !pet) {
    return (
      <div className="border p-4 rounded-lg shadow animate-pulse">
        <div className="w-full h-48 bg-gray-300 rounded"></div>
        <div className="mt-4 h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="mt-2 h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-lg shadow">
      <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover rounded" />
      <h3 className="text-xl font-bold mt-4">{pet.name}</h3>
      {pet.attributes.map((attr, i) => (
        <p key={i} className="text-sm">
          <strong>{attr.trait_type}:</strong> {attr.value}
        </p>
      ))}
    </div>
  );
};

export const MyPets = () => {
  const { address } = useAccount();
  const [ownedTokens, setOwnedTokens] = useState<bigint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnedPets = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const publicClient = createPublicClient({
          chain: monadTestnet,
          transport: http(),
        });

        const balance = await publicClient.readContract({
          address: PetNFTAddress,
          abi: PetNFTABI,
          functionName: "balanceOf",
          args: [address],
        });

        if (Number(balance) === 0) {
          setOwnedTokens([]);
          setIsLoading(false);
          return;
        }

        const tokenIds: bigint[] = [];
        let toBlock = await publicClient.getBlockNumber();

        while (tokenIds.length < Number(balance) && toBlock > 0n) {
          const fromBlock = toBlock - 99n > 0n ? toBlock - 99n : 0n;

          const transferEvents = await publicClient.getLogs({
            address: PetNFTAddress,
            event: parseAbiItem(
              "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
            ),
            args: { to: address },
            fromBlock: fromBlock,
            toBlock: toBlock,
          });

          const newIds = transferEvents.map((event) => event.args.tokenId!);
          for (const id of newIds) {
            if (!tokenIds.includes(id)) {
              tokenIds.push(id);
            }
          }

          if (fromBlock === 0n) break;
          toBlock = fromBlock - 1n;
        }

        setOwnedTokens(tokenIds);
      } catch (e) {
        console.error("Failed to fetch owned tokens", e);
        setError(e instanceof Error ? e.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwnedPets();
  }, [address]);

  if (isLoading) {
    return <p className="text-center">Loading your pets...</p>;
  }
  
  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!address) {
    return (
      <p className="text-center text-gray-500">Please connect your wallet.</p>
    );
  }

  if (ownedTokens.length === 0) {
    return (
      <p className="text-center text-gray-500">You do not own any pets yet.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ownedTokens.map((tokenId) => (
        <PetCard key={tokenId.toString()} tokenId={tokenId} />
      ))}
    </div>
  );
}; 