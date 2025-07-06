"use client";

import { usePetHistory, HistoryItem } from "../hooks/usePetHistory";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

interface HistoryItemCardProps {
  tokenId: bigint;
}

export const HistoryItemCard = ({ tokenId }: HistoryItemCardProps) => {
  const { useHistoryItem } = usePetHistory();
  const { data: historyItemData, isLoading } = useHistoryItem(tokenId);
  const [formattedDate, setFormattedDate] = useState<string>("");

  // Parse the history item data if it's a tuple/array
  const historyItem = useMemo(() => {
    return historyItemData && Array.isArray(historyItemData) ? {
      title: historyItemData[0],
      description: historyItemData[1],
      fileURI: historyItemData[2],
      fileType: historyItemData[3],
      timestamp: historyItemData[4],
      parentContract: historyItemData[5],
      parentTokenId: historyItemData[6],
    } : (historyItemData as unknown as HistoryItem);
  }, [historyItemData]);

  useEffect(() => {
    if (historyItem?.timestamp) {
      const date = new Date(Number(historyItem.timestamp) * 1000);
      setFormattedDate(date.toLocaleDateString());
    }
  }, [historyItem]);

  if (isLoading || !historyItem) {
    return (
      <div className="border p-4 rounded-lg shadow animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-20 bg-gray-300 rounded"></div>
      </div>
    );
  }

  const isImage = historyItem.fileType === 'image';
  const isPDF = historyItem.fileType === 'document' || historyItem.fileURI.toLowerCase().includes('.pdf');

  return (
    <div className="border p-4 rounded-lg shadow">
      <div className="mb-3">
        <h4 className="text-lg font-semibold text-black">{historyItem.title}</h4>
        <p className="text-sm text-gray-600">{formattedDate}</p>
      </div>
      
      <p className="text-gray-700 mb-3">{historyItem.description}</p>
      
      <div className="mb-3">
        {isImage ? (
          <Image
            src={historyItem.fileURI}
            alt={historyItem.title}
            width={400}
            height={192}
            className="w-full h-48 object-cover rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : isPDF ? (
          <div className="flex items-center justify-center h-48 bg-gray-100 rounded">
            <div className="text-center">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-gray-600">PDF Document</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 bg-gray-100 rounded">
            <div className="text-center">
              <div className="text-4xl mb-2">📎</div>
              <p className="text-gray-600">File Attachment</p>
            </div>
          </div>
        )}
        
        {/* Fallback for broken images */}
        <div className="hidden flex items-center justify-center h-48 bg-gray-100 rounded">
          <div className="text-center">
            <div className="text-4xl mb-2">🖼️</div>
            <p className="text-gray-600">Image not available</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {historyItem.fileType}
        </span>
        <a
          href={historyItem.fileURI}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          View File →
        </a>
      </div>
    </div>
  );
}; 