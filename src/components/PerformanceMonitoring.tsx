'use client';

import { useEffect } from 'react';

interface PerformanceNavigationTiming extends PerformanceEntry {
  loadEventEnd: number;
  fetchStart: number;
}

export default function PerformanceMonitoring() {
  useEffect(() => {
    // Only run on client side
    if ('performance' in window) {
      const handleLoad = () => {
        setTimeout(() => {
          const entries = performance.getEntriesByType('navigation');
          const perfData = entries[0] as PerformanceNavigationTiming;
          
          if (perfData && perfData.loadEventEnd && perfData.fetchStart) {
            const loadTime = perfData.loadEventEnd - perfData.fetchStart;
            console.log('Page load time:', loadTime + 'ms');

            // Send to analytics if needed
            if (typeof (window as any).gtag !== 'undefined') {
              (window as any).gtag('event', 'page_load_time', {
                value: Math.round(loadTime),
                custom_parameter: 'performance'
              });
            }
          }
        }, 0);
      };

      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return null;
}