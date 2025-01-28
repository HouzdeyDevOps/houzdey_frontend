import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;


// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   output: 'standalone',
//   experimental: {
//     optimizeCss: false,
//   },
//   images: {
//     domains: ['images.unsplash.com'],
//   },
//   webpack: (config) => {
//     config.resolve.fallback = { fs: false };
//     config.experiments = {
//       ...config.experiments,
//       topLevelAwait: true,
//     };
//     // Add CSS handling
//     config.module.rules.push({
//       test: /\.css$/,
//       use: ['style-loader', 'css-loader'],
//     });
//     return config;
//   },
// };

// export default nextConfig;