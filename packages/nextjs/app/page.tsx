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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { address: connectedAddress } = useAccount();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }
    if (!connectedAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: formData,
      });
      const resData = await res.json();
      if (res.status !== 200) {
        throw new Error(resData.error?.details || 'Pinata API Error');
      }
      const imageURI = `https://gateway.pinata.cloud/ipfs/${resData.IpfsHash}`;

      writeContract({
        address: PetNFTAddress,
        abi: PetNFTABI,
        functionName: "safeMint",
        args: [connectedAddress, petName, petOwner, petBirth, imageURI],
      });
    } catch (e) {
      console.error(e);
      alert(`Error uploading to IPFS: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsUploading(false);
    }
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
          <div className="mb-4">
            <label
              htmlFor="petImage"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Pet Image
            </label>
            <input
              type="file"
              id="petImage"
              name="petImage"
              accept="image/*"
              onChange={(e) =>
                setSelectedFile(e.target.files ? e.target.files[0] : null)
              }
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
              disabled={isUploading || isPending}
            >
              {isUploading ? "Uploading..." : isPending ? "Minting..." : "Mint NFT"}
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
