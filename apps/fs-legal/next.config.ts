import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
