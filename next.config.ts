import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // Next 16 dev compares encoded request paths with decoded static params.
  output: process.env.NODE_ENV === "development" ? undefined : "export",
  trailingSlash: true,
  turbopack: { root: process.cwd() },
};

export default nextConfig;
