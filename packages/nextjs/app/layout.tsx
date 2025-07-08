import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { UnifiedAuthButton } from "../components/UnifiedAuthButton";
import { MobileHeader } from "../components/MobileHeader";
import { MobileBottomNav } from "../components/MobileBottomNav";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PetVault - Secure Digital Pet Ownership",
  description: "Immutable digital pet ownership on the Monad blockchain. Your pets and their memories are permanently preserved and protected forever.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#836ef9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PetVault" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className="font-sans">
        <Providers>
          <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #fbfaf9, white)' }}>
            {/* Mobile Header - visible only on mobile */}
            <div className="block sm:hidden">
              <MobileHeader />
            </div>
            
            {/* Desktop Navigation Header - hidden on mobile */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-purple-200 sticky top-0 z-50 hidden sm:block">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  {/* Logo and Brand */}
                  <div className="flex items-center space-x-4">
                    <Link href="/" className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
                           style={{ background: 'linear-gradient(135deg, #836ef9 0%, #200052 100%)' }}>
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                      </div>
                      <span className="text-xl font-bold gradient-text">PetVault</span>
                    </Link>
                  </div>
                  
                  {/* Navigation Links */}
                  <div className="hidden md:flex items-center space-x-8">
                    <Link 
                      href="/" 
                      className="font-medium transition-colors duration-200 hover:text-purple-600"
                      style={{ color: '#0e100f' }}
                    >
                      Home
                    </Link>
                    <Link 
                      href="/pets" 
                      className="font-medium transition-colors duration-200 hover:text-purple-600"
                      style={{ color: '#0e100f' }}
                    >
                      My Pets
                    </Link>
                  </div>
                  
                  {/* Auth Button */}
                  <div className="flex items-center">
                    <UnifiedAuthButton />
                  </div>
                </div>
              </div>
            </nav>
            
            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>
            
            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />
            
            {/* Footer */}
            <footer className="text-white py-8 mt-16" style={{ backgroundColor: '#200052' }}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center"
                         style={{ background: 'linear-gradient(to right, #836ef9, #a0055d)' }}>
                      <div className="w-3 h-3 bg-white rounded-sm"></div>
                    </div>
                    <span className="text-lg font-semibold">PetVault</span>
                  </div>
                  <p className="text-white/80 mb-4">
                    Secure, immutable digital pet ownership
                  </p>
                  <div className="flex justify-center space-x-6 text-sm">
                    <span className="text-white/60">Powered by Monad</span>
                    <span className="text-white/60">•</span>
                    <a 
                      href="https://docs.monad.xyz/guides/scaffold-eth" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white/80 transition-colors duration-200 cursor-pointer"
                    >
                      Built with Scaffold ETH 2
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
        
        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    }, function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
