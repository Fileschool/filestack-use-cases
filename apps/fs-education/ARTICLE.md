# Mark Up Student Work in the Browser: A Coursework Portal Built on Filestack

Marking is a drawing problem. A lecturer circles the line where the proof went wrong, boxes a wrong sign, writes "expand this" in the margin with an arrow to the paragraph it belongs to. A score out of 100 and a comment box do not replace that.

Doing it digitally is where it gets expensive. A student hands in a phone photo, a flatbed scan, or a 12-page PDF, and now you need to rasterise all three into something you can draw on. The usual answer is pdf.js in a web worker, a canvas renderer, a headless Chrome or Ghostscript job on the server, a bucket for the rendered pages, and a cache so you don't re-render page 4 every time somebody opens it. That's a rendering pipeline, and none of it is the feature.

This guide walks through **Fairmount College**, a two-sided coursework portal where students hand work in and lecturers mark it by drawing directly on the page. The rendering pipeline is one URL.

## What we're building

A lecturer sets an assignment — types the brief, attaches a worksheet, or both. Students on that lecturer's course see it, upload their work (photo, scan, PDF, doc), and hand in with an optional note. The lecturer opens a submission and gets the page rendered in a canvas editor: pen, highlighter, box, arrow and text tools, page navigation for multi-page PDFs, and a score-and-comments panel beside it. The student comes back to a score, written feedback, and their own pages with the lecturer's red pen on top.

The student's file is never modified. Not once, at any point.

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Actions) |
| Upload, storage, CDN, rendering | Filestack |
| Database | libSQL — local SQLite file in dev, Turso when hosted |
| Styling | Tailwind v4 |
| Language | TypeScript |

Logins are emulated: the sign-in screen lists a few people and picking one sets a cookie. There are no passwords, because this is a demo of the file workflow, not of authentication. Everything else is real.

