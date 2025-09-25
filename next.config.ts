import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed 'output: export' to enable dynamic routing and server-side capabilities
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
