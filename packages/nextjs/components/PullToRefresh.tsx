"use client";

import { useState, useEffect, useRef, ReactNode, useCallback } from "react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  threshold?: number;
}

export const PullToRefresh = ({ onRefresh, children, threshold = 100 }: PullToRefreshProps) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0 && startY > 0) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      
      if (diff > 0) {
        setPullDistance(Math.min(diff * 0.4, threshold + 50));
        if (diff > 50) {
          e.preventDefault();
        }
      }
    }
  }, [startY, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
    setStartY(0);
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const refreshIndicatorOpacity = Math.min(pullDistance / threshold, 1);
  const shouldShowRefresh = pullDistance >= threshold;

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Pull to refresh indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 sm:hidden"
        style={{
          height: `${Math.max(pullDistance, 0)}px`,
          opacity: refreshIndicatorOpacity,
          transform: `translateY(-${Math.max(50 - pullDistance, 0)}px)`,
          background: 'linear-gradient(180deg, rgba(131, 110, 249, 0.1) 0%, rgba(131, 110, 249, 0.05) 100%)'
        }}
      >
        <div className="flex flex-col items-center">
          <div 
            className={`w-8 h-8 rounded-full border-2 border-purple-300 flex items-center justify-center transition-all duration-200 ${
              isRefreshing ? 'animate-spin' : shouldShowRefresh ? 'rotate-180' : ''
            }`}
            style={{ borderColor: '#836ef9' }}
          >
            {isRefreshing ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="text-sm" style={{ color: '#836ef9' }}>
                {shouldShowRefresh ? '🔄' : '⬇️'}
              </span>
            )}
          </div>
          <p className="text-xs mt-1 font-medium" style={{ color: '#836ef9' }}>
            {isRefreshing ? 'Refreshing...' : shouldShowRefresh ? 'Release to refresh' : 'Pull to refresh'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div 
        className="transition-transform duration-200"
        style={{ 
          transform: `translateY(${pullDistance}px)` 
        }}
      >
        {children}
      </div>
    </div>
  );
}; 