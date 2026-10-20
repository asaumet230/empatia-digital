import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory would otherwise be picked as the workspace root.
  turbopack: { root: __dirname },
  // The bottom-left corner belongs to the Oráculo button; keep the dev-only indicator out of its way.
  devIndicators: { position: "top-right" },
};

export default nextConfig;
