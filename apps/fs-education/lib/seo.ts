import type { IDemoSite } from '@repo/seo';

/** Everything search engines and answer engines are told about this demo. */
export const SITE: IDemoSite = {
  slug: 'education',
  name: 'Coursework annotation',
  brand: 'Fairmount College',
  vertical: 'Education',
  title: 'Coursework Marking and PDF Annotation Demo',
  description:
    'A coursework portal demo built on Filestack. Students hand in PDFs or photos and lecturers mark them by drawing on the rendered page in the browser.',
  keywords: [
    'PDF annotation',
    'online coursework marking',
    'annotate PDF in browser',
    'student submission portal',
    'PDF to image API',
    'education file uploads',
    'Filestack File Picker',
  ],
  intro:
    'Students hand in photographs, scans or PDFs. Lecturers open a submission and mark it the way they would on paper, circling and writing on each page, then record a score and comments the student reads back. Filestack renders each PDF page as an image to draw on, reads the page count, and stores the lecturer’s markings as a file of their own.',
  screenshot: 'GjpMq7dnQYOj5SyN9q7l',
  screenshotAlt: 'Coursework marking demo built on Filestack, with a lecturer annotating a student PDF',
  useCasePage: 'https://www.filestack.com/use-cases/education-file-management/',
  sourcePath: 'apps/fs-education',
  features: [
    { name: 'PDF page rendering', task: 'output=format:png,page:N', what: 'Renders one page of a PDF as an image the lecturer can draw on.' },
    { name: 'PDF page count', task: 'pdfinfo', what: 'Reads how many pages a document has, so the marking editor knows its length.' },
    { name: 'Resizing', task: 'resize', what: 'Sizes page images and list thumbnails.' },
    { name: 'File Picker', what: 'Takes submissions from a phone, Google Drive, Dropbox or OneDrive.' },
    { name: 'Direct upload', task: 'client.upload()', what: 'Stores the lecturer’s drawing as a transparent PNG over the page.' },
  ],
  steps: [
    { name: 'Set the work', text: 'The lecturer creates an assignment with a deadline.' },
    { name: 'Hand it in', text: 'The student uploads a PDF, scan or photo through the File Picker.' },
    { name: 'Mark it', text: 'Each page is rendered as an image and the lecturer draws on it in the browser.' },
    { name: 'Return it', text: 'The markings, score and comments go back to the student.' },
  ],
  // The same questions and answers as the filestack.com use-case page, so the
  // page, this demo and both FAQPage schemas say the same thing.
  faq: [
    {
      question:
        "How do I convert a PDF page to an image?",
      answer:
        "Write the page into an output task in the CDN URL, in front of the file's handle, such as output=format:png,page:2,density:150. Filestack renders that page as a PNG on the first request and caches it at the edge.",
    },
    {
      question:
        "Can students hand in work from a phone?",
      answer:
        "Yes. The picker uploads photos, scans and PDFs from a phone or a laptop, and it also reaches Google Drive, Dropbox and OneDrive. Large files upload in parts and a failed part is retried, so a large scan survives a weak connection.",
    },
    {
      question:
        "Does marking change the student's original file?",
      answer:
        "The original stays as uploaded. Marks are drawn on a canvas over the page image and saved to Filestack as a separate transparent PNG, and the browser stacks the two, so a mark can be cleared or redrawn later.",
    },
    {
      question:
        "How many pages can one submission have?",
      answer:
        "The page count comes from pdfinfo on the stored PDF. The app requests and saves each page separately, so a multi-page document is marked one page at a time.",
    },
    {
      question:
        "How is student work kept private?",
      answer:
        "A signed policy limits a link to one file, the actions allowed on it and an expiry, and your app decides who gets a link. Filestack has an annual SOC 2 audit, with the report on request, and a GDPR data processing agreement. FERPA does not certify software, and Filestack's data processing terms cover the obligations when an institution treats it as a school official.",
    },
    {
      question:
        "Does this work with an LMS like Canvas or Moodle?",
      answer:
        "Filestack is an HTTP API with SDKs, called from your own code, including code an LMS integration runs. The demo is a standalone app. Filestack for EdTech covers integration across a platform.",
    },
    {
      question:
        "Is Fairmount College a real company or a Filestack customer?",
      answer:
        "Fairmount College is a fictional college, created to show how Filestack works in education. The college, its people and its figures are invented, and the demo runs on the real Filestack API.",
    },
    {
      question:
        "Can I see the code behind the Fairmount College demo?",
      answer:
        "Yes. Fairmount College is open source on GitHub in the filestack-use-cases repository, under apps/fs-education. It is a Next.js app with the picker, the page renderer, the marking editor and the overlay upload.",
    },
  ],
  limits: [
    'Sign-in is emulated so the lecturer and student sides can both be explored.',
    'The demo database is seeded with sample assignments on first run.',
  ],
  pages: [{ path: '/', title: 'Coursework Marking and PDF Annotation Demo' }],
  themeColor: '#18181b',
};
