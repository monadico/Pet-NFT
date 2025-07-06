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
      
      alert("History item added successfully!");
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Add New History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="file" className="block text-gray-700 text-sm font-bold mb-2">
              File (Image or PDF)
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              disabled={isSubmitting}
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isUploading ? "Uploading..." : isSubmitting ? "Adding..." : "Add History"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 