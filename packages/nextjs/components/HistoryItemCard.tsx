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
      setFormattedDate(date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }));
    }
  }, [historyItem]);

  if (isLoading || !historyItem) {
    return (
      <div className="bg-white rounded-monad p-4 shadow-monad animate-pulse">
        <div className="h-4 bg-monad-purple/20 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-monad-purple/20 rounded w-1/2 mb-3"></div>
        <div className="h-20 bg-monad-purple/20 rounded"></div>
      </div>
    );
  }

  const isImage = historyItem.fileType === 'image';
  const isPDF = historyItem.fileType === 'document' || historyItem.fileURI.toLowerCase().includes('.pdf');

  return (
    <div className="bg-white rounded-monad shadow-monad p-4 hover:shadow-monad-hover transition-all duration-300 border border-monad-purple/10">
      <div className="mb-3">
        <h4 className="text-lg font-semibold text-monad-black mb-1">{historyItem.title}</h4>
        <p className="text-sm text-monad-black/70 flex items-center gap-1">
          <span>📅</span>
          {formattedDate}
        </p>
      </div>
      
      <p className="text-monad-black/80 mb-4 leading-relaxed">{historyItem.description}</p>
      
      <div className="mb-4">
        {isImage ? (
          <div className="relative overflow-hidden rounded-monad">
            <Image
              src={historyItem.fileURI}
              alt={historyItem.title}
              width={400}
              height={192}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-monad-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ) : isPDF ? (
          <div className="flex items-center justify-center h-48 bg-gradient-to-br from-monad-purple/10 to-monad-berry/10 rounded-monad border border-monad-purple/20">
            <div className="text-center">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-monad-black/70 font-medium">PDF Document</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 bg-gradient-to-br from-monad-purple/10 to-monad-berry/10 rounded-monad border border-monad-purple/20">
            <div className="text-center">
              <div className="text-4xl mb-2">📎</div>
              <p className="text-monad-black/70 font-medium">File Attachment</p>
            </div>
          </div>
        )}
        
        {/* Fallback for broken images */}
        <div className="hidden flex items-center justify-center h-48 bg-gradient-to-br from-monad-purple/10 to-monad-berry/10 rounded-monad border border-monad-purple/20">
          <div className="text-center">
            <div className="text-4xl mb-2">🖼️</div>
            <p className="text-monad-black/70 font-medium">Image not available</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-monad-purple bg-monad-purple/10 px-3 py-1 rounded-full font-medium">
          {historyItem.fileType}
        </span>
        <a
          href={historyItem.fileURI}
          target="_blank"
          rel="noopener noreferrer"
          className="text-monad-purple hover:text-monad-berry text-sm font-medium 
                    flex items-center gap-1 hover:gap-2 transition-all duration-200"
        >
          View File 
          <span className="text-lg">→</span>
        </a>
      </div>
    </div>
  );
}; 