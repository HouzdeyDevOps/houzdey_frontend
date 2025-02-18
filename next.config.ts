import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/disbboeb4/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**', 
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://www.houzdey.com',
        permanent: true,
      },
    ];
  },
  // other config options here
};

export default nextConfig;


