import type { NextConfig } from "next";

// Use dynamic import for bundle analyzer
let bundleAnalyzer: (config: NextConfig) => NextConfig = (c) => c;
try {
  // @ts-ignore: No types available for @next/bundle-analyzer
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
  bundleAnalyzer = withBundleAnalyzer;
} catch (e) {
  console.warn('Bundle analyzer not installed, skipping...');
}

const nextConfig: NextConfig = {
  // Image optimization configuration
  images: {
    domains: ['cdn.sanity.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },

  // ignore eslint errors during builds

  eslint: {
    ignoreDuringBuilds: true, // ← Add this line
  },
  typescript: {
    ignoreBuildErrors: true, // ← Add this line
  },
  
  // ... rest of your config
  // Disable experimental features that might cause connection issues
  experimental: {
    // Disable turbopack for stability with React 19
    turbo: undefined,
    // Disable worker threads for Windows build issues
    workerThreads: false,
  },
  // External packages for server components
  serverExternalPackages: ['@sanity/client'],
  // Improve connection stability
  httpAgentOptions: {
    keepAlive: true,
  },
  // Optimize for development stability
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Security headers including CSP
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "media-src 'self' https:",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com",
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' }
        ],
      },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
