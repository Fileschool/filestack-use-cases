import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Where Next serves from. Empty locally; set to the rewrite's sub-path in
  // production. The canonical URL is configured separately, in @repo/seo.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  transpilePackages: ['@repo/seo'],
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
