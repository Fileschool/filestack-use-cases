# Enhanced for Reading, Original for Evidence: Claim Intake Built on Filestack

A claim arrives as a pile of mixed files from someone having a bad week.

Photographs of a flooded kitchen taken at night. A phone picture of the policy schedule, at an angle, on a worktop. A PDF from a builder. Every file needs something different before an assessor can use it, and the assessor still needs the untouched original in case the claim is ever disputed.

Building that yourself is an image pipeline and a document pipeline: a service to brighten photos without overwriting them, a page detector and an OCR engine for the paperwork, storage for both the originals and the derived copies, and a cache so the assessor's desk does not reprocess a photo every time it loads. None of that is assessing claims.

This guide walks through **Ardmore Mutual**, a claims portal with a working assessment desk, and the thing worth stealing from it: **the assessor sees a corrected photo and the original from the same handle, and the member's policy number is read off their schedule before they have to type it.**

## What we're building

A member reports a claim: what happened, when, a rough value, and whatever photographs and paperwork they have. If one of the files is their policy schedule, the policy number is read off it and filled in for them. The claim lands on an assessment desk, where an assessor sees the photographs brightened, the paperwork with its extracted text, a link to every original, and a form to record a decision.

## Stack

| Layer                            | Tech                         |
| -------------------------------- | ---------------------------- |
| Framework                        | Next.js 16 (App Router)      |
| Mutations                        | Server Actions               |
| Database                         | libSQL locally, Turso hosted |
| Upload, storage, CDN, processing | Filestack                    |
| Styling                          | Tailwind v4                  |
| Language                         | TypeScript                   |

Unlike most demos in this series, this one has a real database. Claims, members, assessors and files are rows in libSQL, migrated and seeded on first run, and the same code talks to a local file or to Turso depending on one environment variable. Assessor sign-in is emulated with a cookie that holds an assessor's id. Members do not sign in; a claim is matched to a member by policy number.

## Step 1: Keys and a database

```bash
NEXT_PUBLIC_FILESTACK_API_KEY=your_api_key_here
FILESTACK_APP_SECRET=your_app_secret_here

# Optional. Without these the app uses file:.data/ardmore.db
TURSO_DATABASE_URL=libsql://…
TURSO_AUTH_TOKEN=…
```

The public key is for uploads, which go from the member's phone straight to Filestack. The secret signs `doc_detection` and `ocr` requests, which Filestack rejects unsigned. It never carries a `NEXT_PUBLIC_` prefix.

The database client is worth a look, because it is the pattern you want for any Next.js app on libSQL:

```ts
// src/lib/db.ts
export function db(): Promise<Client> {
  if (!cache.__ardmoreReady) {
    cache.__ardmoreClient ??= connect();
    cache.__ardmoreReady = migrate(cache.__ardmoreClient).catch((error) => {
      // Let the next request retry instead of caching a failed migration.
      cache.__ardmoreReady = undefined;
      throw error;
    });
  }
  return cache.__ardmoreReady;
}
```

One connection and one migration per process, kept on `globalThis` so the dev server's hot reload does not open a new connection on every edit. A failed migration is not cached, so the next request retries.

## Step 2: Upload, then read the paperwork

The member attaches up to six photos or PDFs through the shared picker helper used across this series. As each file arrives, the form decides whether it is paperwork, and if so reads it:

```ts
// src/components/features/ReportClaimForm.tsx
if (!isImage(file.mimetype) || /schedule|policy|invoice|letter|receipt/i.test(file.filename)) {
  const signed = await requestSignedUrl(file.handle, [
    signedTaskSegment({ task: 'doc_detection', coords: false, preprocess: true }),
    signedTaskSegment({ task: 'ocr' }),
  ]);
  const response = await fetch(signed);
  if (response.ok) {
    const result = (await response.json()) as IOcrResult;
    extractedText = result.text;
    extractedReference = result.text ? findPolicyNumber(result.text) : undefined;
    if (extractedReference) setPolicyNumber((current) => current || extractedReference!);
  }
}
```

The chain is one signed URL:

```
security=p:…,s:…/doc_detection=coords:false,preprocess:true/ocr/<handle>
```

