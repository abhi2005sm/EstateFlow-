import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  
  // THE FIX: The Next.js Proxy!
  async rewrites() {
    const dest = `${process.env.NEXT_PUBLIC_API_URL || 'https://estateflow-api-gateway.onrender.com'}/:path*`;
    console.log("[NextConfig] API Rewrite Destination:", dest);
    return [
      {
        source: '/api/:path*',
        destination: dest,
      },
    ]
  },
};

export default config;
