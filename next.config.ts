import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dynamic configuration for Vercel deployment
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
