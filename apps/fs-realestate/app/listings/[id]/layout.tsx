import type { Metadata } from "next";

import { noindex } from "@repo/seo";

/** Listings live in the visitor's browser, so there is nothing stable to index. */
export const metadata: Metadata = noindex;

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
