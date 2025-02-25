import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  poweredByHeader: false,
  compress: true,
  images: {
    domains: [
      "st4.depositphotos.com",
      "www.shutterstock.com",
      "i.ibb.co.com",
      "i.ibb.co",
    ],
  },
};

export default nextConfig;
