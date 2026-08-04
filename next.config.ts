import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GoDaddy Node Hosting arranca con `next start` (no standalone).
  poweredByHeader: false,
  // En hosting con poca RAM el lint del build a veces revienta el proceso
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Si el panel instala sin devDependencies, no tumbar el build por types
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
