import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empaquetado listo para VPS / Node en GoDaddy (menos peso que node_modules completo)
  output: "standalone",
  poweredByHeader: false,
  images: {
    // Subidas del CMS en el mismo servidor
    remotePatterns: [],
    unoptimized: false,
  },
};

export default nextConfig;
