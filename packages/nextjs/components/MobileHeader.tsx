"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { UnifiedAuthButton } from "./UnifiedAuthButton";

export const MobileHeader = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, address } = useAuth();

  return (
    <>
      {/* Mobile Header */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-purple-200 sticky top-0 z-40 sm:hidden">
        <div className="px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
                 style={{ background: 'linear-gradient(135deg, #836ef9 0%, #200052 100%)' }}>
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-lg font-bold gradient-text">PetVault</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg transition-colors duration-200"
            style={{ 
              backgroundColor: showMobileMenu ? 'rgba(131, 110, 249, 0.1)' : 'transparent',
              color: '#836ef9'
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-purple-200 shadow-lg"
               style={{ backdropFilter: 'blur(20px)' }}>
            <div className="p-4 space-y-4">
              <Link 
                href="/"
                onClick={() => setShowMobileMenu(false)}
                className="block py-3 px-4 rounded-lg font-medium transition-colors duration-200 hover:bg-purple-50"
                style={{ color: '#0e100f' }}
              >
                🏠 Home
              </Link>
              <Link 
                href="/pets"
                onClick={() => setShowMobileMenu(false)}
                className="block py-3 px-4 rounded-lg font-medium transition-colors duration-200 hover:bg-purple-50"
                style={{ color: '#0e100f' }}
              >
                🐾 My Pets
              </Link>
              <Link 
                href="/#mint"
                onClick={() => setShowMobileMenu(false)}
                className="block py-3 px-4 rounded-lg font-medium transition-colors duration-200 hover:bg-purple-50"
                style={{ color: '#0e100f' }}
              >
                ➕ Register Pet
              </Link>
              
              <div className="pt-4 border-t border-purple-100">
                {user || address ? (
                  <div className="space-y-3">
                    <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(131, 110, 249, 0.1)' }}>
                      <p className="text-sm font-medium" style={{ color: '#836ef9' }}>
                        Connected as
                      </p>
                      <p className="text-sm truncate" style={{ color: '#0e100f' }}>
                        {user?.email || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                      </p>
                    </div>
                  </div>
                ) : (
                  <UnifiedAuthButton />
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}; 