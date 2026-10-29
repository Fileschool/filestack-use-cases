import type { IDemoSite } from '@repo/seo';

/** Everything search engines and answer engines are told about this demo. */
export const SITE: IDemoSite = {
  slug: 'construction',
  name: 'Construction drawing viewer',
  brand: 'APEX',
  vertical: 'Construction',
  title: 'Construction Drawing Viewer Demo',
  description:
    'A construction quote portal demo built on Filestack. Review PDF drawings in the browser as an interactive document or a rotatable blueprint view.',
  keywords: [
    'construction drawing viewer',
    'PDF drawing viewer',
    'blueprint viewer online',
    'construction quote portal',
    'document preview API',
    'PDF to image API',
    'Filestack preview',
  ],
  intro:
    'A client attaches drawings to a quote request and an architect reviews them in the browser. The same Filestack handle is served two ways: through the hosted previewer for reading, and as a rasterised page the app controls, with rotation, a blueprint tint and sizing all built into the CDN URL.',
  screenshot: 't0Wq0M9CTQSmTzfsGzrp',
  screenshotAlt: 'Construction drawing viewer demo built on Filestack',
  sourcePath: 'apps/fs-construction',
  features: [
    { name: 'Document preview', task: 'preview', what: 'The hosted document viewer in one iframe, with page navigation and zoom.' },
    { name: 'PDF page rendering', task: 'output=format:png,page:N', what: 'Rasterises a drawing page so the app controls how it looks.' },
    { name: 'Colour filters', task: 'monochrome, blackwhite', what: 'Flattens the raster to one channel for the blueprint view.' },
    { name: 'Rotate and resize', task: 'rotate, resize', what: 'Turns and sizes the page under the viewer controls.' },
  ],
  steps: [
    { name: 'Request a quote', text: 'The client fills in the request and attaches drawings with the File Picker.' },
    { name: 'Read the drawing', text: 'The architect opens it in the hosted previewer, page by page.' },
    { name: 'Switch to blueprint view', text: 'The page is rasterised, rotated and tinted with tasks in the CDN URL.' },
    { name: 'Send the estimate', text: 'The architect returns a cost breakdown to the client.' },
  ],
  // The same questions and answers as the filestack.com use-case page, so the
  // page, this demo and both FAQPage schemas say the same thing.
  faq: [
    {
      question:
        "How can I view construction drawings in the browser?",
      answer:
        "Upload the drawing to Filestack and load preview/HANDLE in an iframe. The hosted viewer handles page navigation, scrolling and zoom for PDFs and Office documents.",
    },
    {
      question:
        "How do I turn a PDF drawing into an image?",
      answer:
        "Add output=format:png,page:1,density:150 to the file's CDN URL to rasterize that page at 150 DPI. Rotate, monochrome and resize can follow in the same URL.",
    },
    {
      question:
        "Why does resize go last in the chain?",
      answer:
        "Tasks run left to right, so filtering the full-size raster before resizing keeps the hairline detail drawings depend on, including small dimension text.",
    },
    {
      question:
        "Which drawing formats render in both viewers?",
      answer:
        "PDF drawings and images render in both viewers, and a PDF export is how most drawings reach a client. Confirm native CAD formats such as DWG with a sample file on your own account.",
    },
    {
      question:
        "Does every filter and zoom level create a new render?",
      answer:
        "Each distinct task chain renders once and is then cached, so a different filter, rotation or image width gets its own render. The demo changes the image width when you zoom, so each zoom step is a new render. Keeping zoom and hue rotation in CSS avoids that, so the CDN only does the work that needs the original bytes.",
    },
    {
      question:
        "Is APEX a real company or a Filestack customer?",
      answer:
        "APEX is a fictional company created to show how Filestack works in construction. Its firm, people and figures are invented, and the demo runs on the real Filestack API.",
    },
    {
      question:
        "Can I see the code behind the APEX demo?",
      answer:
        "Yes. APEX is open source in the filestack-use-cases GitHub repository at apps/fs-construction. It is a Next.js app with the uploader, both viewers and the thumbnails.",
    },
  ],
  limits: [
    'Rendering is proven on PDFs and images. Native CAD formats are accepted by the picker but not rendered by the demo.',
    'Quotes are stored in the browser for the demo, not in a database.',
    'Sign-in is emulated so both sides can be explored.',
  ],
  pages: [{ path: '/', title: 'Construction Drawing Viewer Demo' }],
  themeColor: '#141414',
};
