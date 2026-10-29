import type { IDemoSite } from '@repo/seo';

/** Everything search engines and answer engines are told about this demo. */
export const SITE: IDemoSite = {
  slug: 'expenses',
  name: 'Receipt OCR with bounding boxes',
  brand: 'Marlow',
  vertical: 'Expense management',
  title: 'Receipt OCR Demo with Bounding Boxes',
  description:
    'A receipt scanning demo built on Filestack. A phone photo is flattened, colour corrected and read with OCR, and every word is outlined where it was found.',
  keywords: [
    'receipt OCR',
    'receipt scanning API',
    'OCR bounding boxes',
    'expense receipt capture',
    'document detection',
    'perspective correction API',
    'Filestack OCR',
  ],
  intro:
    'An employee photographs a receipt at any angle and in any light. Filestack finds the receipt in the photo and flattens it, corrects the lighting, and reads it. Because ocr returns a bounding box for every word, the app draws each one back onto the image, so a finance reviewer can check a total at a glance.',
  screenshot: 'CY4M9mKTOU2LQo6ZOAS2',
  screenshotAlt: 'Receipt OCR demo built on Filestack, with every word outlined on the receipt',
  sourcePath: 'apps/fs-expenses',
  features: [
    { name: 'Document detection', task: 'doc_detection', what: 'Finds the receipt inside the photo and warps it flat.' },
    { name: 'Image enhancement', task: 'enhance=preset:fix_dark', what: 'Corrects the lighting on a receipt photographed indoors.' },
    { name: 'Text extraction', task: 'ocr', what: 'Returns the text with a bounding box for every word, so each figure can be shown in place.' },
    { name: 'Signed requests', task: 'security=p:\u2026,s:\u2026', what: 'A short-lived policy signed on the server, because ocr and doc_detection reject unsigned calls.' },
  ],
  steps: [
    { name: 'Photograph the receipt', text: 'Crooked and badly lit is fine. The photo goes straight from the phone to Filestack.' },
    { name: 'Flatten and correct it', text: 'doc_detection finds and warps the page and enhance fixes the exposure.' },
    { name: 'Read it', text: 'A signed ocr request returns the text, the words and a box for each word.' },
    { name: 'Check it', text: 'Every word is outlined on the image, and the total is pulled out for the finance queue.' },
  ],
  // The same questions and answers as the filestack.com use-case page, so the
  // page, this demo and both FAQPage schemas say the same thing.
  faq: [
    {
      question:
        "What is receipt OCR, and what does it return?",
      answer:
        "Receipt OCR reads the text on a photographed or scanned receipt, including the merchant, items and total, so an expense app can fill in a claim. Filestack's ocr task returns that text with a bounding box for every word.",
    },
    {
      question:
        "Why flatten a receipt before OCR?",
      answer:
        "A flat, cropped receipt reads more accurately than a crooked photo of a table. doc_detection finds the receipt in the photo and warps it flat, and ocr then reads the flattened image.",
    },
    {
      question:
        "How are the word boxes drawn on the receipt?",
      answer:
        "Each word in the ocr response carries a bounding box. Convert each box to fractions of the image's natural size and position it over the flattened receipt, not the original photo, because the boxes belong to the image doc_detection produced.",
    },
    {
      question:
        "How does the app find the receipt total?",
      answer:
        "The ocr task returns the full text and every word's position. The demo takes the last amount after a word such as total, amount due or balance, shows it as the claim total, and outlines every word it read on the receipt so the figure can be checked.",
    },
    {
      question:
        "Which Filestack tasks need a signed URL?",
      answer:
        "ocr and doc_detection need a policy signed with your app secret, so a server route builds those URLs. Image tasks such as enhance and resize also answer a plain CDN URL when the application's security settings allow it.",
    },
    {
      question:
        "Which plans include receipt OCR?",
      answer:
        "OCR, document detection and enhance run on paid plans, each with a free trial. Uploads and CDN delivery run on every plan, including the free plan.",
    },
    {
      question:
        "Is Marlow a real company or a Filestack customer?",
      answer:
        "Marlow is a fictional company, created to show how Filestack works in expense management and accounting. The firm, its people and its figures are invented, and the demo runs on the real Filestack API.",
    },
    {
      question:
        "Can I see the code behind the Marlow demo?",
      answer:
        "Yes. Marlow is open source on GitHub in the filestack-use-cases repository, under apps/fs-expenses. It is a Next.js app with the signing route, the reader and the overlay.",
    },
  ],
  limits: [
    'The total is found with a heuristic, not a full receipt parser.',
    'Receipts are stored in the browser for the demo, not in a database.',
    'doc_detection has a maximum input size, so very large photos should be downscaled first.',
  ],
  pages: [
    { path: '/', title: 'Receipt OCR Demo with Bounding Boxes' },
    {
      path: '/demo',
      title: 'Scan a Receipt with OCR and See Every Word',
      description:
        'Photograph a receipt and watch Filestack flatten it, correct the light and read it, with every word outlined on the image where the OCR found it.',
    },
  ],
  themeColor: '#2b1b3d',
};
