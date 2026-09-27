import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory would otherwise be picked as the workspace root.
  turbopack: { root: __dirname },
};

export default nextConfig;
