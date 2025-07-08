"use client";

import { useState } from "react";
import { useWriteContract, useChainId } from "wagmi";
import { useSendTransaction } from "@privy-io/react-auth";
import { useAuth } from "./useAuth";
import { encodeFunctionData } from "viem";
import type { Abi } from "viem";
import scaffoldConfig from "../scaffold.config";

export interface TransactionConfig {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
  value?: bigint;
}

export const useUnifiedTransaction = () => {
  const { authMethod } = useAuth();
  const chainId = useChainId();
  const [isPrivyPending, setIsPrivyPending] = useState(false);
  const [isPrivySuccess, setIsPrivySuccess] = useState(false);
  const [privyError, setPrivyError] = useState<Error | null>(null);
  
  // Wagmi hook for traditional wallets
  const { writeContract: wagmiWriteContract, isPending: wagmiPending, isSuccess: wagmiSuccess, error: wagmiError } = useWriteContract();
  
  // Privy hook for embedded wallets
  const { sendTransaction: privySendTransaction } = useSendTransaction();

  const writeContract = async (config: TransactionConfig) => {
    // 🚨 CRITICAL: Check if user is on correct network before ANY transaction
    const targetNetworkId = scaffoldConfig.targetNetworks[0].id;
    if (chainId !== targetNetworkId) {
      const error = new Error(`Wrong network! Please switch to ${scaffoldConfig.targetNetworks[0].name} (Chain ID: ${targetNetworkId}). Currently on chain ID: ${chainId}`);
      throw error;
    }
    if (authMethod === 'email') {
      // Use Privy's sendTransaction for email users - AUTO-APPROVED
      setIsPrivyPending(true);
      setIsPrivySuccess(false);
      setPrivyError(null);
      
      try {
        const data = encodeFunctionData({
          abi: config.abi,
          functionName: config.functionName,
          args: config.args || [],
        });

        // For Privy users, transaction is automatically approved
        console.log('🚀 Sending auto-approved transaction for email user...');
        
        const result = await privySendTransaction({
          to: config.address,
          data,
          value: config.value || 0n,
        }, {
          // This removes the confirmation modal for automatic approval
          uiOptions: {
            showWalletUIs: false
          }
        });

        console.log('✅ Auto-approved transaction sent successfully!');
        setIsPrivySuccess(true);
        return result;
      } catch (error) {
        console.error('❌ Auto-approved transaction failed:', error);
        setPrivyError(error as Error);
        throw error;
      } finally {
        setIsPrivyPending(false);
      }
    } else {
      // Use Wagmi's writeContract for traditional wallets - REQUIRES APPROVAL
      // Reset Privy states
      setIsPrivyPending(false);
      setIsPrivySuccess(false);
      setPrivyError(null);
      
      console.log('🔗 Sending transaction for wallet user (requires approval)...');
      
      return wagmiWriteContract({
        address: config.address,
        abi: config.abi,
        functionName: config.functionName,
        args: config.args,
        value: config.value,
      });
    }
  };

  // Return unified interface
  return {
    writeContract,
    isPending: authMethod === 'email' ? isPrivyPending : wagmiPending,
    isSuccess: authMethod === 'email' ? isPrivySuccess : wagmiSuccess,
    error: authMethod === 'email' ? privyError : wagmiError,
  };
}; 