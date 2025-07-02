"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import deployedContracts from "../contracts/deployedContracts";

const PetNFTABI = deployedContracts[10143].PetNFT.abi;
const PetNFTAddress = deployedContracts[10143].PetNFT.address;

export default function Home() {
  const [petName, setPetName] = useState("");
  const [petOwner, setPetOwner] = useState("");
  const [petBirth, setPetBirth] = useState("");

  const { address: connectedAddress } = useAccount();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectedAddress) {
      alert("Please connect your wallet first.");
      return;
    }
    writeContract({
      address: PetNFTAddress,
      abi: PetNFTABI,
      functionName: "safeMint",
      args: [connectedAddress, petName, petOwner, petBirth],
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Mint Your Pet NFT
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="petName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Pet Name
            </label>
            <input
              type="text"
              id="petName"
              name="petName"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="petOwner"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Pet Owner
            </label>
            <input
              type="text"
              id="petOwner"
              name="petOwner"
              value={petOwner}
              onChange={(e) => setPetOwner(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="petBirth"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Pet Birth
            </label>
            <input
              type="date"
              id="petBirth"
              name="petBirth"
              value={petBirth}
              onChange={(e) => setPetBirth(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
              disabled={isPending}
            >
              {isPending ? "Minting..." : "Mint NFT"}
            </button>
          </div>
        </form>
        {isSuccess && (
          <p className="mt-4 text-green-500 text-center">
            NFT minted successfully!
          </p>
        )}
        {error && (
          <p className="mt-4 text-red-500 text-center">
            Error: {error.message}
          </p>
        )}
      </div>
    </main>
  );
}
