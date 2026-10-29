import type { Metadata } from 'next';

import { noindex } from '@repo/seo';

/** Sign-in and staff screens stay out of search results. */
export const metadata: Metadata = noindex;

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
