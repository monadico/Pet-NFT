"use client";

import { MyPets } from "../MyPets";

export default function PetsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-4">
          Patient Records
        </h1>
        <p className="text-monad-black/70 text-lg max-w-2xl mx-auto">
          Secure veterinary health records. Each patient&apos;s medical history and health data are permanently preserved on the blockchain, creating tamper-proof medical documentation.
        </p>
      </div>
      
      <MyPets />
    </div>
  );
} 