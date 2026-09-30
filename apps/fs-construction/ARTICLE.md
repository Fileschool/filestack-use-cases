# Two Viewers, One Handle: A Construction Quote Portal Built on Filestack

A construction quote starts with a drawing. A client sends a floor plan, a site survey or a 40-page structural set, and somebody has to look at it before they can price the job.

Looking at it is the awkward part. The file is large, it is often a format the browser has never heard of, and the person who needs to read it is an estimator on a laptop, not someone with a CAD seat. The usual answer is to make them download it, which means the review happens outside your product, in someone else's software, where you lose the thread.

Building the alternative yourself is a rendering pipeline: a conversion service, a rasteriser, storage for the derived images, a cache so page 12 is not re-rendered every time somebody scrolls past it. That is a meaningful amount of infrastructure before you have priced a single job.

This guide walks through **ApexCAD**, a two-sided construction quote portal, and the thing worth stealing from it: **the same uploaded file is served through two completely different viewers, and each is a URL.**

## What we're building

A client fills in a quote request, attaches their drawings, and submits. An architect opens the submission and reviews the drawing in the browser, either as an interactive document with page navigation, or as a flattened "blueprint view" they can rotate, recolour and zoom. They then send back a cost estimate with a line-item breakdown.

No part of that involves a rendering server.

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Upload, storage, CDN, rendering | Filestack |
| Client state | Zustand, TanStack Query |
| Forms and validation | React Hook Form, Zod |
| Styling | Tailwind v4 |
| Language | TypeScript |

Quotes live in `localStorage` behind a service class, so the demo runs with no database. Logins are emulated: you pick a side, client or architect, and explore both. The file layer is the real thing.

## Step 1: Get your Filestack API key

```bash
NEXT_PUBLIC_FILESTACK_API_KEY=your_api_key_here
```

