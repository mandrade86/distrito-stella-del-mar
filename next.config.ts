import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empaquetado listo para VPS / Node en GoDaddy (menos peso que node_modules completo)
  output: "standalone",
  poweredByHeader: false,
  // En hosting con poca RAM el lint del build a veces revienta el proceso
  eslint: {
    ignoreDuringBuilds: true,
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
