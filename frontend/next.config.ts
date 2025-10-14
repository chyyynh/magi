import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimize image loading
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Set the workspace root to silence lockfile warning
  outputFileTracingRoot: path.join(__dirname),
  // Experimental optimizations
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*'],
  },
  // Webpack configuration to handle Web3 libraries
  webpack: (config, { isServer }) => {
    // Ignore React Native dependencies in browser builds
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    };

    // Fallback for Node.js modules in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Suppress warnings for specific modules
    config.ignoreWarnings = [
      { module: /node_modules\/@metamask\/sdk/ },
      { module: /node_modules\/pino/ },
      { message: /Can't resolve '@react-native-async-storage\/async-storage'/ },
      { message: /Can't resolve 'pino-pretty'/ },
    ];

    return config;
  },
};

export default nextConfig;