The `NEXT_PUBLIC_` prefix is required because uploads go from the browser straight to Filestack with no server hop. In production, lock the key down with [Security Policies](https://www.filestack.com/docs/security/): allowed origins, MIME types, a size cap.

## Step 2: Upload from wherever the drawing actually lives

Drawings in construction are rarely on the laptop of the person filling in your form. They are in a shared Drive folder, a Dropbox the contractor set up, or a link somebody emailed. The File Picker covers all of that with one array:

```tsx
// src/components/features/FilestackUploader.tsx
const client = await getFilestackClient();

const picker = client.picker({
  accept: ['.dwg', '.dxf', '.pdf', '.png', '.jpg', '.jpeg', '.rvt', '.skp', 'image/*', 'application/pdf'],
  maxFiles: maxFiles - files.length,
  fromSources: ['local_file_system', 'url', 'googledrive', 'dropbox'],
  onUploadDone: (res) => {
    res.filesUploaded.forEach((uploaded) => onFileUploaded(formatPickerMetadata(uploaded)));
    setIsUploading(false);
  },
  onCancel: () => setIsUploading(false),
});

await picker.open();
```

Two details worth copying:

**`maxFiles: maxFiles - files.length`** caps the picker against what has already been attached, so a user cannot exceed the limit by uploading in two batches. Small thing, easy to forget.

**The SDK is imported lazily,** because `filestack-js` touches `window` at import time and must never end up in a server render:

```ts
// src/services/filestack.service.ts
let clientPromise: Promise<Client> | null = null;

export function getFilestackClient(): Promise<Client> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Filestack client can only be initialized on client-side'));
  }
  clientPromise ??= import('filestack-js').then((mod) => mod.init(FILESTACK_API_KEY));
  return clientPromise;
}
```

The dynamic import keeps the SDK out of the server bundle and out of the initial client bundle. The module-level promise means every picker after the first reuses one client.

What comes back is trimmed to the only shape the app stores:

```ts
export interface IStoredFile {
  url: string;
  handle: string;
  filename: string;
  mimetype: string;
  size: number;
  uploadDate?: string;
}
```

That handle is the whole point. Everything below is built from it.

## Step 3: The viewer you do not build

The fastest way to put a document on screen is Filestack's hosted previewer. It is one path segment and an iframe:

```ts
// src/lib/filestack.ts
export function getFilestackPreviewUrl(handle: string): string {
  return `https://cdn.filestackcontent.com/preview/${handle}`;
}
```

```tsx
<iframe src={previewUrl} className="h-[460px] w-full rounded border-0" title={file.filename} />
```

That is the entire integration. `preview/<handle>` returns an HTML page, not an image, and it handles page navigation, scrolling and zoom for you. For PDFs and Office documents it replaces pdf.js, a worker bundle, and the afternoon you would spend wiring up a viewer component.

It is also the right default for a document nobody needs to manipulate. The estimator opening a 40-page structural set wants to read it, not process it.

## Step 4: The viewer you do build

The interactive preview is a black box. You cannot recolour it, you cannot chain it with other tasks, and you cannot drop its output into a report. So ApexCAD has a second mode, built entirely out of Processing API tasks, where the drawing becomes an image the app controls:

```ts
// src/lib/filestack.ts
export function getFilestackTransformedUrl(
  file: IStoredFile,
  options: { filter?: ViewFilterMode; rotate?: number; width?: number; page?: number } = {}
): string {
  const tasks: string[] = [];

  // PDF output conversion task
  if (isPdf(file.mimetype)) {
    const page = options.page ?? 1;
    tasks.push(`output=format:png,page:${page},density:150`);
  }

  // Rotation task
  if (options.rotate && options.rotate > 0) {
    tasks.push(`rotate=deg:${options.rotate}`);
  }

  // Filter effect task (monochrome/blueprint style)
  if (options.filter === 'blueprint') {
    tasks.push('monochrome');
  } else if (options.filter === 'grayscale') {
    tasks.push('blackwhite');
  } else if (options.filter === 'contrast') {
    tasks.push('enhance');
  }

  // Sizing task
  const width = options.width ?? 1600;
  tasks.push(`resize=width:${width},fit:max`);

  return cdnUrl(file.handle, tasks);
}
```

The result is a URL like:

```
https://cdn.filestackcontent.com/output=format:png,page:1,density:150/rotate=deg:90/monochrome/resize=width:1200,fit:max/<handle>
```

**Task order is not cosmetic.** Tasks apply left to right, so this chain rasterises the page first, then rotates the raster, then drops it to monochrome, then resizes last. Resizing before the filter would sample a smaller image and lose line detail, which on a drawing full of hairlines is the difference between readable and not. Putting `resize` at the end of the builder is a deliberate choice, not an accident of where the code happened to go.

The three filters map to three real tasks, all of which work on any raster the CDN can produce:

| UI label | Task | What it does |
| --- | --- | --- |
| Blueprint Blue | `monochrome` | Flattens to one channel, which is what makes the blueprint tint read cleanly |
| High-Contrast Gray | `blackwhite` | Thresholds to pure black and white, so faint pencil lines either survive or do not |
| Full Color | none | The raster as rendered |

`density:150` in the `output` task is the setting that matters most for drawings. It is the DPI the page is rasterised at. Too low and dimension text turns to mush; too high and you are shipping megabytes to draw a floor plan.

## Step 5: Thumbnails, from the same handle

The dashboard needs a visual for every submission, and nobody is going to upload a cover image for a floor plan. So the thumbnail is extracted from the drawing itself:

```ts
export function getFilestackThumbnailUrl(file: IStoredFile, size = 200): string {
  if (!file?.handle) return '/placeholder-blueprint.png';

  if (isPdf(file.mimetype)) {
    return cdnUrl(file.handle, [
      'output=format:png,page:1,density:72',
      `resize=width:${size},height:${size},fit:crop`,
    ]);
  }

  if (isImage(file.mimetype)) {
    return cdnUrl(file.handle, [`resize=width:${size},height:${size},fit:crop`]);
  }

  return cdnUrl(file.handle, [`resize=width:${size},height:${size},fit:crop`]);
}
```

Same handle, `density:72` instead of `150`, cropped square instead of `fit:max`. A PDF gets its first page rasterised; an image is just resized. One upload is now feeding a grid tile, a full-page render and an interactive viewer, and the app has stored exactly one string.

## Where the CDN ends and CSS begins

This is the part of the codebase most worth arguing about, and it gets the division right.

The blueprint view applies the Filestack `monochrome` task in the URL, and then applies CSS filters on top of the returned image:

```tsx
style={{
  filter: filterMode === 'blueprint'
    ? 'hue-rotate(180deg) invert(85%) contrast(120%)'
    : filterMode === 'grayscale'
    ? 'grayscale(100%) contrast(150%)'
    : 'none',
  transform: `scale(${zoomLevel / 100})`,
}}
```

It would be easy to read that as the CDN not pulling its weight. It is the opposite. **Every distinct task chain is a distinct render and a distinct cache entry.** So the split should fall along that line:

- **Send it to the CDN** when the work is expensive, needs the original bytes, or changes what is downloaded: rasterising a PDF page, converting format, dropping a channel, resizing the payload.
- **Keep it in CSS** when the work is free on the client and would otherwise multiply your cache surface: a hue rotation, a contrast bump, a preview zoom.

The blue in "blueprint blue" is a hue rotation over a monochrome raster. Doing the hue rotation server side would mean a separate cached render for a colour the GPU applies for nothing.

The zoom control in this app is the case where the line is drawn in the wrong place. It feeds `zoomLevel` into the URL width **and** applies a CSS `transform: scale()`:

```tsx
const transformedUrl = getFilestackTransformedUrl(file, {
  filter: filterMode,
  rotate: rotation,
  width: Math.min(2000, Math.round(1200 * (zoomLevel / 100))),
});
```

Seven zoom steps means seven separate renders of the same page, each cached separately, every time somebody leans on the zoom button. For a viewer, pick one: render once at a good width and let CSS do the zooming, or drop the CSS transform and treat the URL as the source of truth for a genuine high-resolution re-fetch. Doing both gets you the cost of the first and the blurriness of the second.

## A note on file formats

The picker in this demo accepts `.dwg`, `.dxf`, `.rvt` and `.skp` alongside PDFs and images, and the app has an `isCadOrDrawing()` helper that recognises them. Be careful about what that promises.

Every rendering path above branches on `isPdf()` or `isImage()`. A PDF gets the `output=format:png,page:N` treatment; an image gets resized. Native CAD formats have no branch of their own, and the sample file bundled with the demo is a raster, not a DWG.

So: the proven path is PDFs, which is also how drawings actually arrive most of the time, since a PDF export is what gets emailed to a client. If you need genuine DWG or RVT rendering, confirm it against your own account with your own file before you put it in a sales deck. Accepting an extension in a picker is not the same as rendering it.

## Beyond the quote portal

The same handle-plus-two-viewers pattern carries into most of the surrounding product:

| Surface | Filestack feature |
| --- | --- |
| Virus scanning drawings from contractor networks | `virus_detection` |
| Pulling drawing numbers and revisions off a title block | `ocr`, which returns per-word bounding boxes |
| Straightening a site drawing photographed on a phone | `doc_detection` |
| Rescuing an underexposed site photo | `enhance` |
| Scanning an old drawing that only exists at low resolution | `upscale` |
| Watermarking a drawing before it goes to a subcontractor | `watermark` |
| Running the whole chain automatically on upload | [Workflows](https://www.filestack.com/docs/workflows/) |

The OCR one is the most interesting for this vertical. Title blocks are structured, always in the same corner, and full of exactly the metadata an estimator retypes by hand.

## Production checklist

- **Remove the hardcoded API key fallback.** `src/lib/filestack.ts` currently falls back to a literal key when the environment variable is missing. That key is in source control and should be rotated and deleted.
- **Remove the silent upload fallback.** When the picker fails, the uploader injects a canned sample file and reports success. That is a useful demo prop and a dangerous production behaviour, because a failed upload becomes a quote request with somebody else's drawing attached to it.
- **Fix the double zoom**, per the section above. Pick the CDN or CSS, not both.
- **Move quotes out of `localStorage`** into a real database. The service class already isolates this, so it is a swap behind `QuoteService`, not a rewrite.
- **Replace the emulated login** with real auth, so a client cannot read another client's drawings.
- **Configure Security Policies**: origin lock, MIME allowlist, size cap. Keep the app secret server side and never prefix it with `NEXT_PUBLIC_`.
- **Add `virus_detection`** before an architect opens anything. Construction files come from many networks and are widely forwarded.

## Further reading

| Topic | Link |
| --- | --- |
| File Picker configuration and sources | [Pickers](https://www.filestack.com/docs/uploads/pickers/web/) |
| Every transformation task | [Processing API](https://www.filestack.com/docs/api/processing/) |
| Document preview and delivery | [Deliver files](https://www.filestack.com/products/deliver-files/) |
| OCR, virus scanning, enhancement | [Intelligence](https://www.filestack.com/docs/intelligence/) |
| Chaining processing on upload | [Workflows](https://www.filestack.com/docs/workflows/) |
| Security policies and signed URLs | [Security](https://www.filestack.com/docs/security/) |

## Final thoughts

The interesting decision in this app is not that it uses a CDN for images. It is that it serves one file two ways, and picks per context:

- `preview/<handle>` in an iframe when someone needs to **read** the document
- a chained task URL when the app needs to **control** how it looks

Most file-heavy products eventually need both, and reach for a viewer library for the first and a processing service for the second. Here they are the same handle with a different prefix.

The general shape holds well beyond construction: **store the handle, not the file, and treat every view as a URL you compose.** Once that is true, adding a rendering mode costs a function, not a service.

Try the live demo or grab the source on GitHub.
