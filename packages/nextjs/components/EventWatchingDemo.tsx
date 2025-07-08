"use client";

import { useState } from "react";
import { useWatchContractEvent } from "wagmi";
import { useAuth } from "../hooks/useAuth";
import scaffoldConfig from "../scaffold.config";
import deployedContracts from "../contracts/deployedContracts";

const chainId = scaffoldConfig.targetNetworks[0].id;
const PetNFTABI = deployedContracts[chainId].PetNFT.abi;
const PetNFTAddress = deployedContracts[chainId].PetNFT.address;

/**
 * Demo component showing the real-time event watching improvement
 * This replaces the old periodic refresh that interrupted users
 */
export const EventWatchingDemo = () => {
  const [eventLog, setEventLog] = useState<string[]>([]);
  const { address } = useAuth();

  // Watch for Transfer events in real-time
  useWatchContractEvent({
    address: PetNFTAddress,
    abi: PetNFTABI,
    eventName: "Transfer",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onLogs: (logs: any) => {
      const timestamp = new Date().toLocaleTimeString();
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      logs.forEach((log: any) => {
        const { from, to, tokenId } = log.args;
        const isMint = from === '0x0000000000000000000000000000000000000000';
        
        const message = isMint 
          ? `🎉 ${timestamp}: New mint detected! Token #${tokenId} → ${to}`
          : `🔄 ${timestamp}: Transfer detected! Token #${tokenId}: ${from} → ${to}`;
        
        setEventLog(prev => [message, ...prev.slice(0, 9)]); // Keep last 10 events
      });
    },
    enabled: !!address,
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          🎯 Real-Time Event Watching
        </h3>
        <p className="text-sm text-gray-600">
          No more disruptive page refreshes! Events are detected instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="text-center p-4 bg-red-50 rounded-xl">
          <div className="text-2xl mb-2">❌</div>
          <h4 className="font-semibold text-red-800 mb-2">Before</h4>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Refreshed every 30 seconds</li>
            <li>• Interrupted users during minting</li>
            <li>• Unnecessary network calls</li>
            <li>• Poor user experience</li>
          </ul>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <div className="text-2xl mb-2">✅</div>
          <h4 className="font-semibold text-green-800 mb-2">After</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Real-time event detection</li>
            <li>• No interruptions during minting</li>
            <li>• Only updates when needed</li>
            <li>• Smooth user experience</li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-semibold mb-3 text-gray-800">Recent Events</h4>
        {eventLog.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {eventLog.map((event, index) => (
              <div key={index} className="text-sm font-mono bg-white p-2 rounded border">
                {event}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">
            {address ? "Waiting for events..." : "Connect your wallet to see events"}
          </div>
        )}
      </div>
    </div>
  );
}; 