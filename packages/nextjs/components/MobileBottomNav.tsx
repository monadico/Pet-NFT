"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { usePetsData } from "../hooks/usePetsData";

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { ownedTokens } = usePetsData();

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: "🏠",
      href: "/",
      isActive: pathname === "/"
    },
    {
      id: "pets",
      label: "My Pets",
      icon: "🐾",
      href: "/pets",
      isActive: pathname === "/pets",
      badge: ownedTokens.length > 0 ? ownedTokens.length : null
    },
    {
      id: "register",
      label: "Register",
      icon: "➕",
      href: "/#mint",
      isActive: false
    },
    {
      id: "account",
      label: user ? "Account" : "Connect",
      icon: user ? "👤" : "🔗",
      href: user ? "/account" : "/",
      isActive: pathname === "/account"
    }
  ];

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="h-20 sm:hidden"></div>
      
      {/* Fixed bottom navigation - only visible on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-purple-200 z-50 sm:hidden"
           style={{ 
             boxShadow: '0 -4px 20px rgba(131, 110, 249, 0.1)',
             backdropFilter: 'blur(20px)',
             backgroundColor: 'rgba(255, 255, 255, 0.95)'
           }}>
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 rounded-lg transition-all duration-200 ${
                item.isActive 
                  ? 'bg-purple-50' 
                  : 'hover:bg-purple-50'
              }`}
              style={{
                color: item.isActive ? '#836ef9' : 'rgba(14, 16, 15, 0.7)'
              }}
            >
              <div className="relative">
                <span className="text-lg mb-1 block">{item.icon}</span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs font-medium truncate ${
                item.isActive ? 'font-semibold' : ''
              }`}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}; 