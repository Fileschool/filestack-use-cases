import type { IDemoSite } from '@repo/seo';

/** Everything search engines and answer engines are told about this demo. */
export const SITE: IDemoSite = {
  slug: 'legal',
  name: 'Expiring, watermarked document links',
  brand: 'Pemberton Hale',
  vertical: 'Legal services',
  title: 'Secure Document Sharing Demo for Law Firms',
  description:
    'A secure document sharing demo built on Filestack. Links carry a signed policy that expires, and previews are watermarked with the recipient\u2019s name.',
  keywords: [
    'secure document sharing',
    'expiring links',
    'signed URLs',
    'document watermarking API',
    'client portal for law firms',
    'Filestack security policy',
    'watermark task',
  ],
  intro:
    'A fee earner issues a document to one named client. The link carries a Filestack security policy signed on the server, scoped to one file and set to expire. The preview is stamped with the recipient\u2019s name by the watermark task, so the mark is in the pixels and a screenshot still says who it was issued to.',
  screenshot: 'ItrYGZMTTkytsq9cP0DT',
  screenshotAlt: 'Secure document sharing demo built on Filestack, with an expiring link and a watermarked preview',
  sourcePath: 'apps/fs-legal',
  features: [
    { name: 'Signed URLs', task: 'security=p:\u2026,s:\u2026', what: 'A short-lived policy signed on the server and scoped to one file.' },
    { name: 'Watermarking', task: 'watermark=file:\u2026', what: 'Composites the recipient\u2019s name into the page itself.' },
    { name: 'PDF page rendering', task: 'output=format:png,page:1', what: 'Turns the first page into an image the watermark can be applied to.' },
    { name: 'Document preview', task: 'preview', what: 'Lets a client read a document without downloading it.' },
  ],
  steps: [
    { name: 'Upload the document', text: 'A completion statement, a will or any confidential file goes to Filestack.' },
    { name: 'Name the recipient', text: 'The fee earner types who the document is for.' },
    { name: 'Issue the link', text: 'The server signs a policy with an expiry and returns a finished URL.' },
    { name: 'Stamp the preview', text: 'The recipient\u2019s name is drawn to an overlay and composited onto the page with watermark.' },
  ],
  // The same questions and answers as the filestack.com use-case page, so the
  // page, this demo and both FAQPage schemas say the same thing.
  faq: [
    {
      question:
        "What is a secure client document portal?",
      answer:
        "A secure client document portal is a private space where a firm shares confidential files with clients and receives files back. Each file opens under a link issued to one person, with access that ends at a set time.",
    },
    {
      question:
        "How do expiring links work in Filestack?",
      answer:
        "Each link carries a policy, base64 JSON holding an expiry time, the permitted calls and the file handle, plus an HMAC-SHA256 signature made with your app secret. Filestack refuses the link once the expiry passes. Turn on security for the application as well, or the plain URL for the same file keeps working.",
    },
    {
      question:
        "Can a signed link be withdrawn before it expires?",
      answer:
        "A policy stays valid until its expiry, so short expiries and a fresh link on request take the place of revocation. Your portal's own sign-in controls who can request a link.",
    },
    {
      question:
        "How is the recipient's watermark applied?",
      answer:
        "The watermark task composites another stored file, such as an image of the recipient's name, over the document. The name is in the pixels, so a screenshot still shows who the page was issued to.",
    },
    {
      question:
        "Are client uploads scanned for malware?",
      answer:
        "They can be. Filestack's virus_detection task runs in a Workflow after each upload and sends its verdict to your portal by webhook, so the portal can hold a file until it comes back clean. The Pemberton Hale demo does not take client uploads yet, so it does not show this step.",
    },
    {
      question:
        "Which plans include virus detection and webhooks?",
      answer:
        "Virus detection and webhooks run on paid plans, each with a free trial. Uploads and CDN delivery run on every plan, including the free plan. See pricing.",
    },
    {
      question:
        "Is Pemberton Hale a real company or a Filestack customer?",
      answer:
        "Pemberton Hale is a fictional company, created to show how Filestack works in legal and professional services. The firm, its people and its figures are invented, and the demo runs on the real Filestack API.",
    },
    {
      question:
        "Can I see the code behind the Pemberton Hale demo?",
      answer:
        "Yes. Pemberton Hale is open source on GitHub in the filestack-use-cases repository, under apps/fs-legal. It is a Next.js app with the signing route, the countdown and the watermark overlay.",
    },
  ],
  limits: [
    'Signed links only protect a file when Security is enabled for the Filestack application.',
    'The watermark is applied to the first page of the document.',
    'Issued links are recorded in the browser for the demo, not in a database.',
  ],
  pages: [
    { path: '/', title: 'Secure Document Sharing Demo for Law Firms' },
    {
      path: '/demo',
      title: 'Issue an Expiring, Watermarked Document Link',
      description:
        'Upload a document, name the recipient and issue a Filestack link that expires, with the preview watermarked by the recipient\u2019s name.',
    },
  ],
  themeColor: '#12100e',
};
