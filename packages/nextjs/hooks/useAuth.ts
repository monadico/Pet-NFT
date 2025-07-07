"use client";

import { useAccount, useDisconnect } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import type { User } from "@privy-io/react-auth";

export interface UnifiedAuthState {
  // User info
  isConnected: boolean;
  address: string | undefined;
  isLoading: boolean;
  
  // Authentication methods
  authMethod: 'wallet' | 'email' | null;
  
  // Actions
  disconnect: () => void;
  
  // Privy specific
  privyUser: User | null;
  privyReady: boolean;
  
  // Wagmi specific
  wagmiAccount: ReturnType<typeof useAccount>;
}

export const useAuth = (): UnifiedAuthState => {
  const [authMethod, setAuthMethod] = useState<'wallet' | 'email' | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Wagmi hooks (for traditional wallet connections)
  const wagmiAccount = useAccount();
  const { address: wagmiAddress, isConnected: wagmiConnected } = wagmiAccount;
  const { disconnect: wagmiDisconnect } = useDisconnect();
  
  // Privy hooks (for email authentication)
  const { 
    ready: privyReady, 
    authenticated: privyAuthenticated, 
    user: privyUser, 
    logout: privyLogout 
  } = usePrivy();
  
  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Determine the active authentication method and address
  const getActiveAuth = () => {
    if (!mounted) {
      return { method: null, address: undefined };
    }
    
    if (wagmiConnected && wagmiAddress) {
      return { method: 'wallet' as const, address: wagmiAddress };
    }
    
    if (privyAuthenticated && privyUser?.wallet?.address) {
      return { method: 'email' as const, address: privyUser.wallet.address };
    }
    
    return { method: null, address: undefined };
  };
  
  const { method, address } = getActiveAuth();
  
  // Update auth method when it changes
  useEffect(() => {
    if (mounted) {
      setAuthMethod(method);
    }
  }, [method, mounted]);
  
  // Unified disconnect function
  const disconnect = () => {
    if (authMethod === 'wallet') {
      wagmiDisconnect();
    } else if (authMethod === 'email') {
      privyLogout();
    }
  };
  
  const isConnected = mounted && (wagmiConnected || privyAuthenticated);
  const isLoading = !mounted || !privyReady;
  
  return {
    isConnected,
    address,
    isLoading,
    authMethod,
    disconnect,
    privyUser,
    privyReady,
    wagmiAccount,
  };
}; 