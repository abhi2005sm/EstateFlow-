import type { NextConfig } from "next";

const config: NextConfig = {
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
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://gallantly-financial-ahead.ngrok-free.dev'}/:path*`,
      },
    ]
  },
};

export default config;
