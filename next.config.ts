import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal self-contained .next/standalone server for Docker,
  // instead of requiring the full node_modules at runtime.
  output: "standalone",
};

export default nextConfig;
