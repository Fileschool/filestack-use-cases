import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Where Next serves from. Empty locally; set to the rewrite's sub-path in
  // production. The canonical URL is configured separately, in @repo/seo.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  transpilePackages: ['@repo/seo'],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.filestackcontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
