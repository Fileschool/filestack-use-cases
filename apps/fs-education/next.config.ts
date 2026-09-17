import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next only allows "localhost" as a dev origin by default, so loading the
  // dev server over 127.0.0.1 gets its HMR and dev-overlay requests blocked.
  allowedDevOrigins: ["127.0.0.1"],
  // @libsql/client loads a native binding, so it must not be bundled.
  serverExternalPackages: ["@libsql/client"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.filestackcontent.com" },
    ],
  },
};

export default nextConfig;
