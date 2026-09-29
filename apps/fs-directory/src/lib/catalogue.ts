import type { IUseCase } from '@/interfaces/catalogue.interface';

/**
 * Every use case in the repository. Screenshots are real: each app was run
 * locally, captured, and the image stored in Filestack like everything else.
 */
export const USE_CASES: IUseCase[] = [
  {
    slug: 'education',
    folder: 'apps/fs-education',
    business: 'Fairmount College',
    tagline: 'Coursework portal',
    vertical: 'Education',
    summary: 'Lecturers mark student work by drawing on the page.',
    description:
      'A two-sided coursework portal. Students hand in photographs, scans or PDFs; lecturers open the submission and mark it the way they would on paper, then record a score and comments the student reads back.',
    instead:
      'A PDF rendering pipeline: pdf.js in a worker or a headless browser on the server, plus storage and a cache for the rendered pages.',
    screenshot: 'GjpMq7dnQYOj5SyN9q7l',
    port: 3000,
    stack: ['Next.js 16', 'Server Actions', 'libSQL / Turso', 'Tailwind v4'],
    roles: ['Lecturer', 'Student'],
    status: 'mature',
    persistence: 'libSQL, seeded on first run',
    docs: { article: true, videoScript: true, readme: true },
    features: [
      { name: 'PDF page rendering', task: 'output=format:png,page:N', what: 'Renders one page of a PDF as an image the lecturer can draw on.', shape: 'url' },
      { name: 'PDF page count', task: 'pdfinfo', what: 'Reads how many pages a document has, so the editor knows its length.', shape: 'url' },
      { name: 'Resizing', task: 'resize', what: 'Sizes page images and list thumbnails.', shape: 'url' },
      { name: 'File Picker', what: 'Uploads from a phone, Google Drive, Dropbox or OneDrive.', shape: 'url' },
      { name: 'Direct upload', task: 'client.upload()', what: 'Pushes the lecturer’s drawing up as a transparent PNG in its own right.', shape: 'url' },
    ],
  },
  {
    slug: 'real-estate',
    folder: 'apps/fs-realestate',
    business: 'Horizon Pro',
    tagline: 'Property marketplace',
    vertical: 'Real estate',
    summary: 'One uploaded photo serves every image size the site needs.',
    description:
      'A property marketplace where the photos are the product. An agent uploads listing photographs once, and the same file serves the search thumbnail, the card, the hero and the full-screen view.',
    instead:
      'An upload endpoint, an S3 bucket, a resize worker pool and a CDN distribution.',
    screenshot: 'upFphVbCTdq67ZWYyAUA',
    port: 3000,
    stack: ['Next.js 16', 'Zustand', 'Tailwind v4'],
    roles: ['Agent', 'Buyer'],
    status: 'mature',
    persistence: 'Zustand with localStorage',
    docs: { article: true, videoScript: false, readme: true },
    features: [
      { name: 'Crop and resize', task: 'resize=fit:crop', what: 'Produces fixed-ratio cards and heroes from one original.', shape: 'url' },
      { name: 'Format conversion', task: 'output=format:webp', what: 'Converts on delivery so the grid loads quickly.', shape: 'url' },
      { name: 'Quality control', task: 'quality', what: 'Trades file size against fidelity per surface.', shape: 'url' },
      { name: 'Image filters', task: 'monochrome, sepia, blur…', what: 'A playground for crops, formats and effects on a listing photo.', shape: 'url' },
    ],
  },
  {
    slug: 'file-sharing',
    folder: 'apps/fs-filesharing',
    business: 'Fireshare',
    tagline: 'Instant file sharing',
    vertical: 'File sharing',
    summary: 'Drop a file, get a short link, transform it by URL.',
    description:
      'The smallest complete product in the repository. Drop in a file, watch a real progress bar, and get back a short link anyone can open. Images can be transformed from the share page.',
    instead: 'Essentially the entire backend. The product is one database table.',
    screenshot: 'xeJdcw48TS2BN8nCkbR0',
    port: 3000,
    stack: ['Next.js 16', 'Drizzle ORM', 'Turso', 'Tailwind v4'],
    roles: ['Anyone, no sign-in'],
    status: 'mature',
    persistence: 'Turso, one table',
    docs: { article: true, videoScript: false, readme: true },
    features: [
      { name: 'Upload with progress', task: 'Store API over XHR', what: 'Uploads with real progress, because fetch does not report it.', shape: 'url' },
      { name: 'CDN delivery', what: 'Serves previews and downloads for any file type.', shape: 'url' },
      { name: 'Image filters', task: 'monochrome, blur, sepia', what: 'User-selected effects, applied by editing the URL.', shape: 'url' },
      { name: 'Image effects', task: 'rounded_corners, polaroid', what: 'More of the same, chained in one request.', shape: 'url' },
    ],
  },
  {
    slug: 'construction',
    folder: 'apps/fs-construction',
    business: 'APEX',
    tagline: 'Construction and development',
    vertical: 'Construction',
    summary: 'One drawing, two viewers: interactive preview and blueprint.',
    description:
      'A construction quote portal. Clients attach drawings to a quote request; an architect reviews them in the browser, either as an interactive document or as a flattened blueprint they can rotate and recolour.',
    instead:
      'A rendering service, a rasteriser, storage for derived images and a cache.',
    screenshot: 't0Wq0M9CTQSmTzfsGzrp',
    port: 3000,
    stack: ['Next.js 16', 'TanStack Query', 'Zustand', 'Tailwind v4'],
    roles: ['Client', 'Lead architect'],
    status: 'built',
    persistence: 'localStorage behind a service class',
    docs: { article: true, videoScript: false, readme: true },
    features: [
      { name: 'Document preview', task: 'preview', what: 'The hosted document viewer, in one iframe. No viewer library.', shape: 'url' },
      { name: 'PDF page rendering', task: 'output=format:png,page:N', what: 'Rasterises a drawing page so the app can control how it looks.', shape: 'url' },
      { name: 'Colour filters', task: 'monochrome, blackwhite', what: 'Drops the raster to one channel for the blueprint view.', shape: 'url' },
      { name: 'Rotate and resize', task: 'rotate, resize', what: 'Turns and sizes the page under the viewer controls.', shape: 'url' },
    ],
  },
  {
    slug: 'insurance',
    folder: 'apps/fs-insurance',
    business: 'Ardmore Mutual',
    tagline: 'Insurance since 1923',
    vertical: 'Insurance',
    summary: 'One upload runs the whole claim-intake chain.',
    description:
      'A mutual insurer. Members report a claim from a phone and the file is prepared before an assessor opens it: screened, paperwork flattened and read, dark photographs brightened. Assessors work the queue and record decisions.',
    instead:
      'An orchestration service, a job queue, a malware scanner, an OCR engine and retry logic.',
    screenshot: 'MAbgVu9jSuyDgQ5Ujs9a',
    port: 3014,
    stack: ['Next.js 16', 'Server Actions', 'libSQL / Turso', 'Tailwind v4'],
    roles: ['Member', 'Claims assessor'],
    status: 'built',
    persistence: 'libSQL, eight claims seeded',
    docs: { article: true, videoScript: true, readme: true },
    features: [
      { name: 'Document detection', task: 'doc_detection', what: 'Finds a photographed policy schedule and flattens it.', shape: 'signed' },
      { name: 'Text extraction', task: 'ocr', what: 'Reads the policy number off the document so nobody retypes it.', shape: 'signed' },
      { name: 'Image enhancement', task: 'enhance=preset:fix_dark', what: 'Brightens damage photographs taken in bad light.', shape: 'url' },
      { name: 'Virus detection', task: 'virus_detection', what: 'Screens every file before the chain touches it.', shape: 'workflow' },
    ],
  },
  {
    slug: 'mailroom',
    folder: 'apps/fs-mailroom',
    business: 'Redfern',
    tagline: 'Mail and document services',
    vertical: 'Logistics',
    summary: 'Envelopes are read and routed to the right person automatically.',
    description:
      'A virtual mailroom. Scanned envelopes are read, matched against the staff directory and filed, and the contents are indexed so a year of post is searchable.',
    instead:
      'An OCR engine, a deskew pipeline, and an address parser that breaks on every new layout.',
    screenshot: 'Ee5aoZmDRjOZrIo0WttN',
    port: 3010,
    stack: ['Next.js 16', 'TanStack Query', 'Zustand', 'Tailwind v4'],
    roles: ['Mailroom staff'],
    status: 'thin',
    persistence: 'Client state only',
    docs: { article: true, videoScript: true, readme: true },
    features: [
      { name: 'Envelope reading', task: 'envelope_ocr', what: 'Returns sender and recipient as named fields, so routing is a lookup.', shape: 'signed' },
      { name: 'Document detection', task: 'doc_detection', what: 'Straightens a crooked scan before anything tries to read it.', shape: 'signed' },
      { name: 'Text extraction', task: 'ocr', what: 'Turns the contents into text for the archive index.', shape: 'signed' },
    ],
  },
  {
    slug: 'expenses',
    folder: 'apps/fs-expenses',
    business: 'Marlow',
    tagline: 'Spend and expense management',
    vertical: 'Fintech',
    summary: 'Reads a receipt and shows you where each figure came from.',
    description:
      'Expense capture from a phone. A creased receipt shot in bad light is flattened, colour corrected and read, with every word drawn back onto the image where it was found.',
    instead: 'An OCR engine, perspective correction and image enhancement.',
    screenshot: 'CY4M9mKTOU2LQo6ZOAS2',
    port: 3011,
    stack: ['Next.js 16', 'TanStack Query', 'Zustand', 'Tailwind v4'],
    roles: ['Employee', 'Finance'],
    status: 'thin',
    persistence: 'Client state only',
    docs: { article: true, videoScript: true, readme: true },
    features: [
      { name: 'Document detection', task: 'doc_detection', what: 'Finds the receipt in the photo and warps it flat.', shape: 'signed' },
      { name: 'Image enhancement', task: 'enhance=preset:fix_dark', what: 'Corrects the lighting on the flattened page.', shape: 'url' },
      { name: 'Text extraction', task: 'ocr', what: 'Returns every word with a bounding box, so figures can be shown in place.', shape: 'signed' },
    ],
  },
  {
    slug: 'marketplace',
    folder: 'apps/fs-marketplace',
    business: 'Saltmarket',
    tagline: 'Secondhand, sold well',
    vertical: 'E-commerce',
    summary: 'Rescues a bad seller photo instead of rejecting it.',
    description:
      'A secondhand marketplace. Dim phone snaps are colour corrected, undersized images are enlarged past the catalogue minimum, and one upload serves every storefront size.',
    instead: 'A resize worker pool, an enhancement model and a super-resolution service.',
    screenshot: 'I15D40KIRqSPFURLTIGp',
    port: 3012,
    stack: ['Next.js 16', 'TanStack Query', 'Zustand', 'Tailwind v4'],
    roles: ['Seller'],
    status: 'thin',
    persistence: 'Client state only',
    docs: { article: true, videoScript: true, readme: true },
    features: [
      { name: 'Image enhancement', task: 'enhance', what: 'Corrects the colour, with presets for the ways photos actually fail.', shape: 'url' },
      { name: 'Image upscaling', task: 'upscale', what: 'Returns exactly twice the width and height, keeping transparency.', shape: 'url' },
      { name: 'Resize and convert', task: 'resize, output', what: 'Serves the rescued photo at every storefront size as WebP.', shape: 'url' },
    ],
  },
  {
    slug: 'recruitment',
    folder: 'apps/fs-recruitment',
    business: 'Hollis',
    tagline: 'Applicant tracking',
    vertical: 'HR tech',
    summary: 'Attachments stay locked until they have been screened.',
    description:
      'An applicant tracker for teams that treat every attachment as a file from a stranger. Nothing opens until virus detection reports back, then it renders in the browser without being downloaded.',
    instead: 'A malware scanning service, an OCR engine and a document viewer.',
    screenshot: 'YJ95PdxiRCu9fPE2ZzQG',
    port: 3013,
    stack: ['Next.js 16', 'TanStack Query', 'Zustand', 'Tailwind v4'],
    roles: ['Candidate', 'Recruiter'],
    status: 'thin',
    persistence: 'Client state only',
    docs: { article: true, videoScript: true, readme: true },
    features: [
      { name: 'Virus detection', task: 'virus_detection', what: 'Scans after the file lands in storage and reports back by webhook.', shape: 'workflow' },
      { name: 'Document preview', task: 'preview', what: 'Renders the CV in an iframe, so nothing is written to a reviewer’s machine.', shape: 'url' },
      { name: 'Text extraction', task: 'ocr', what: 'Extracts the text so the pipeline is searchable, including scanned CVs.', shape: 'signed' },
    ],
  },
  {
    slug: 'legal',
    folder: 'apps/fs-legal',
    business: 'Pemberton Hale',
    tagline: 'Solicitors and advisors',
    vertical: 'Legal',
    summary: 'Signed links that expire, and watermarked previews.',
    description:
      'A client document room for a firm that will not send papers by email. Links are issued to one named recipient with a short expiry, and previews carry the recipient’s name in the pixels.',
    instead: 'A signed-URL service, a token store, a watermarking pipeline and a document viewer.',
    screenshot: 'ItrYGZMTTkytsq9cP0DT',
    port: 3015,
    stack: ['Next.js 16', 'TanStack Query', 'Zustand', 'Tailwind v4'],
    roles: ['Fee earner', 'Client'],
    status: 'thin',
    persistence: 'Client state only',
    docs: { article: true, videoScript: true, readme: true },
    features: [
      { name: 'Signed URLs', task: 'security=p:…,s:…', what: 'A short-lived policy signed server side, scoped to one file.', shape: 'signed' },
      { name: 'Watermarking', task: 'watermark=file:…', what: 'Composites the recipient’s name into the page itself.', shape: 'url' },
      { name: 'Document preview', task: 'preview', what: 'Lets a client read a document without downloading it.', shape: 'url' },
      { name: 'Virus detection', task: 'virus_detection', what: 'Screens anything the client sends back.', shape: 'workflow' },
    ],
  },
];

export function getUseCase(slug: string): IUseCase | undefined {
  return USE_CASES.find((useCase) => useCase.slug === slug);
}

/** Every distinct Filestack capability across the catalogue, with who uses it. */
export function featureIndex(): { name: string; shape: string; used: IUseCase[] }[] {
  const index = new Map<string, { name: string; shape: string; used: IUseCase[] }>();

  for (const useCase of USE_CASES) {
    for (const feature of useCase.features) {
      const existing = index.get(feature.name);
      if (existing) existing.used.push(useCase);
      else index.set(feature.name, { name: feature.name, shape: feature.shape, used: [useCase] });
    }
  }

  return [...index.values()].sort((a, b) => b.used.length - a.used.length);
}
