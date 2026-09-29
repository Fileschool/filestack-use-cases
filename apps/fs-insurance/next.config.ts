import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @libsql/client loads a native binding, so it must not be bundled.
  serverExternalPackages: ['@libsql/client'],
  // Next allows only "localhost" as a dev origin by default, so opening the dev
  // server on 127.0.0.1 gets its HMR and dev-overlay requests blocked.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.filestackcontent.com" },
    ],
  },
};

export default nextConfig;
