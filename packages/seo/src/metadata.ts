import type { Metadata, MetadataRoute, Viewport } from 'next';

import { FILESTACK_URL, OG_IMAGE, ogImageUrl, siteUrl, type IDemoSite } from './site';

const SUFFIX = ' | Filestack';

function images(site: IDemoSite) {
  return [{ url: ogImageUrl(site.screenshot), ...OG_IMAGE, alt: site.screenshotAlt }];
}

const INDEX: Metadata['robots'] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
};

/**
 * Root layout metadata. Sets the canonical for '/', so every other route must
 * set its own with pageMetadata() or opt out with noindex(); otherwise it
 * inherits the home page's canonical.
 */
export function rootMetadata(site: IDemoSite): Metadata {
  const url = siteUrl(site);

  return {
    metadataBase: new URL(`${url}/`),
    title: { default: `${site.title}${SUFFIX}`, template: `%s${SUFFIX}` },
    description: site.description,
    keywords: site.keywords,
    applicationName: 'Filestack',
    authors: [{ name: 'Filestack', url: FILESTACK_URL }],
    creator: 'Filestack',
    publisher: 'Filestack',
    category: 'technology',
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: 'Filestack',
      locale: 'en_US',
      url,
      title: `${site.title}${SUFFIX}`,
      description: site.description,
      images: images(site),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${site.title}${SUFFIX}`,
      description: site.description,
      images: images(site),
    },
    robots: INDEX,
    formatDetection: { telephone: false, email: false, address: false },
  };
}

/** Metadata for an indexable page other than the home page. */
export function pageMetadata(site: IDemoSite, path: string): Metadata {
  const page = site.pages.find((item) => item.path === path);
  if (!page) throw new Error(`No page registered for ${path} in ${site.slug || 'directory'}`);

  const url = siteUrl(site, path);
  const title = `${page.title}${SUFFIX}`;
  const description = page.description ?? site.description;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    // openGraph and twitter replace the parent's object rather than merging,
    // so the image has to be restated.
    openGraph: { type: 'website', siteName: 'Filestack', url, title, description, images: images(site) },
    twitter: { card: 'summary_large_image', title, description, images: images(site) },
  };
}

/** Sign-in screens, staff queues and user content: keep them out of the index. */
export const noindex: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  // Do not inherit the home page's canonical: noindex plus a canonical that
  // points elsewhere is a contradiction search engines resolve unpredictably.
  alternates: { canonical: null },
};

export function viewport(site: IDemoSite): Viewport {
  return { themeColor: site.themeColor };
}

export function sitemap(site: IDemoSite): MetadataRoute.Sitemap {
  return site.pages.map((page) => ({
    url: siteUrl(site, page.path),
    changeFrequency: 'monthly',
    priority: page.priority ?? (page.path === '/' ? 1 : 0.7),
  }));
}
