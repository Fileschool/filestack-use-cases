import type { IDemoSite } from '@repo/seo';

/** Everything search engines and answer engines are told about this demo. */
export const SITE: IDemoSite = {
  slug: 'file-sharing',
  name: 'File sharing with short links',
  brand: 'Fireshare',
  vertical: 'File sharing',
  title: 'File Sharing Demo with Short Links',
  description:
    'A file sharing demo built on Filestack. Upload a file with a real progress bar, get a short link anyone can open, and transform shared images by URL.',
  keywords: [
    'file sharing app',
    'share files with a link',
    'file upload with progress bar',
    'file upload API',
    'image transformation API',
    'Next.js file sharing',
    'Filestack upload',
  ],
  intro:
    'Drop in a file, watch a real progress bar, and get back a short link you can send anywhere. Filestack stores the file and serves it from its CDN; the app itself is one database table mapping a short code to a Filestack handle. Shared images can be filtered and transformed from the share page by editing the CDN URL.',
  screenshot: 'xeJdcw48TS2BN8nCkbR0',
  screenshotAlt: 'File sharing demo built on Filestack, with an upload and a short link',
  useCasePage: 'https://www.filestack.com/use-cases-file-uploads-delivery/fireshare-file-sharing-app-built-with-filestack/',
  sourcePath: 'apps/fs-filesharing',
  features: [
    { name: 'Upload with progress', task: 'Store API over XHR', what: 'Uploads with a real progress bar, because fetch does not report upload progress.' },
    { name: 'CDN delivery', what: 'Serves previews and downloads for any file type.' },
    { name: 'Image filters', task: 'monochrome, blur, sepia', what: 'Effects chosen on the share page, applied by editing the URL.' },
    { name: 'Image effects', task: 'rounded_corners, polaroid', what: 'More effects, chained in one request.' },
  ],
  steps: [
    { name: 'Drop a file', text: 'The file uploads to Filestack with live progress.' },
    { name: 'Get a link', text: 'The app saves a short code for the Filestack handle and returns a link.' },
    { name: 'Share it', text: 'Anyone with the link can preview or download the file.' },
    { name: 'Transform it', text: 'Images can be filtered on the share page with CDN URL tasks.' },
  ],
  // The same questions and answers as the filestack.com use-case page, so the
  // page, this demo and both FAQPage schemas say the same thing.
  faq: [
    {
      question:
        "What is a file sharing app built on Filestack?",
      answer:
        "A file sharing app built on Filestack stores each file in Filestack storage and gives the sender a short link to pass on. The link opens the file, or a CDN preview of it, in the recipient's browser.",
    },
    {
      question:
        "How does Fireshare upload files to Filestack?",
      answer:
        "The browser posts the file to Filestack's store endpoint, /api/store/S3, with the public API key. The response carries the file's CDN URL, and the app saves its handle under a 10-character code.",
    },
    {
      question:
        "What database does the demo use?",
      answer:
        "Turso, a hosted libSQL database, through Drizzle ORM. One shares table holds the code, handle, filename, size and view count, indexed on code and fingerprint. Another database Drizzle supports, such as Postgres or MySQL, can replace it once the table is defined for that database.",
    },
    {
      question:
        "How large can a shared file be?",
      answer:
        "The demo caps files at 500 KB with MAX_FILE_BYTES in lib/utils.ts. Raise the constant for larger files, and use the Filestack picker or SDK, which upload large files in parts and retry a failed part.",
    },
    {
      question:
        "How do I secure uploads and shared links?",
      answer:
        "Sign each upload with a Filestack security policy made on your server, and give shared links an expiry in a signed policy. The demo uploads with the public key and checks every saved URL against the Filestack CDN.",
    },
    {
      question:
        "Does the demo limit how many files a device can share?",
      answer:
        "Yes. Each device can create 10 shares in 24 hours. The browser sends a fingerprint built from the user agent, locale, screen and time zone, and the API counts that fingerprint's recent shares before saving a new one.",
    },
    {
      question:
        "Is Fireshare a real company or a Filestack customer?",
      answer:
        "Fireshare is a fictional company, created to show how Filestack works in file sharing. The product, its people and its figures are invented, and the demo runs on the real Filestack API.",
    },
    {
      question:
        "Can I see the code behind the Fireshare demo?",
      answer:
        "Yes. Fireshare is open source on GitHub in the filestack-use-cases repository, under apps/fs-filesharing. It is a Next.js app with the uploader, the share route and the share page.",
    },
  ],
  limits: [
    'Uploads are limited to 500 KB and deleted after one week.',
    'Share pages are left out of search results because they hold visitors’ files.',
  ],
  pages: [{ path: '/', title: 'File Sharing Demo with Short Links' }],
  themeColor: '#0b1929',
};
