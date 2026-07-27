import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @libsql/client loads a native binding, so it must not be bundled.
  serverExternalPackages: ["@libsql/client"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.filestackcontent.com" },
    ],
  },
};

export default nextConfig;
