// components/WagmiWrapper.tsx
"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

// Create config lazily on client-side only
let config: ReturnType<typeof getDefaultConfig> | null = null;

function getConfig() {
  if (typeof window === 'undefined') {
    // Return a dummy config for SSR
    return null;
  }

  if (!config) {
    config = getDefaultConfig({
      appName: "My RainbowKit App",
      projectId: "573f0e88432fab9f093bada111bc0104",
      chains: [mainnet, polygon, optimism, arbitrum, base],
      ssr: true,
    });
  }

  return config;
}

export default function WagmiWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const wagmiConfig = getConfig();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return children directly during SSR
  if (!mounted || !wagmiConfig) {
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={midnightTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
