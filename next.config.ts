// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      }
    ],
    formats: ['image/avif', 'image/webp'], // Modern image formats for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Smaller image sizes
  },
  
  // SEO: Handle redirects for moved or deleted properties
  async redirects() {
    return [
      // Example: Redirect old property URLs to new format
      // Add more redirects as needed when URLs change
      {
        source: '/property/:id',
        destination: '/properties/:id',
        permanent: true, // 301 redirect for SEO
      },
      {
        source: '/listings/:id',
        destination: '/properties/:id',
        permanent: true,
      },
    ];
  },
  
  // SEO: Add custom headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