`doc_detection` finds the page in the photograph and warps it flat. With `coords:false` it returns the flattened image, which `ocr` reads in the same request. The cleaned image goes straight into the reader without a round trip.

The policy number is then a pattern match on known formats:

```ts
function findPolicyNumber(text: string): string | undefined {
  return text.match(/AM-\d{4}-\d{2}/i)?.[0]?.toUpperCase();
}
```

Matching the insurer's own format, rather than anything that looks like a reference, is the right call. It cannot pick up a builder's invoice number by mistake. And `current || extractedReference` means a number the member has already typed is never overwritten.

## Step 3: Signing on the server

`requestSignedUrl` posts to the same signing route used across this series:

```ts
// src/app/api/filestack/sign/route.ts
const policy = JSON.stringify({
  expiry: Math.floor(Date.now() / 1000) + TTL_SECONDS,
  call: ['read', 'convert'],
  handle,
});
const signature = createHmac('sha256', secret).update(Buffer.from(policy).toString('base64')).digest('hex');
```

The policy is scoped to one handle and expires in ten minutes, and the route only signs tasks on its allowlist. Without that allowlist it would sign any chain anyone posted.

## Step 4: Two views of every photograph

On the assessment desk, each damage photo is served brightened:

```tsx
// src/app/admin/claims/[id]/page.tsx
<img
  src={cdnUrl(file.handle, ['enhance=preset:fix_dark', 'resize=width:900,fit:max', 'output=format:webp'])}
  alt={file.filename}
/>
<a href={downloadUrl(file)} target="_blank" rel="noreferrer">Original</a>
```

`enhance=preset:fix_dark` is the preset for photos taken indoors or at night, which is most photos of a burst pipe. `enhance` answers an unsigned request, so this is a plain URL with no server involved.

The design decision worth copying is the second line. **The enhanced photo is a view, not a replacement.** Nothing is overwritten: the stored file is exactly what the member uploaded, and the brightened version exists only as a URL. The assessor reads the corrected one and can always reach the original.

## Where enhancement ends and evidence begins

That split matters more in insurance than almost anywhere else, so it is worth being precise about.

A claim can end up in front of a loss adjuster, an ombudsman or a court. At that point the question is not "can you see the damage?" but "is this what the member sent?" An app that brightened photos at upload and kept only the brightened copy would have altered its own evidence.

So the line falls like this:

- **Use the CDN for anything a human looks at.** Brightening, resizing, WebP conversion. These are derived views, cached at the edge, and free to change.
- **Keep the handle pointing at the original, always.** Store the handle, never a transformed URL, and never replace the stored file with a processed one.
- **Record what you showed.** If an assessor's decision rested on the enhanced view, the chain that produced it (`enhance=preset:fix_dark`) is part of the record.

Filestack makes this cheap because the transformation lives in the URL. There is no second file to store, and no question about which copy is the real one.

## The trust boundary in the form

This is the part of the codebase most worth arguing about.

The OCR runs in the member's browser. Its output then reaches the server as a hidden form field:

```tsx
<input type="hidden" name="files" value={JSON.stringify(files)} />
```

And the server action writes whatever it receives:

```ts
// src/lib/actions/claims.ts
await client.execute({
  sql: `INSERT INTO claim_files (… extracted_text, extracted_reference, processed, scan_result)
        VALUES (…, ?, ?, 1, 'clean')`,
  args: [/* … */ file.extractedText ?? '', file.extractedReference ?? ''],
});
```

Two problems sit in those few lines.

**The desk trusts the member's browser.** The assessor's page labels the extracted policy number "read from this document, not typed by anyone". But anyone can edit a hidden field. A member can submit any text and any reference as "what OCR found", and attach any handle they know. Extraction that happens in the browser is a convenience for filling in the form. It is not evidence. The server action has everything it needs to do it properly: it holds the handles and it can sign. Re-run the OCR there, store that result, and only show the "read from the document" label for text the server read.

