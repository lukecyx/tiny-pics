import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tiny-pics-resized.s3.eu-west-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
