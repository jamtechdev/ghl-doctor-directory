import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
          {
        protocol: 'http',
        hostname: '**',
          },
        ],
      },
  // Headers are handled via middleware for conditional logic
  // See middleware.ts for X-Frame-Options configuration
};

export default nextConfig;
