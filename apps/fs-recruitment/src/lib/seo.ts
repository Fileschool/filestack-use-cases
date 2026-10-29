import type { IDemoSite } from '@repo/seo';

/** Everything search engines and answer engines are told about this demo. */
export const SITE: IDemoSite = {
  slug: 'recruitment',
  name: 'CV virus scanning',
  brand: 'Hollis',
  vertical: 'Recruitment',
  title: 'CV Virus Scanning Demo for Applicant Tracking',
  description:
    'An applicant tracking demo built on Filestack. CVs stay locked until a Workflow virus scan reports back, then open in the browser without a download.',
  keywords: [
    'virus scan file uploads',
    'malware scanning API',
    'CV attachment scanning',
    'applicant tracking security',
    'document preview iframe',
    'Filestack Workflows',
    'virus_detection',
  ],
  intro:
    'A candidate uploads a CV. The attachment stays locked until Filestack’s virus_detection task, which runs in a Workflow after the file lands in storage, posts its verdict to a webhook. A clean file opens in the hosted document previewer, so nothing is written to the recruiter’s machine, and ocr makes the text searchable.',
  screenshot: 'YJ95PdxiRCu9fPE2ZzQG',
  screenshotAlt: 'Applicant tracking demo built on Filestack, with a CV locked while it is scanned',
  sourcePath: 'apps/fs-recruitment',
  features: [
    { name: 'Virus detection', task: 'virus_detection', what: 'Scans each upload in a Workflow and reports the verdict by webhook.' },
    { name: 'Document preview', task: 'preview', what: 'Renders the CV in an iframe, so it is never downloaded.' },
    { name: 'Text extraction', task: 'ocr', what: 'Extracts the text so applications are searchable, scanned CVs included.' },
    { name: 'File Picker', what: 'Takes CVs from a laptop, Google Drive or Dropbox.' },
  ],
  steps: [
    { name: 'Upload the CV', text: 'The candidate uploads a PDF, image or Word document.' },
    { name: 'Scan it', text: 'A Filestack Workflow runs virus_detection and posts the verdict to the app’s webhook.' },
    { name: 'Unlock it', text: 'A clean file opens in the hosted previewer. An infected one stays blocked.' },
    { name: 'Search it', text: 'A signed ocr request extracts the text for the pipeline.' },
  ],
  // The same questions and answers as the filestack.com use-case page, so the
  // page, this demo and both FAQPage schemas say the same thing.
  faq: [
    {
      question:
        "How do I scan resume uploads for viruses?",
      answer:
        "Attach a Filestack Workflow containing virus_detection to the upload. Each CV is scanned once it lands in storage, and the fs.workflow webhook delivers the verdict, infected true or false, to your endpoint.",
    },
    {
      question:
        "Why preview CVs in the browser?",
      answer:
        "A preview renders the document on Filestack's side and shows it in an iframe, so a stranger's file stays off the recruiter's disk. preview/HANDLE covers PDFs and Office documents.",
    },
    {
      question:
        "What happens to an infected file?",
      answer:
        "Your app decides. The verdict carries infected and infections_list, so the webhook handler can quarantine the file, keep it out of the recruiter pipeline and notify your security team.",
    },
    {
      question:
        "Can scanned or photographed CVs be searched?",
      answer:
        "Yes. A signed ocr call reads the text of a CV that arrives as a photo or a scan, so your app can store that text with the candidate and search it. The Hollis demo extracts and shows the text; it does not keep a search index.",
    },
    {
      question:
        "Which plans include virus detection?",
      answer:
        "Virus detection, OCR and webhooks run on paid plans, each with a free trial. Workflows are built in the developer portal and attached to uploads by ID. See pricing.",
    },
    {
      question:
        "Is Hollis a real company or a Filestack customer?",
      answer:
        "Hollis is a fictional company, created to show how Filestack works in recruitment and HR. The firm, its people and its figures are invented, and the demo runs on the real Filestack API.",
    },
    {
      question:
        "Can I see the code behind the Hollis demo?",
      answer:
        "Yes. Hollis is open source on GitHub in the filestack-use-cases repository, under apps/fs-recruitment. It is a Next.js app with the webhook route, the locked preview and the OCR call.",
    },
  ],
  limits: [
    'The scan needs a Filestack Workflow and webhook configured in the developer portal.',
    'Verdicts are held in server memory for the demo, so they do not survive a restart.',
    'Without a Workflow the demo unlocks the preview after a short wait, so it can still be explored.',
  ],
  pages: [
    { path: '/', title: 'CV Virus Scanning Demo for Applicant Tracking' },
    {
      path: '/demo',
      title: 'Upload a CV and Watch It Stay Locked',
      description:
        'Upload a CV to the Filestack applicant tracking demo. It stays locked until virus detection reports back, then opens in the browser with its text extracted.',
    },
  ],
  themeColor: '#0d2b1d',
};
