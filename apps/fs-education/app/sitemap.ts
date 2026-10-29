import type { MetadataRoute } from 'next';

import { sitemap as build } from '@repo/seo';
import { SITE } from '@/lib/seo';

/** Every indexable page, at its public filestack.com URL. */
export default function sitemap(): MetadataRoute.Sitemap {
  return build(SITE);
}
