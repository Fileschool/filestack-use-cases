import type { IDemoSite } from '@repo/seo';

/** The directory of every demo: the hub the demos link back to. */
export const SITE: IDemoSite = {
  slug: '',
  name: 'Filestack demo applications',
  vertical: 'Software development',
  title: 'Filestack Demo Apps and Use Case Examples',
  description:
    'Ten working Filestack demo apps, from claims intake to receipt OCR, with the exact upload, transformation and intelligence features each one uses.',
  keywords: [
    'Filestack examples',
    'Filestack demo',
    'file upload API examples',
    'image transformation examples',
    'OCR API examples',
    'Next.js file upload examples',
    'Filestack use cases',
  ],
  intro:
    'Each demo is a complete Next.js application dressed as a business, not a snippet: an insurer, a mailroom, an applicant tracker, a law firm and more. Each one lists the Filestack features it uses, whether they run as a plain URL, a signed URL or a Workflow, and the infrastructure they replace. The source for every demo is open on GitHub.',
  screenshot: 'MAbgVu9jSuyDgQ5Ujs9a',
  screenshotAlt: 'Filestack demo applications, built on the Filestack File API',
  features: [],
  steps: [],
  faq: [
    {
      question: 'What are the Filestack demo apps?',
      answer:
        'They are working Next.js applications that show Filestack in a real product, from claims intake and receipt OCR to virus scanning, expiring links and image delivery. Each runs on the real Filestack API.',
    },
    {
      question: 'Are the businesses in the demos real?',
      answer:
        'No. Every business, person and figure in the demos is fictional, so the apps can show a complete workflow without describing a real customer.',
    },
    {
      question: 'Can I run the demos myself?',
      answer:
        'Yes. The source is in the filestack-use-cases repository on GitHub. Clone it, add your own Filestack API key, and run any app with npx turbo dev and a filter for its folder.',
    },
    {
      question: 'What is the difference between a URL task, a signed URL and a Workflow?',
      answer:
        'URL tasks such as resize and enhance are built in the browser. Intelligence tasks such as ocr and doc_detection reject unsigned requests, so a server signs a policy first. virus_detection runs in a Workflow after upload and reports by webhook.',
    },
    {
      question: 'Which Filestack features do the demos cover?',
      answer:
        'Uploads with the File Picker, CDN delivery, resize, crop and format conversion, document preview, PDF page rendering, enhance, upscale, watermark, ocr, envelope_ocr, doc_detection, signed security policies and virus_detection.',
    },
  ],
  limits: [
    'The demos favour clarity over production hardening. Each article lists what to change before shipping.',
  ],
  pages: [
    { path: '/', title: 'Filestack Demo Apps and Use Case Examples' },
    {
      path: '/capabilities',
      title: 'Filestack Capabilities by Demo App',
      description:
        'Every Filestack capability used across the demo apps, from resize and OCR to Workflows, and which demo shows each one in a working product.',
      priority: 0.8,
    },
  ],
  themeColor: '#141414',
};
