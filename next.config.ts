import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

module.exports = {
  experimental: {
    baseUrl: "https://your-valid-url.com", // 確保這是有效的 URL
  },
};

export default nextConfig;
