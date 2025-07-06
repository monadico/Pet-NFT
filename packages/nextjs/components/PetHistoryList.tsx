"use client";

import { usePetHistory } from "../hooks/usePetHistory";
import { HistoryItemCard } from "./HistoryItemCard";
import deployedContracts from "../contracts/deployedContracts";

interface PetHistoryListProps {
  petTokenId: bigint;
}

const PetNFTAddress = deployedContracts[10143].PetNFT.address;

export const PetHistoryList = ({ petTokenId }: PetHistoryListProps) => {
  const { useNestedItems } = usePetHistory();
  const { data: historyTokenIdsData, isLoading } = useNestedItems(PetNFTAddress, petTokenId);

  // Ensure historyTokenIds is an array
  const historyTokenIds = Array.isArray(historyTokenIdsData) ? historyTokenIdsData : [];

  if (isLoading) {
    return (
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-3 text-black">History</h4>
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border p-4 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!historyTokenIds || historyTokenIds.length === 0) {
    return (
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-3 text-black">History</h4>
        <p className="text-gray-500 text-center py-4">No history items yet</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold mb-3 text-black">
        History ({historyTokenIds.length} items)
      </h4>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {historyTokenIds.map((tokenId: bigint) => (
          <HistoryItemCard key={tokenId.toString()} tokenId={tokenId} />
        ))}
      </div>
    </div>
  );
}; 