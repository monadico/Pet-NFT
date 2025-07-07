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
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-monad-purple/20 rounded-monad animate-pulse"></div>
          <div className="h-5 bg-monad-purple/20 rounded-monad w-24 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-monad-purple/20 rounded-full"></div>
                <div className="w-px h-16 bg-monad-purple/20"></div>
              </div>
              <div className="flex-1 bg-monad-purple/10 rounded-monad p-4">
                <div className="h-4 bg-monad-purple/20 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-monad-purple/20 rounded w-1/2 mb-2"></div>
                <div className="h-20 bg-monad-purple/20 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!historyTokenIds || historyTokenIds.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-monad-purple/10 rounded-monad mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">📚</span>
        </div>
        <h4 className="text-lg font-semibold text-monad-black mb-2">No Medical Records Yet</h4>
        <p className="text-monad-black/70 text-sm">
          Start building secure, permanent medical history for this patient
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 bg-gradient-monad rounded-monad flex items-center justify-center">
          <span className="text-white text-xs">📖</span>
        </div>
        <h4 className="text-lg font-semibold text-monad-black">
          Medical History
        </h4>
        <span className="text-sm text-monad-black/70">
          ({historyTokenIds.length} records)
        </span>
      </div>
      
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-monad-purple via-monad-berry to-monad-purple opacity-30"></div>
        
        <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
          {historyTokenIds.map((tokenId: bigint, index: number) => (
            <div key={tokenId.toString()} className="relative flex gap-4">
              {/* Timeline Dot */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 bg-gradient-monad rounded-full flex items-center justify-center shadow-monad border-2 border-white">
                  <span className="text-white text-xs">
                    {historyTokenIds.length - index}
                  </span>
                </div>
              </div>
              
              {/* Memory Card */}
              <div className="flex-1 -mt-1">
                <HistoryItemCard tokenId={tokenId} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 