import type { IDemoSite } from '@repo/seo';

/** Everything search engines and answer engines are told about this demo. */
export const SITE: IDemoSite = {
  slug: 'insurance',
  name: 'Claims intake automation',
  brand: 'Ardmore Mutual',
  vertical: 'Insurance',
  title: 'Claims Intake Automation Demo',
  description:
    'A claims intake demo built on Filestack. OCR reads policy numbers off photographed paperwork and dark damage photos are brightened, all from one upload.',
  keywords: [
    'claims intake automation',
    'insurance claims OCR',
    'policy number extraction',
    'document detection API',
    'damage photo enhancement',
    'insurance document processing',
    'Filestack OCR',
  ],
  intro:
    'A member reports a claim from a phone and attaches photographs and paperwork. Filestack flattens and reads a photographed policy schedule so the policy number fills itself in, brightens damage photos taken in bad light, and leaves every original untouched for the record. Assessors work the queue and record decisions.',
  screenshot: 'MAbgVu9jSuyDgQ5Ujs9a',
  screenshotAlt: 'Claims intake demo built on Filestack, showing a claim on the assessment desk',
  useCasePage: 'https://www.filestack.com/use-cases/claims-intake-automation/',
  sourcePath: 'apps/fs-insurance',
  features: [
    { name: 'Document detection', task: 'doc_detection', what: 'Finds a photographed policy schedule in the picture and flattens it before it is read.' },
    { name: 'Text extraction', task: 'ocr', what: 'Reads the page so the policy number is filled in without anyone retyping it.' },
    { name: 'Image enhancement', task: 'enhance=preset:fix_dark', what: 'Brightens damage photographs taken at night, as a view over the untouched original.' },
    { name: 'File Picker', what: 'Uploads photos and PDFs from a phone, Google Drive, Dropbox or OneDrive.' },
  ],
  steps: [
    { name: 'Report the claim', text: 'The member says what happened, when, and roughly what it is worth.' },
    { name: 'Attach photos and paperwork', text: 'Files go from the phone straight to Filestack through the File Picker.' },
    { name: 'Read the paperwork', text: 'A signed doc_detection and ocr request flattens and reads the policy schedule, and the policy number fills itself in.' },
    { name: 'Assess the claim', text: 'The assessor sees brightened photos, the extracted text and a link to every original, and records a decision.' },
  ],
  // The same questions and answers as the filestack.com use-case page, so the
  // page, this demo and both FAQPage schemas say the same thing.
  faq: [
    {
      question:
        "What is claims intake automation?",
      answer:
        "Claims intake automation prepares a policyholder's files before an adjuster opens the claim. Uploads are screened for malware, paperwork is straightened and read, and photos are corrected, so the adjuster starts with a complete, legible file.",
    },
    {
      question:
        "Why does the virus scan run first?",
      answer:
        "Later tasks open the file, so the scan gates them. In a Filestack Workflow, logic on the scan's infected result decides whether document detection, OCR or enhancement runs.",
    },
    {
      question:
        "Can Filestack find policy numbers in claim documents?",
      answer:
        "The ocr task returns the full text of the flattened page. Your claims system then finds the policy and claim numbers, for example with a pattern match, and keeps the word boxes for review.",
    },
    {
      question:
        "Why run the chain in a Workflow?",
      answer:
        "A Workflow runs on Filestack after upload, so it carries on when the policyholder closes the browser, and Filestack retries the webhook that delivers the results. The tasks are set up in the Developer Portal, so their order can change without frontend changes.",
    },
    {
      question:
        "Which plans include these tasks?",
      answer:
        "Virus detection, document detection, OCR, image enhancement and webhooks run on paid plans, each with a free trial. See the pricing page for plan details.",
    },
    {
      question:
        "Is Ardmore Mutual a real company or a Filestack customer?",
      answer:
        "Neither. Ardmore Mutual is a fictional company, and its people and figures are invented to show how Filestack works in insurance. The demo runs on the real Filestack API.",
    },
    {
      question:
        "Is there a working demo of claims intake?",
      answer:
        "Yes. The Ardmore Mutual demo is a Next.js app built on Filestack and is open source in the filestack-use-cases repository under apps/fs-insurance. Run it locally to report a claim, see the policy number read off a photographed schedule, and review the claim on the assessment desk.",
    },
  ],
  limits: [
    'The demo does not scan uploads for malware yet.',
    'OCR is requested from the member’s browser. A production system should repeat it on the server before trusting the result.',
    'Policy numbers are found with a pattern for this insurer’s format, not a general parser.',
  ],
  pages: [
    { path: '/', title: 'Claims Intake Automation Demo' },
    {
      path: '/demo',
      title: 'Report a Claim with Automatic Policy Lookup',
      description:
        'Report a claim in the Filestack claims intake demo. Attach a photo of a policy schedule and watch OCR fill in the policy number, then see the claim on the desk.',
    },
  ],
  themeColor: '#0f2a4a',
};
