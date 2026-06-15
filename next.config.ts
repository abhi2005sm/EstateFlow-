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
    return [
      {
        // Whenever the frontend calls /api/..., silently forward it to Ngrok!
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://estateflow-api-gateway.onrender.com'}/:path*`,
      },
    ]
  },
};

export default config;