Filestack covers uploads (straight from the browser, including from the student's Google Drive), storage, the CDN, page rendering, PDF introspection, and thumbnails. There is no image or document processing code in this repository.

## Step 1: Get your Filestack API key

Sign up at [filestack.com](https://www.filestack.com/), grab the key, drop it in `.env.local`:

```bash
NEXT_PUBLIC_FILESTACK_API_KEY=your_api_key_here
```

`NEXT_PUBLIC_` exposes it to the browser, which is required: uploads go from the student's machine to Filestack with no server hop, and the picker widget runs client-side. Lock it down in production with [Security Policies](https://www.filestack.com/docs/security/) — allowed origins, MIME types, size caps.

One helper earns its keep immediately:

```ts
// lib/filestack.ts
export const FILESTACK_API_KEY = process.env.NEXT_PUBLIC_FILESTACK_API_KEY ?? "";

export function hasFilestackKey(): boolean {
  return FILESTACK_API_KEY.length > 0;
}
```

The app degrades instead of exploding when the key is missing: the picker renders a "set your key" hint, and the marking editor still saves scores and comments — it just skips the drawing upload. Anyone who clones the repo gets a running app before they get an account.

## Step 2: Upload with the File Picker

The other apps in this repo talk to the Store API directly with a hand-rolled drop zone. This one uses the [File Picker](https://www.filestack.com/docs/uploads/pickers/web/) widget, on purpose.

Students are not uploading from a tidy `~/Downloads`. The essay is in Google Drive, the scan is in Dropbox, the photo is on a phone. The picker gets you those sources for the cost of one array:

```tsx
// components/file-picker.tsx
const client = await filestackClient();

const picker = client.picker({
  accept,
  maxFiles: 1,
  fromSources: [
    "local_file_system",
    "url",
    "googledrive",
    "dropbox",
    "onedrive",
  ],
  onUploadDone: (response: PickerResponse) => {
    const uploaded = response.filesUploaded[0];
    if (uploaded) {
      setFile(toStoredFile(uploaded));
      setRemoved(false);
    }
    setBusy(false);
  },
  onCancel: () => setBusy(false),
  onFileUploadFailed: () => {
    setError("That upload failed. Please try again.");
    setBusy(false);
  },
});

await picker.open();
```

Building OAuth against four cloud providers so a student can attach a file from Drive is a sprint. Here it's five strings.

### Loading the SDK without breaking SSR

`filestack-js` touches `window` at import time, so it can never be pulled into a server render. Lazy-import it and memoise the client:

```ts
// lib/filestack-client.ts
let clientPromise: Promise<Client> | null = null;

export function filestackClient(): Promise<Client> {
  clientPromise ??= import("filestack-js").then((mod) => mod.init(FILESTACK_API_KEY));
  return clientPromise;
}
```

The dynamic `import()` keeps the SDK out of the server bundle *and* out of the initial client bundle — it downloads the first time somebody actually opens a picker. The module-level promise means the second, third and tenth picker reuse one client.

## Step 3: Get the file into a Server Action, with no upload route

Here's the part that surprises people. The app has no `/api/upload`. It has no upload route at all. The bytes go browser → Filestack; the *metadata* rides in on the normal form post.

The picker writes its result into a hidden input:

```tsx
<input
  type="hidden"
  name={name}
  value={file && !removed ? JSON.stringify(file) : ""}
/>
```

Where a `StoredFile` is the entire footprint a file leaves on your data model:

```ts
// lib/types.ts
export type StoredFile = {
  url: string;
  handle: string;
  name: string;
  mimetype: string;
  size: number;
};
```

The Server Action reads it back:

```ts
// lib/stored-file.ts
export function parseStoredFile(value: FormDataEntryValue | null): StoredFile | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;

  try {
    const parsed = JSON.parse(value) as Partial<StoredFile>;
    if (!parsed.url || !parsed.handle) return null;
    return {
      url: parsed.url,
      handle: parsed.handle,
      name: parsed.name ?? "attachment",
      mimetype: parsed.mimetype ?? "application/octet-stream",
      size: Number(parsed.size ?? 0),
    };
  } catch {
    return null;
  }
}
```

...and the whole hand-in flow is one action with no multipart parsing, no streaming, no temp files:

```ts
// lib/actions/submissions.ts
export async function submitAssignment(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const student = await requireStudent();

  const assignmentId = String(formData.get("assignmentId") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  const file = parseStoredFile(formData.get("file"));

  const assignment = await getAssignment(assignmentId);
  if (!assignment || assignment.lecturerId !== student.lecturerId) {
    return { error: "That assignment is not on your course." };
  }
  if (!file) {
    return { error: "Choose a file to upload before handing in." };
  }
  // ...insert or update the submission row
}
```

Note what the size limit is: your form post carries about 200 bytes of JSON whether the student handed in a 40KB text file or a 90MB scan. Serverless request body limits stop being something you think about.

**One caveat worth taking seriously.** That hidden field is client-supplied, so a determined student could post a handle they made up. In production, validate it — check the URL against `^https://cdn\.filestackcontent\.com/`, and if it matters, verify the handle server-side before you trust the mimetype and size. The demo checks shape only.

## Step 4: Turn anything into a page you can draw on

This is the step that would otherwise be a rendering service.

Whatever the student handed in, the marking editor needs an `<img>`. Filestack's [Processing API](https://www.filestack.com/docs/api/processing/) does the conversion in the URL:

```ts
// lib/filestack.ts
const CDN = "https://cdn.filestackcontent.com";

/** `https://cdn.filestackcontent.com/<key>/<tasks>/<handle>` */
function cdnUrl(handle: string, tasks: string[] = []): string {
  const segments = [CDN];
  if (FILESTACK_API_KEY) segments.push(FILESTACK_API_KEY);
  segments.push(...tasks, handle);
  return segments.join("/");
}

/**
 * A raster image of the file, suitable for drawing on top of. PDFs are
 * rendered a page at a time by the `output` task; images are just resized.
 */
export function pageImageUrl(
  file: { handle: string; mimetype: string },
  page = 1,
): string {
  if (isPdf(file.mimetype)) {
    return cdnUrl(file.handle, [
      `output=format:png,page:${page},density:150`,
      "resize=width:1600,fit:max",
    ]);
  }
  return cdnUrl(file.handle, ["resize=width:1600,fit:max"]);
}
```

`output=format:png,page:3,density:150` is the whole PDF renderer. Page 3 comes back as a PNG at 150 DPI — enough to read handwriting and equations, chained straight into `resize=width:1600,fit:max` so the transfer stays sane. Filestack renders it on first request, caches it at the edge, and serves it from cache forever after, because a given handle's page 3 never changes.

Two details in `cdnUrl` worth calling out:

- **Tasks are path segments, applied left to right.** Adding a step is `tasks.push(...)`, not a new pipeline stage.
- **The API key sits in the path.** A bare handle works without it, but the key segment is what scopes the transform to your app — it's required once you enable security policies or process external URLs, and free to include from day one. Putting it in the URL builder means you never have to retrofit it across a codebase.

Everything downstream from the editor now works on one type: an image.

### Knowing how many pages there are

Multi-page marking needs a page count, and Filestack will tell you:

```ts
export async function getPdfPageCount(handle: string): Promise<number | null> {
  try {
    const response = await fetch(cdnUrl(handle, ["pdfinfo"]), {
      // Page counts never change for a given handle.
      cache: "force-cache",
    });
    if (!response.ok) return null;
    const info: unknown = await response.json();
    const pages = (info as { pages?: unknown })?.pages;
    return typeof pages === "number" && pages > 0 ? pages : null;
  } catch {
    return null;
  }
}
```

`pdfinfo` is a task like any other; it just returns JSON instead of an image. Two things make this function well-behaved:

- `cache: "force-cache"` — a handle's page count is immutable, so this should be fetched once per handle for the life of the universe.
- It returns `null` rather than throwing when document processing isn't enabled on the account. The editor treats `null` as "unknown length" and lets the lecturer page forward freely, showing a friendly message if a page comes back empty. A missing capability degrades one feature instead of taking down the page.

```tsx
// app/lecturer/submissions/[id]/page.tsx
const pageCount =
  file && isPdf(file.mimetype) ? await getPdfPageCount(file.handle) : 1;
```

## Step 5: Draw on it

The editor stacks a `<canvas>` on the rendered page:

```tsx
<div ref={stageRef} className="relative ...">
  <img
    ref={imageRef}
    key={`${file.handle}-${page}`}
    src={pageImageUrl(file, page)}
    onLoad={redraw}
    onError={() => setImageFailed(true)}
    className="block w-full"
  />

  <canvas
    ref={canvasRef}
    onPointerDown={handlePointerDown}
    onPointerMove={handlePointerMove}
    onPointerUp={handlePointerUp}
    onPointerLeave={handlePointerUp}
    className="absolute inset-0 h-full w-full touch-none"
  />
</div>
```

Three decisions here carry the whole feature:

**Pointer events, not mouse events.** One set of handlers covers mouse, trackpad, finger and stylus. A lecturer marking on an iPad with an Apple Pencil hits the same code path as one with a mouse. `touch-none` stops the browser from scrolling the page when they try to draw on it.

**Strokes are stored in normalised 0..1 coordinates.**

```ts
// lib/types.ts
export type Stroke = {
  tool: "pen" | "highlighter" | "rect" | "arrow" | "text";
  color: string;
  width: number;
  /** Normalised 0..1 coordinates so the overlay scales with the page. */
  points: { x: number; y: number }[];
  text?: string;
};
```

The page image is responsive — it's 1600px wide from the CDN but might render at 720px on a laptop and 1100px on a big monitor. Storing pixel coordinates would mean the circle drawn at 720px lands in the wrong place at 1100px, and lands somewhere else again on the exported PNG. Fractions of the page are resolution-independent, so the same stroke data is correct on the editor canvas, on the exported overlay, and in the student's view.

**The canvas is drawn at device pixel ratio.**

```ts
const rect = canvas.getBoundingClientRect();
const dpr = window.devicePixelRatio || 1;
canvas.width = Math.round(rect.width * dpr);
canvas.height = Math.round(rect.height * dpr);

ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
ctx.clearRect(0, 0, rect.width, rect.height);
```

Without this the pen looks blurry on every retina screen. With it, `drawStroke` still works in CSS pixels and the transform handles the rest. A `ResizeObserver` on the stage re-runs `redraw()` whenever layout changes, so rotating a tablet doesn't smear the annotations.

Stroke widths get the same normalisation treatment — they're stored relative to a reference width and scaled at draw time, so a 4px pen is 4px-looking at every render size:

```ts
/** Reference width the stored stroke widths are relative to. */
const BASE_WIDTH = 900;

const scale = width / BASE_WIDTH;
const lineWidth = Math.max(1, stroke.width * scale);
```

## Step 6: Save the drawing as a transparent PNG

Here's the pattern the whole app is built on. When the lecturer saves, the strokes are re-rendered onto an offscreen canvas at the *original file's* resolution, exported as a transparent PNG, and uploaded to Filestack as its own file:

```ts
// components/annotation-editor.tsx
/** Renders the current page's strokes onto a transparent PNG for Filestack. */
async function renderOverlay(): Promise<OverlayUpload> {
  if (strokes.length === 0) return null;
  if (!hasFilestackKey()) return null;

  const image = imageRef.current;
  const naturalWidth = image?.naturalWidth || 1200;
  const naturalHeight = image?.naturalHeight || 1600;
  const exportWidth = Math.min(naturalWidth, 2000);
  const exportHeight = Math.round(exportWidth * (naturalHeight / naturalWidth));

  const canvas = document.createElement("canvas");
  canvas.width = exportWidth;
  canvas.height = exportHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  for (const stroke of strokes) {
    drawStroke(ctx, stroke, exportWidth, exportHeight);
  }

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) return null;

  const uploaded = await uploadImageBlob(blob, `annotation-page-${page}.png`);
  return { url: uploaded.url, handle: uploaded.handle };
}
```

The export is deliberately *not* the on-screen canvas. It's re-rendered at up to 2000px so the marking is crisp when the student zooms in, regardless of how big the lecturer's browser window happened to be.

The upload is a `Blob`, not a file the user picked — no picker involved:

```ts
// lib/filestack-client.ts
/** Uploads a canvas export (the annotation overlay) straight to Filestack. */
export async function uploadImageBlob(blob: Blob, filename: string): Promise<StoredFile> {
  const client = await filestackClient();
  const file = new File([blob], filename, { type: blob.type || "image/png" });
  const result = await client.upload(file);

  return {
    url: result.url,
    handle: result.handle,
    name: result.filename ?? filename,
    mimetype: result.mimetype ?? "image/png",
    size: result.size ?? blob.size,
  };
}
```

`client.upload()` takes anything `File`-shaped. Generated images — canvas exports, cropped avatars, signature pads, chart snapshots, receipts rendered client-side — go up the same way a picked file does and come back with the same handle.

### The data model: two representations of one drawing

An annotation row stores both the rendered PNG *and* the raw strokes:

```sql
CREATE TABLE IF NOT EXISTS annotations (
  id             TEXT PRIMARY KEY,
  target_type    TEXT NOT NULL CHECK (target_type IN ('submission', 'assignment')),
  target_id      TEXT NOT NULL,
  page           INTEGER NOT NULL DEFAULT 1,
  overlay_url    TEXT,
  overlay_handle TEXT,
  strokes_json   TEXT NOT NULL DEFAULT '[]',
  updated_at     TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (target_type, target_id, page)
);
```

That duplication is the point:

- **The PNG** is what everyone else sees. Displaying marked work is one `<img>` from the CDN — no canvas, no JavaScript, no stroke replay. It works in an email, in a PDF export, on a slow phone.
- **The strokes** are what the editor reopens. A lecturer can come back a week later, undo one arrow, add a comment, and re-export. You cannot un-draw a PNG.

`UNIQUE (target_type, target_id, page)` makes saving an upsert, and `target_type` lets the same editor mark a student's submission *and* the lecturer's own copy of the assignment brief — a worked example for the class — with no second code path:

```ts
// lib/actions/marking.ts
async function upsertAnnotation(
  targetType: AnnotationTarget,
  targetId: string,
  page: number,
  overlay: OverlayUpload,
  strokes: Stroke[],
): Promise<void> {
  const client = await db();

  // An empty page is a cleared page: drop the row instead of storing nothing.
  if (strokes.length === 0 && !overlay) {
    await client.execute({
      sql: "DELETE FROM annotations WHERE target_type = ? AND target_id = ? AND page = ?",
      args: [targetType, targetId, page],
    });
    return;
  }

  await client.execute({
    sql: `INSERT INTO annotations
            (id, target_type, target_id, page, overlay_url, overlay_handle, strokes_json, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
          ON CONFLICT (target_type, target_id, page) DO UPDATE SET
            overlay_url    = excluded.overlay_url,
            overlay_handle = excluded.overlay_handle,
            strokes_json   = excluded.strokes_json,
            updated_at     = datetime('now')`,
    args: [newId("ann"), targetType, targetId, page, overlay?.url ?? null, overlay?.handle ?? null, JSON.stringify(strokes)],
  });
}
```

Paging is autosave: moving to the next page saves the current one first, and refuses to move if the save fails.

```ts
async function goToPage(next: number) {
  if (next < 1 || (pageCount && next > pageCount)) return;
  if (dirtyPages.has(page) && !(await savePage())) return;

  setImageFailed(false);
  setStatus("idle");
  setPage(next);
}
```

## Step 7: Give it back to the student

Both layers are Filestack URLs, so showing marked work is a server component with no client JavaScript at all:

```tsx
// components/annotated-pages.tsx
<div className="relative overflow-hidden rounded-xl border">
  <img
    src={pageImageUrl(file, annotation.page)}
    alt={`Page ${annotation.page}`}
    className="block w-full"
  />
  <img
    src={annotation.overlayUrl ?? ""}
    alt=""
    aria-hidden
    className="pointer-events-none absolute inset-0 h-full w-full"
  />
</div>
```

Base layer: the student's page, rendered on demand from their original handle. Top layer: the lecturer's transparent PNG. Both edge-cached, both immutable, stacked by CSS.

**Non-destructive is a feature, not an implementation detail.** The file the student handed in is byte-for-byte what they uploaded. If there's ever a dispute about a mark, the original is right there. The marking can be revised without touching it. And the same submission can carry different overlays for different reviewers — a second marker, a moderator, an external examiner — because an overlay is just another row.

## Step 8: One handle, every surface

The handle saved at hand-in time serves every view in the app through a different task chain:

| Surface | Task chain |
| --- | --- |
| Marking editor page | `output=format:png,page:N,density:150` → `resize=width:1600,fit:max` |
| Student's marked pages | same, plus the overlay PNG on top |
| List row / card thumbnail | `output=format:png,page:1,density:72` → `resize=width:S,height:S,fit:crop` |
| "View file" / download | `cache=expiry:max` |
| PDF page count | `pdfinfo` |

Thumbnails are the same helper with a lower density, and PDFs get one for free — a scanned worksheet shows its first page in the assignment list without any special handling:

```ts
export function thumbnailUrl(file: { handle: string; mimetype: string }, size = 160): string {
  if (isPdf(file.mimetype)) {
    return cdnUrl(file.handle, [
      "output=format:png,page:1,density:72",
      `resize=width:${size},height:${size},fit:crop`,
    ]);
  }
  return cdnUrl(file.handle, [`resize=width:${size},height:${size},fit:crop`]);
}
```

Requesting it at `size * 2` and rendering at `size` gives you a retina thumbnail in one line:

```tsx
<img src={thumbnailUrl(file, size * 2)} width={size} height={size} />
```

The type check that decides what's markable is equally boring, which is the goal:

```ts
export function isImage(mimetype: string | null | undefined): boolean {
  return Boolean(mimetype?.startsWith("image/"));
}

export function isPdf(mimetype: string | null | undefined): boolean {
  return mimetype === "application/pdf";
}

/** Only images and PDFs can be opened in the marking editor. */
export function isAnnotatable(mimetype: string | null | undefined): boolean {
  return isImage(mimetype) || isPdf(mimetype);
}
```

A `.docx` still uploads, still downloads, still gets marked — it just gets the plain score-and-comments form instead of the editor. Nothing is rejected; one feature is simply unavailable.

## Invalidation: when the student hands in again

Replacing a submission invalidates the marking, because the annotations describe a file that is no longer on record:

```ts
// lib/actions/submissions.ts
if (existing) {
  await client.execute({
    sql: `UPDATE submissions
          SET note = ?, file_url = ?, file_handle = ?, file_name = ?, file_mimetype = ?,
              file_size = ?, submitted_at = datetime('now'),
              score = NULL, feedback = '', graded_at = NULL, graded_by = NULL
          WHERE id = ?`,
    args: [note, file.url, file.handle, file.name, file.mimetype, file.size, existing.id],
  });
  await client.execute({
    sql: "DELETE FROM annotations WHERE target_type = 'submission' AND target_id = ?",
    args: [existing.id],
  });
}
```

The student is warned before they do it. This is the one place where decoupling data from files needs a deliberate decision: the *rows* go, but the old handles are still sitting in Filestack. That's fine for a demo and wrong for production — see the checklist.

## Beyond coursework

The same overlay pattern is most of a document-review product:

| Surface | Filestack feature |
| --- | --- |
| Flatten marked page into one downloadable image | Chain `watermark=file:<overlayHandle>` over the page URL |
| Contract redlining, design review, proofing | Same overlay table with a `reviewer_id` column |
| Signature capture | `canvas.toBlob()` → `client.upload()`, exactly as the overlay does |
| Auto-detect blank or upside-down scans | [Filestack Intelligence](https://www.filestack.com/docs/intelligence/) tagging |
| OCR a handwritten submission for search | Intelligence OCR on the same handle |
| Virus scanning student uploads | Intelligence `sfw` / virus detection, wired as a Workflow |
| Video coursework | [Video & Audio API](https://www.filestack.com/docs/api/video/) over the same CDN |

The first row is the interesting one: because the overlay is a Filestack file with its own handle, Filestack can composite the two server-side and hand you a single flat image for printing or archiving. The layers stay separate in your database and get merged only at the point of delivery.

## Production checklist

- [ ] Point `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` at a real database (the local file-backed libSQL fallback is dev-only, and the query code doesn't change)
- [ ] Replace the emulated cookie sign-in with real authentication — the ownership checks (`assignment.lecturerId !== lecturer.id`) are already in every action, they just need a trustworthy identity
- [ ] Validate the picker's hidden field server-side: check the CDN URL prefix, and verify the handle if mimetype and size matter to you
- [ ] Configure [Security Policies](https://www.filestack.com/docs/security/) — origin lock, `image/*` + `application/pdf`, a size cap. Keep `FILESTACK_APP_SECRET` server-side and never prefix it with `NEXT_PUBLIC_`
- [ ] Delete orphaned handles when a submission is replaced or an assignment's attachment is removed
- [ ] Add virus scanning on upload via Intelligence or a Workflow before a lecturer ever opens a file
- [ ] Confirm document processing is enabled on your Filestack plan — `pdfinfo` and `output=format:png` are what make multi-page marking work

## Further reading

| Topic | Link |
| --- | --- |
| File Picker (sources, config, callbacks) | [Pickers](https://www.filestack.com/docs/uploads/pickers/web/) |
| All transformations, including `output` and `pdfinfo` | [Processing API](https://www.filestack.com/docs/api/processing/) |
| Document rendering and conversion | [Document Transformations](https://www.filestack.com/docs/api/processing/#document-transformations) |
| JavaScript SDK (`init`, `upload`, `picker`) | [SDKs](https://www.filestack.com/docs/sdks/) |
| Security policies and signed URLs | [Security](https://www.filestack.com/docs/security/) |
| OCR, tagging, moderation, virus scanning | [Intelligence](https://www.filestack.com/docs/intelligence/) |
| Chained processing on upload | [Workflows](https://www.filestack.com/docs/workflows/) |

## Final thoughts

The feature here — mark a student's work with a red pen, in the browser, without destroying the original — sounds like it needs a document pipeline. It needed three URL patterns:

- `output=format:png,page:N,density:150` turns any submission into an image
- `pdfinfo` says how many of those there are
- `client.upload(blob)` puts the drawing back as its own file

Everything else is a `<canvas>` over an `<img>` and a table with a page number in it.

The general shape is worth stealing even if you never build a coursework portal: **store handles, not files; render views as URLs; keep derived artefacts as separate handles instead of mutating the source.** You get non-destructive editing, revision history, and multiple reviewers for free, because you never had one canonical mutated file to fight over in the first place.

Try the live demo at [your-demo-url] or grab the source on GitHub.
