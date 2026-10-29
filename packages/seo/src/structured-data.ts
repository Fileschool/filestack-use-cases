import { DEMOS } from './demos';
import {
  FILESTACK_URL,
  OG_IMAGE,
  REPO_URL,
  USE_CASES_URL,
  ogImageUrl,
  otherDemoUrl,
  siteUrl,
  type IDemoSite,
} from './site';

const ORG_ID = `${FILESTACK_URL}#organization`;
const WEBSITE_ID = `${FILESTACK_URL}#website`;

/**
 * One @graph for the home page: who publishes it, what the page is, what the
 * app does, where the code is, how to use it and what people ask about it.
 * The FAQ entries are the same objects the visible FAQ renders, so the two
 * cannot drift apart.
 */
export function structuredData(site: IDemoSite) {
  const url = siteUrl(site);
  const isDirectory = !site.slug;
  const image = { '@type': 'ImageObject', url: ogImageUrl(site.screenshot), ...OG_IMAGE };

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: FILESTACK_URL },
      { '@type': 'ListItem', position: 2, name: 'Use Cases', item: USE_CASES_URL },
      { '@type': 'ListItem', position: 3, name: 'Demos', item: otherDemoUrl('') },
      ...(isDirectory ? [] : [{ '@type': 'ListItem', position: 4, name: site.name, item: url }]),
    ],
  };

  const graph: Record<string, unknown>[] = [
    { '@type': 'Organization', '@id': ORG_ID, name: 'Filestack', url: FILESTACK_URL },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: FILESTACK_URL,
      name: 'Filestack',
      publisher: { '@id': ORG_ID },
    },
    {
      '@type': isDirectory ? 'CollectionPage' : 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: site.title,
      description: site.description,
      inLanguage: 'en',
      isPartOf: { '@id': WEBSITE_ID },
      publisher: { '@id': ORG_ID },
      primaryImageOfPage: image,
      breadcrumb: { '@id': `${url}#breadcrumb` },
      ...(isDirectory ? {} : { mainEntity: { '@id': `${url}#app` } }),
      ...(site.useCasePage ? { relatedLink: site.useCasePage } : {}),
    },
    breadcrumb,
  ];

  if (isDirectory) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${url}#demos`,
      name: 'Filestack demo applications',
      itemListElement: DEMOS.map((demo, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: demo.name,
        description: demo.summary,
        url: otherDemoUrl(demo.slug),
      })),
    });
  } else {
    graph.push(
      {
        '@type': 'WebApplication',
        '@id': `${url}#app`,
        name: site.name,
        url,
        description: site.description,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any (web browser)',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        image,
        featureList: site.features.map((feature) =>
          feature.task ? `${feature.name} (${feature.task})` : feature.name,
        ),
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@id': ORG_ID },
      },
      {
        '@type': 'SoftwareSourceCode',
        '@id': `${url}#source`,
        name: `${site.name} demo source`,
        codeRepository: site.sourcePath ? `${REPO_URL}/tree/main/${site.sourcePath}` : REPO_URL,
        programmingLanguage: 'TypeScript',
        runtimePlatform: 'Next.js',
        targetProduct: { '@id': `${url}#app` },
        publisher: { '@id': ORG_ID },
      },
    );

    if (site.steps.length > 0) {
      graph.push({
        '@type': 'HowTo',
        '@id': `${url}#howto`,
        name: `How the ${site.name.toLowerCase()} demo works`,
        step: site.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text,
        })),
      });
    }
  }

  if (site.faq.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: site.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

/** Serialises JSON-LD for a <script> tag. `<` is escaped so text cannot close it. */
export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
