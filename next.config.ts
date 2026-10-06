// next.config.js
import type { NextConfig } from 'next';

const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').origin;
  } catch {
    return 'http://localhost:8000';
  }
})();

// Public origin of the Cloudflare R2 media bucket (e.g. https://media.houzdey.com). Set it at build time.
const mediaUrl = (() => {
  try {
    return process.env.NEXT_PUBLIC_MEDIA_URL ? new URL(process.env.NEXT_PUBLIC_MEDIA_URL) : null;
  } catch {
    return null;
  }
})();
const mediaOrigin = mediaUrl ? ` ${mediaUrl.origin}` : '';

// 'unsafe-inline' stays for scripts because Next's runtime and the inline JSON-LD/analytics
// snippets are not nonce'd; the CSP still blocks script loading from any other origin.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  `img-src 'self' data: blob: https://res.cloudinary.com${mediaOrigin} https://lh3.googleusercontent.com https://www.google-analytics.com https://www.googletagmanager.com`,
  `media-src 'self' blob: https://res.cloudinary.com${mediaOrigin}`,
  "font-src 'self' data: https://fonts.gstatic.com",
  `connect-src 'self' data: blob: ${apiOrigin}${mediaOrigin} https://cloudflareinsights.com https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://res.cloudinary.com https://api.cloudinary.com https://accounts.google.com`,
  "frame-src 'self' https://accounts.google.com https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join('; ');

const nextConfig: NextConfig = {
  // IMPORTANT: Remove 'standalone' output to reduce serverless functions
  // Use default output mode which creates fewer functions
  
  // Optimize for Vercel deployment - reduce serverless functions
  experimental: {
    // Use Edge Runtime where possible to reduce function count
    serverMinification: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      ...(mediaUrl
        ? [{ protocol: mediaUrl.protocol.replace(':', '') as 'http' | 'https', hostname: mediaUrl.hostname }]
        : []),
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
    ],
    formats: ['image/avif', 'image/webp'], // Modern image formats for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Smaller image sizes
    // Increase timeout for image optimization
    minimumCacheTTL: 60,
    // Disable image optimization for Cloudinary (they handle optimization)
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Report-Only first: check the browser console for violations on real pages
          // (sign-in, maps, video, analytics), then rename to 'Content-Security-Policy' to enforce.
          {
            key: 'Content-Security-Policy-Report-Only',
            value: contentSecurityPolicy,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
