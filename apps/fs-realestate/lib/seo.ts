import type { IDemoSite } from '@repo/seo';

/** Everything search engines and answer engines are told about this demo. */
export const SITE: IDemoSite = {
  slug: 'real-estate',
  name: 'Real estate listing images',
  brand: 'Horizon Pro',
  vertical: 'Real estate',
  title: 'Real Estate Listing Image Demo',
  description:
    'A property listings demo built on Filestack. One uploaded photo serves the search thumbnail, the listing card, the hero and the full view, all by URL.',
  keywords: [
    'real estate listing photos',
    'property image hosting',
    'image resize API',
    'responsive images CDN',
    'webp conversion API',
    'real estate website images',
    'Filestack transformations',
  ],
  intro:
    'An agent uploads listing photographs once. The same Filestack handle then serves every surface the site needs: square search thumbnails, fixed-ratio cards, a wide hero and a full-screen view, each cropped, resized and converted to WebP in the CDN URL. There is no resize worker, bucket or CDN distribution to run.',
  screenshot: 'upFphVbCTdq67ZWYyAUA',
  screenshotAlt: 'Real estate listing demo built on Filestack, with a grid of property photos',
  useCasePage: 'https://www.filestack.com/use-cases/real-estate-file-management/',
  sourcePath: 'apps/fs-realestate',
  features: [
    { name: 'Crop and resize', task: 'resize=fit:crop', what: 'Produces fixed-ratio cards and heroes from one original.' },
    { name: 'Format conversion', task: 'output=format:webp', what: 'Converts on delivery so the listing grid loads quickly.' },
    { name: 'Quality control', task: 'quality', what: 'Trades file size against fidelity for each surface.' },
    { name: 'Image filters', task: 'monochrome, sepia, blur', what: 'A playground for crops, formats and effects on a listing photo.' },
  ],
  steps: [
    { name: 'Post a property', text: 'The agent uploads listing photos with the File Picker.' },
    { name: 'Store one handle', text: 'The listing keeps the Filestack handle, not a set of resized files.' },
    { name: 'Serve every size', text: 'Each surface builds its own resize, crop and output URL from that handle.' },
    { name: 'Cache at the edge', text: 'Every distinct URL is rendered once and then served from the CDN.' },
  ],
  // The same questions and answers as the filestack.com use-case page, so the
  // page, this demo and both FAQPage schemas say the same thing.
  faq: [
    {
      question:
        "What is file management for real estate?",
      answer:
        "File management for real estate is how a listings platform stores agents' photos and documents and serves them to buyers. With Filestack, each photo is stored once and every size the site needs is a URL on its handle.",
    },
    {
      question:
        "Can Filestack handle high-volume listing photo uploads?",
      answer:
        "Yes. Large files upload in parts and a failed part is retried, so an agent can send dozens of photos at once from a phone on a cellular connection. Retry settings and cancel tokens are part of the SDK.",
    },
    {
      question:
        "How are listing images delivered?",
      answer:
        "Through the Filestack CDN. Each transformed URL is computed on its first request and cached at the edge from then on. The output format is set per variant in the URL, or left to auto_image.",
    },
    {
      question:
        "Can I generate different sizes of the same photo?",
      answer:
        "Yes. One stored file backs every size. Thumbnails, gallery sizes and full-screen variants are separate transformation URLs on the same handle, each rendered on demand.",
    },
    {
      question:
        "How do private and pre-market listings stay protected?",
      answer:
        "A signed policy limits a link to one file, the actions allowed on it and an expiry, so your app can share off-market and pocket listings only with the people who should see them.",
    },
    {
      question:
        "Does Filestack handle documents as well as photos?",
      answer:
        "Yes. Disclosures, inspection reports and floor plans upload through the same endpoint as photos, and the hosted viewer opens PDFs and Office documents in the browser.",
    },
    {
      question:
        "Is Horizon Pro a real company or a Filestack customer?",
      answer:
        "Horizon Pro is a fictional company, created to show how Filestack works in real estate. The brokerage, its people and its figures are invented, and the demo runs on the real Filestack API.",
    },
    {
      question:
        "Can I see the code behind the Horizon Pro demo?",
      answer:
        "Yes. Horizon Pro is open source on GitHub in the filestack-use-cases repository, under apps/fs-realestate. It is a Next.js app with the uploader, the image presets, the transform panel and the search filters.",
    },
  ],
  limits: [
    'Listings are stored in the browser for the demo, not in a database.',
    'The property listings, agents and prices are invented.',
  ],
  pages: [
    { path: '/', title: 'Real Estate Listing Image Demo' },
    {
      path: '/buy',
      title: 'Property Listings Served from One Upload',
      description:
        'Browse property listings in the Filestack real estate demo, where every thumbnail, card and hero is cropped and converted from a single uploaded photo.',
    },
    {
      path: '/search',
      title: 'Property Search with CDN Image Resizing',
      description:
        'Filter property listings in the Filestack real estate demo and see the same photo served at every size the search results need, by URL.',
    },
    {
      path: '/sell',
      title: 'List a Property with Filestack Uploads',
      description:
        'See how the Filestack real estate demo takes listing photos from an agent and turns one upload into every image the property page needs.',
    },
  ],
  themeColor: '#881337',
};
