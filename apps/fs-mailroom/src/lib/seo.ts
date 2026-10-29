import type { IDemoSite } from '@repo/seo';

/** Everything search engines and answer engines are told about this demo. */
export const SITE: IDemoSite = {
  slug: 'mailroom',
  name: 'Digital mailroom with envelope OCR',
  brand: 'Redfern',
  vertical: 'Mail services',
  title: 'Digital Mailroom Demo with Envelope OCR',
  description:
    'A digital mailroom demo built on Filestack. envelope_ocr reads the sender and recipient off scanned post as named fields and routes each item to a person.',
  keywords: [
    'digital mailroom',
    'envelope OCR',
    'mail scanning software',
    'automated mail routing',
    'address extraction API',
    'virtual mailroom',
    'Filestack envelope_ocr',
  ],
  intro:
    'An operator uploads a batch of scanned envelopes. Filestack\u2019s envelope_ocr returns the sender, recipient name and recipient address as separate fields, so routing is a lookup against the staff directory rather than a parser. Anything that cannot be matched is held for a supervisor, and each scan is read with OCR so the archive is searchable.',
  screenshot: 'Ee5aoZmDRjOZrIo0WttN',
  screenshotAlt: 'Digital mailroom demo built on Filestack, routing scanned envelopes to staff',
  sourcePath: 'apps/fs-mailroom',
  features: [
    { name: 'Envelope reading', task: 'envelope_ocr', what: 'Returns sender, recipient name and recipient address as named fields.' },
    { name: 'Document detection', task: 'doc_detection', what: 'Straightens a crooked scan before it is read.' },
    { name: 'Text extraction', task: 'ocr', what: 'Turns the scan into text for the search index.' },
    { name: 'Signed requests', task: 'security=p:\u2026,s:\u2026', what: 'A short-lived policy signed on the server, because these tasks reject unsigned calls.' },
  ],
  steps: [
    { name: 'Upload the batch', text: 'A morning\u2019s scans go to Filestack in one File Picker upload.' },
    { name: 'Read each envelope', text: 'A signed envelope_ocr request returns the sender and recipient as fields.' },
    { name: 'Route it', text: 'The recipient is matched against the staff directory and the item is routed or held for a supervisor.' },
    { name: 'Index it', text: 'doc_detection and ocr turn the scan into searchable text.' },
  ],
  // The same questions and answers as the filestack.com use-case page, so the
  // page, this demo and both FAQPage schemas say the same thing.
  faq: [
    {
      question:
        "What is a digital mailroom, and how is it automated?",
      answer:
        "A digital mailroom receives paper post, scans it and delivers each item to its recipient as a digital file. An automated mailroom reads the envelope, routes the item to the named person and indexes the contents for search.",
    },
    {
      question:
        "How does envelope OCR differ from regular OCR?",
      answer:
        "Envelope OCR returns the sender, recipient name and recipient address as named fields. Regular OCR returns all the text on the page with word positions, and your code decides which block is the recipient.",
    },
    {
      question:
        "Where does an unmatched envelope go?",
      answer:
        "An unmatched envelope is held in a review queue for a supervisor. The app tries the full recipient name first, then any part of the name longer than three letters. A scan where envelope OCR finds no recipient name is held for review too.",
    },
    {
      question:
        "Which plans include Envelope OCR?",
      answer:
        "Envelope OCR runs on paid plans, with a free trial. Each read carries a policy signed with your app secret that grants read and convert on the scan's handle. See pricing.",
    },
    {
      question:
        "Can the contents be read on the server as each scan arrives?",
      answer:
        "Yes. A Filestack Workflow attached to the upload runs doc_detection and ocr as each scan arrives, and the fs.workflow webhook delivers the results to your endpoint.",
    },
    {
      question:
        "Is Redfern a real company or a Filestack customer?",
      answer:
        "Redfern is a fictional company, created to show how Filestack works in mail and document services. The firm, its people and its figures are invented, and the demo runs on the real Filestack API.",
    },
    {
      question:
        "Can I see the code behind the Redfern demo?",
      answer:
        "Yes. Redfern is open source on GitHub in the filestack-use-cases repository, under apps/fs-mailroom. It is a Next.js app with the signing route and the routing code.",
    },
  ],
  limits: [
    'The staff directory is a short fixed list for the demo.',
    'The search index is built from the envelope scan; a real mailroom would scan the contents separately.',
    'Items are stored in the browser for the demo, not in a database.',
  ],
  pages: [
    { path: '/', title: 'Digital Mailroom Demo with Envelope OCR' },
    {
      path: '/demo',
      title: 'Scan and Route Post with envelope_ocr',
      description:
        'Upload scanned envelopes and watch Filestack read the sender and recipient, match each item to a person and hold anything it is unsure about.',
    },
  ],
  themeColor: '#16233b',
};
