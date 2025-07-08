"use client";

import { useState } from "react";
import deployedContracts from "../contracts/deployedContracts";
import { MyPets } from "./MyPets";
import { useAuth } from "../hooks/useAuth";
import { useUnifiedTransaction } from "../hooks/useUnifiedTransaction";
import Link from "next/link";
import scaffoldConfig from "../scaffold.config";

// NOTE: This will be a new component we create in the next step
// import { MyPets } from "./MyPets"; 

const chainId = scaffoldConfig.targetNetworks[0].id;
const PetNFTABI = deployedContracts[chainId].PetNFT.abi;
const PetNFTAddress = deployedContracts[chainId].PetNFT.address;

export default function Home() {
  const [activeTab, setActiveTab] = useState("mint");

  const [petName, setPetName] = useState("");
  const [petOwner, setPetOwner] = useState("");
  const [petBirth, setPetBirth] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { address: connectedAddress, authMethod } = useAuth();
  const { writeContract, isPending, isSuccess, error } = useUnifiedTransaction();

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

      await writeContract({
        address: PetNFTAddress,
        abi: PetNFTABI,
        functionName: "safeMint",
        args: [connectedAddress, petName, petOwner, petBirth, imageURI],
      });
      
      // For Privy transactions, show success message immediately
      if (authMethod === 'email') {
        alert("🎉 NFT minted instantly! No approval needed - your Pet NFT is being created.");
      }
    } catch (e) {
      console.error(e);
      alert(`Error uploading to IPFS: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" 
             style={{ background: 'linear-gradient(135deg, #836ef9 0%, #200052 100%)' }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6 animate-float">
              Welcome to PetVault
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
               style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
              Secure veterinary health records on the blockchain. Permanently preserve your pet&apos;s medical history, consultations, and health data with immutable security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pets" className="btn-monad">
                View My Pets
              </Link>
              <button 
                onClick={() => setActiveTab("mint")}
                className="bg-white font-medium py-3 px-6 rounded-2xl border-2 transition-all duration-300 shadow-lg hover:bg-purple-600 hover:text-white"
                style={{ 
                  color: '#836ef9',
                  borderColor: '#836ef9',
                  boxShadow: '0 8px 32px rgba(131, 110, 249, 0.2)'
                }}
              >
                Mint New Pet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#0e100f' }}>
            Why Choose PetVault?
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
            Professional veterinary health records secured with blockchain immutability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-monad text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #836ef9 0%, #200052 100%)' }}>
              <span className="text-2xl">🏥</span>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#0e100f' }}>
              Secure Health Records
            </h3>
            <p style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
              Veterinary consultations, medical files, and health data are permanently stored with blockchain security.
            </p>
          </div>
          
          <div className="card-monad text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #a0055d 0%, #836ef9 100%)' }}>
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#0e100f' }}>
              Complete Medical History
            </h3>
            <p style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
              Every examination, treatment, and medical document is cryptographically secured and stored on IPFS.
            </p>
          </div>
          
          <div className="card-monad text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #200052 0%, #836ef9 100%)' }}>
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#0e100f' }}>
              Tamper-Proof Records
            </h3>
            <p style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
              Medical records can never be lost, altered, or deleted. Perfect for veterinary professionals and pet owners.
            </p>
          </div>
        </div>
      </div>

      {/* Minting/Viewing Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" 
             style={{ boxShadow: '0 8px 32px rgba(131, 110, 249, 0.2)' }}>
          {/* Tab Navigation */}
          <div className="flex border-b" style={{ borderColor: 'rgba(131, 110, 249, 0.2)' }}>
            <button
              onClick={() => setActiveTab("mint")}
              className={`py-4 px-6 font-medium transition-all duration-200 ${
                activeTab === "mint"
                  ? "border-b-2"
                  : ""
              }`}
              style={{
                borderColor: activeTab === "mint" ? '#836ef9' : 'transparent',
                color: activeTab === "mint" ? '#836ef9' : 'rgba(14, 16, 15, 0.7)',
                backgroundColor: activeTab === "mint" ? 'rgba(131, 110, 249, 0.05)' : 'transparent'
              }}
            >
              Register Patient
            </button>
            <button
              onClick={() => setActiveTab("view")}
              className={`py-4 px-6 font-medium transition-all duration-200 ${
                activeTab === "view"
                  ? "border-b-2"
                  : ""
              }`}
              style={{
                borderColor: activeTab === "view" ? '#836ef9' : 'transparent',
                color: activeTab === "view" ? '#836ef9' : 'rgba(14, 16, 15, 0.7)',
                backgroundColor: activeTab === "view" ? 'rgba(131, 110, 249, 0.05)' : 'transparent'
              }}
            >
              Patient Records
            </button>
          </div>

          <div className="p-8">
            {activeTab === "mint" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#0e100f' }}>
                  Register New Patient
                </h2>
                


                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="petName" className="block font-medium mb-2" style={{ color: '#0e100f' }}>
                        Pet Name
                      </label>
                      <input 
                        type="text" 
                        id="petName" 
                        value={petName} 
                        onChange={(e) => setPetName(e.target.value)} 
                        className="w-full px-4 py-3 rounded-2xl border transition-all duration-200"
                        style={{
                          borderColor: 'rgba(131, 110, 249, 0.2)',
                        }}
                        onFocus={(e) => {
                          e.target.style.outline = 'none';
                          e.target.style.borderColor = '#836ef9';
                          e.target.style.boxShadow = '0 0 0 3px rgba(131, 110, 249, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(131, 110, 249, 0.2)';
                          e.target.style.boxShadow = 'none';
                        }}
                        placeholder="Enter your pet's name"
                        required 
                      />
                    </div>
                    <div>
                      <label htmlFor="petOwner" className="block font-medium mb-2" style={{ color: '#0e100f' }}>
                        Pet Owner
                      </label>
                      <input 
                        type="text" 
                        id="petOwner" 
                        value={petOwner} 
                        onChange={(e) => setPetOwner(e.target.value)} 
                        className="w-full px-4 py-3 rounded-2xl border transition-all duration-200"
                        style={{
                          borderColor: 'rgba(131, 110, 249, 0.2)',
                        }}
                        onFocus={(e) => {
                          e.target.style.outline = 'none';
                          e.target.style.borderColor = '#836ef9';
                          e.target.style.boxShadow = '0 0 0 3px rgba(131, 110, 249, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(131, 110, 249, 0.2)';
                          e.target.style.boxShadow = 'none';
                        }}
                        placeholder="Enter owner's name"
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="petImage" className="block font-medium mb-2" style={{ color: '#0e100f' }}>
                      Pet Image
                    </label>
                    <input 
                      type="file" 
                      id="petImage" 
                      accept="image/*" 
                      onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} 
                      className="w-full px-4 py-3 rounded-2xl border transition-all duration-200"
                      style={{
                        borderColor: 'rgba(131, 110, 249, 0.2)',
                      }}
                      required 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="petBirth" className="block font-medium mb-2" style={{ color: '#0e100f' }}>
                      Pet Birth Date
                    </label>
                    <input 
                      type="date" 
                      id="petBirth" 
                      value={petBirth} 
                      onChange={(e) => setPetBirth(e.target.value)} 
                      className="w-full px-4 py-3 rounded-2xl border transition-all duration-200"
                      style={{
                        borderColor: 'rgba(131, 110, 249, 0.2)',
                      }}
                      required 
                    />
                  </div>
                  
                  <div className="text-center">
                    <button 
                      type="submit" 
                      className="btn-monad disabled:opacity-50 disabled:cursor-not-allowed" 
                      disabled={isUploading || isPending}
                    >
                      {isUploading ? "Uploading..." : 
                       isPending ? (authMethod === 'email' ? "Minting..." : "Approve & Mint...") : 
                       authMethod === 'email' ? "Mint NFT (Auto-Approved)" : "Mint NFT"}
                    </button>
                  </div>
                </form>
                
                {isSuccess && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-center">
                    <p className="text-green-800 font-medium">
                      {authMethod === 'email' 
                        ? "🎉 NFT minted instantly! Check 'My Pets' tab." 
                        : "NFT minted successfully!"}
                    </p>
                  </div>
                )}
                
                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-center">
                    <p className="text-red-800">
                      Error: {error.message}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "view" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#0e100f' }}>
                  Patient Records
                </h2>
                <MyPets />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
