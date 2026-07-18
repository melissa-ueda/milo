import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/milo' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