**`scan_result` is hard-coded to `'clean'`.** The schema gets this right: the column defaults to `'pending'`. The insert overrides it, and the assessor's page then shows "Screened on arrival" with a shield icon next to every document. Nothing in this app scans anything. A claims inbox takes files from the public, so it should scan them, and the pattern is the one in the recruitment demo in this series: a Workflow with `virus_detection`, a webhook that writes the verdict to this column, and a desk that will not render a file until the verdict says clean. Until then, leave the column `'pending'` and say so on screen.

## Smaller things that will bite

- **Silent read failures.** `readFailed` is only set when `fetch` throws. A `400` or `403` from the CDN, which is what a missing secret produces, skips the `if (response.ok)` block and leaves the member with no policy number and no message. Treat a non-`ok` response as a failure.
- **Sorting by filename.** A photo is treated as paperwork only if its name contains "schedule", "policy", "invoice", "letter" or "receipt". Phone cameras name files `IMG_4471.jpg`, so a photographed schedule is filed as a damage photo and never read. Run the read on every image and decide afterwards based on the result, or let the member tag files.
- **PDFs in image chains.** `doc_detection` works on photographs. For a PDF, rasterise the page first with `output=format:png,page:1` or skip straight to `ocr`. The same applies to the desk's paperwork thumbnail, which `resize`s the PDF directly. The app's own `thumbnailUrl` helper rasterises page 1 first, so use it.
- **Racing references.** `nextReference()` counts the existing rows and adds one. Two claims reported in the same moment get the same reference, and the `UNIQUE` constraint turns the second into an unhandled error. Let the database generate the sequence.
- **A promise the app does not keep.** After a decision is recorded, the desk says "The member has been notified." Nothing notifies anyone.

## Beyond insurance

| Surface                                   | Filestack feature                         |
| ----------------------------------------- | ----------------------------------------- |
| Loan and mortgage document intake         | `doc_detection`, `ocr`                    |
| Warranty and returns claims               | `enhance`, `ocr` on the receipt           |
| Patient intake forms                      | `doc_detection`, `ocr`                    |
| Field inspection and survey photos        | `enhance`, original kept for the record   |
| Screening every inbound file              | `virus_detection` in a Workflow           |
| Running the chain once, on upload         | [Workflows](https://www.filestack.com/docs/workflows/) |

## Production checklist

- **Read on the server.** Re-run `doc_detection` and `ocr` in the server action, and only label text as "read from the document" if the server read it.
- **Stop hard-coding `scan_result`.** Leave it `'pending'`, add `virus_detection` in a Workflow, and have its webhook update the column.
- **Validate handles** against the upload session, so a member cannot attach someone else's file.
- **Treat non-`ok` responses as failures** and tell the member to type the number.
- **Classify by content, not filename.**
- **Rasterise PDFs** before `doc_detection` and before thumbnails.
- **Generate references in the database.**
- **Keep the original untouched**, and record which enhancement chain an assessor was shown.
- **Replace the emulated assessor login** with real auth, and only say "notified" when something was sent.
- **Configure Security Policies**: origin lock, `image/*` and PDF only, a size cap.

## Further reading

| Topic                                  | Link                                                                        |
| -------------------------------------- | --------------------------------------------------------------------------- |
| File Picker configuration and sources  | [Pickers](https://www.filestack.com/docs/uploads/pickers/web/)               |
| Every transformation task              | [Processing API](https://www.filestack.com/docs/api/processing/)             |
| `enhance`, `ocr`, `doc_detection`, `virus_detection` | [Intelligence](https://www.filestack.com/docs/transformations/intelligence/) |
| Policies and signatures                | [Security](https://www.filestack.com/docs/security/)                         |
| Chaining processing on upload          | [Workflows](https://www.filestack.com/docs/workflows/)                       |

## Final thoughts

The interesting decision in this app is not that it brightens photos or reads paperwork. It is that it does both **without ever changing the file**:

- the corrected photo is a URL over the original
- the extracted text sits next to the original, not in place of it

That is the right shape for any product where a file might later be evidence. The work left is making sure everything the assessor is told about a file, what was read, what was scanned, what was enhanced, was established on the server and recorded there.

The general shape holds well beyond claims: **transform for the reader, store for the record, and never let the two become the same file.**

Try the live demo or grab the source on GitHub.
