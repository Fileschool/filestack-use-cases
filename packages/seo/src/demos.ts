/**
 * Every demo, for cross-links. Internal links between the demos and back to
 * the directory are how authority moves between pages on the same domain, so
 * each demo links to all the others.
 */
export interface IDemoLink {
  slug: string;
  name: string;
  summary: string;
}

export const DEMOS: IDemoLink[] = [
  { slug: 'insurance', name: 'Claims intake automation', summary: 'Read policy numbers off photographed paperwork and brighten dark damage photos.' },
  { slug: 'recruitment', name: 'CV virus scanning', summary: 'Keep candidate attachments locked until a Filestack Workflow has scanned them.' },
  { slug: 'legal', name: 'Expiring, watermarked document links', summary: 'Signed CDN links that stop working, and previews stamped with the recipient.' },
  { slug: 'mailroom', name: 'Digital mailroom with envelope OCR', summary: 'Read sender and recipient off scanned post and route it to the right person.' },
  { slug: 'expenses', name: 'Receipt OCR with bounding boxes', summary: 'Flatten a receipt photo, read it, and show where every figure came from.' },
  { slug: 'marketplace', name: 'Seller photo enhancement and upscaling', summary: 'Correct and enlarge bad product photos instead of rejecting them.' },
  { slug: 'construction', name: 'Construction drawing viewer', summary: 'Review PDF drawings in the browser as a document or a blueprint view.' },
  { slug: 'education', name: 'Coursework annotation', summary: 'Mark student PDFs and photos by drawing on the rendered page.' },
  { slug: 'real-estate', name: 'Real estate listing images', summary: 'Serve every listing photo size from one upload with URL transformations.' },
  { slug: 'file-sharing', name: 'File sharing with short links', summary: 'Upload with real progress and share a link that transforms images by URL.' },
];
