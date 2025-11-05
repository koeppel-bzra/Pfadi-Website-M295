import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: 'out',
  output: 'standalone',
};

export default nextConfig;
