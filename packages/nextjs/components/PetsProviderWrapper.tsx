"use client";

import { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { PetsProvider } from "../hooks/usePetsData";

export const PetsProviderWrapper = ({ children }: { children: ReactNode }) => {
  const { address } = useAuth();
  
  return (
    <PetsProvider address={address}>
      {children}
    </PetsProvider>
  );
}; 