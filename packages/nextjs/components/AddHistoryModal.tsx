"use client";

import { useState } from "react";
import { usePetHistory } from "../hooks/usePetHistory";
import deployedContracts from "../contracts/deployedContracts";

interface AddHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  petTokenId: bigint;
}

const PetNFTAddress = deployedContracts[10143].PetNFT.address;

export const AddHistoryModal = ({ isOpen, onClose, petTokenId }: AddHistoryModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mintHistoryItem } = usePetHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    setIsSubmitting(true);
    setIsUploading(true);

    try {
      // Upload file to IPFS
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

      const fileURI = `https://gateway.pinata.cloud/ipfs/${resData.IpfsHash}`;
      const fileType = selectedFile.type.startsWith('image/') ? 'image' : 'document';

      setIsUploading(false);

      // Mint the history item NFT
      await mintHistoryItem(
        title,
        description,
        fileURI,
        fileType,
        PetNFTAddress,
        petTokenId
      );

      // Reset form and close modal
      setTitle("");
      setDescription("");
      setSelectedFile(null);
      onClose();
      
      alert("Medical record added successfully!");
    } catch (error) {
      console.error("Error adding history item:", error);
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      
      // Check file type (images and PDFs)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert("Only images (JPEG, PNG, GIF, WebP) and PDF files are allowed");
        return;
      }
      
      setSelectedFile(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md transform transition-all duration-300 scale-100"
           style={{ boxShadow: '0 12px 40px rgba(131, 110, 249, 0.3)' }}>
        {/* Header */}
        <div className="text-white p-6 rounded-t-2xl"
             style={{ background: 'linear-gradient(135deg, #836ef9 0%, #200052 100%)' }}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>🏥</span>
              Add Medical Record
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-full p-1"
              disabled={isSubmitting}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-white/80 mt-2 text-sm">
            Add consultation data, exam results, or medical documents
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block font-medium mb-2" style={{ color: '#0e100f' }}>
              Record Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              placeholder="e.g., Annual Checkup, Vaccination Record, Lab Results"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium mb-2" style={{ color: '#0e100f' }}>
              Clinical Notes
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border transition-all duration-200 resize-none"
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
              placeholder="Enter examination findings, treatment notes, recommendations, or consultation details..."
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="file" className="block font-medium mb-2" style={{ color: '#0e100f' }}>
              Medical Document or X-Ray
            </label>
            <div className="relative">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                className="w-full px-4 py-3 rounded-2xl border transition-all duration-200"
                style={{
                  borderColor: 'rgba(131, 110, 249, 0.2)',
                }}
                required
                disabled={isSubmitting}
              />
            </div>
            {selectedFile && (
              <div className="mt-2 p-3 rounded-2xl" style={{ backgroundColor: 'rgba(131, 110, 249, 0.1)' }}>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#0e100f' }}>
                  <span style={{ color: '#836ef9' }}>📎</span>
                  <span className="font-medium">{selectedFile.name}</span>
                  <span style={{ color: 'rgba(14, 16, 15, 0.7)' }}>
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              </div>
            )}
            <p className="text-xs mt-2" style={{ color: 'rgba(14, 16, 15, 0.6)' }}>
              Supported formats: JPEG, PNG, GIF, WebP, PDF (max 10MB)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-2xl border transition-all duration-200 font-medium"
              style={{
                backgroundColor: 'white',
                color: 'rgba(14, 16, 15, 0.7)',
                borderColor: 'rgba(131, 110, 249, 0.2)',
              }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-monad disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Uploading...
                </span>
              ) : isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>🏥</span>
                  Add Medical Record
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Footer note */}
        <div className="px-6 pb-6">
          <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(131, 110, 249, 0.05)' }}>
            <p className="text-xs text-center" style={{ color: 'rgba(14, 16, 15, 0.6)' }}>
              Medical records are stored permanently on IPFS and blockchain for tamper-proof preservation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 