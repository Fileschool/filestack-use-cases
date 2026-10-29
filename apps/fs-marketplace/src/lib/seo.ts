import type { IDemoSite } from '@repo/seo';

/** Everything search engines and answer engines are told about this demo. */
export const SITE: IDemoSite = {
  slug: 'marketplace',
  name: 'Seller photo enhancement and upscaling',
  brand: 'Saltmarket',
  vertical: 'Online marketplaces',
  title: 'Product Photo Enhancement Demo',
  description:
    'A marketplace photo demo built on Filestack. Dim seller photos are colour corrected, small ones are upscaled, and one upload serves every storefront size.',
  keywords: [
    'product photo enhancement',
    'image upscaling API',
    'marketplace image processing',
    'auto enhance photos API',
    'image resize API',
    'webp conversion',
    'Filestack enhance',
  ],
  intro:
    'A seller uploads the photo they already have, even if it is dark or too small. Filestack corrects the colour with an enhance preset, doubles the size with upscale, and serves the result as a search tile, a listing card and a full view. Every step is a segment in a CDN URL, so there is no server in the path.',
  screenshot: 'I15D40KIRqSPFURLTIGp',
  screenshotAlt: 'Marketplace photo demo built on Filestack, comparing an original and an enhanced photo',
  sourcePath: 'apps/fs-marketplace',
  features: [
    { name: 'Image enhancement', task: 'enhance=preset:…', what: 'Corrects colour with presets such as fix_dark, fix_tint, vivid and outdoor.' },
    { name: 'Image upscaling', task: 'upscale', what: 'Returns twice the width and height, with optional noise reduction.' },
    { name: 'Resize and crop', task: 'resize=fit:crop', what: 'Cuts every storefront size from one upload.' },
    { name: 'Format conversion', task: 'output=format:webp', what: 'Serves each size as WebP.' },
  ],
  steps: [
    { name: 'Upload a photo', text: 'The seller uploads whatever they have through the File Picker.' },
    { name: 'Correct it', text: 'An enhance preset fixes a dark, tinted or flat photo.' },
    { name: 'Enlarge it', text: 'upscale doubles a photo that falls short of the catalogue minimum.' },
    { name: 'Serve every size', text: 'resize and output build each storefront size from the same handle.' },
  ],
  // The same questions and answers as the filestack.com use-case page, so the
  // page, this demo and both FAQPage schemas say the same thing.
  faq: [
    {
      question:
        "How do I improve seller photos on a marketplace?",
      answer:
        "Run each seller photo through color correction and upscaling before it reaches the storefront. With Filestack, enhance corrects color and exposure and upscale doubles the size, both as tasks in the photo's CDN URL.",
    },
    {
      question:
        "What does Filestack upscale do?",
      answer:
        "upscale with default settings returns the image at twice its width and height. The noise option reduces grain, which suits small phone photos taken in poor light.",
    },
    {
      question:
        "Which enhance preset fits which photo?",
      answer:
        "fix_dark suits a photo shot indoors in dim light, fix_tint a yellow or blue cast, vivid a flat product shot and outdoor a hazy daylight photo. auto lets Filestack choose.",
    },
    {
      question:
        "Does image enhancement need a server?",
      answer:
        "No. The browser can build the whole chain, because enhance and upscale answer a plain CDN URL while the application's security setting is off. Add your domains to the domain whitelist, and limit file types and sizes with the picker's accept and maxSize options.",
    },
    {
      question:
        "How many versions of each photo does Filestack create?",
      answer:
        "Each distinct task chain renders once and is cached, so five presets across three sizes makes fifteen variants per photo. Choosing the preset at listing time keeps it to one chain per size.",
    },
    {
      question:
        "Which plans include enhance and upscale?",
      answer:
        "Enhance and upscale run on paid plans, each with a free trial. Resize and format conversion run on every plan, including the free plan. See pricing.",
    },
    {
      question:
        "Is Saltmarket a real company or a Filestack customer?",
      answer:
        "Saltmarket is a fictional company, created to show how Filestack works in online marketplaces and e-commerce. The firm, its people and its figures are invented, and the demo runs on the real Filestack API.",
    },
    {
      question:
        "Can I see the code behind the Saltmarket demo?",
      answer:
        "Yes. Saltmarket is open source on GitHub in the filestack-use-cases repository, under apps/fs-marketplace. It is a Next.js app with the presets, the upscale step and the storefront sizes.",
    },
  ],
  limits: [
    'The demo shows enhance and upscale side by side; a production storefront should chain them into one URL.',
    'upscale doubles the size once. Very small photos still need a better original.',
    'Nothing is stored between visits; the demo works on one photo at a time.',
  ],
  pages: [
    { path: '/', title: 'Product Photo Enhancement Demo' },
    {
      path: '/demo',
      title: 'Enhance and Upscale a Product Photo',
      description:
        'Upload a dim or small product photo and see Filestack correct the colour, double the size and serve it at every storefront size, all from URL tasks.',
    },
  ],
  themeColor: '#22251e',
};
