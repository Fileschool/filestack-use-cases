import type { MetadataRoute } from 'next';

import { siteUrl, sitemap as build } from '@repo/seo';
import { USE_CASES } from '@/lib/catalogue';
import { SITE } from '@/lib/seo';

/** The directory pages plus one page per use case, at their public URLs. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...build(SITE),
    ...USE_CASES.map((useCase) => ({
      url: siteUrl(SITE, `/use-cases/${useCase.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
