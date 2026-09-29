# Show Your Working: OCR Bounding Boxes in an Expense App

Most receipt scanners hand you a number and ask you to trust it.

That works until the number is wrong, and on a creased thermal receipt photographed in a restaurant it sometimes is. Now a reviewer has a figure they doubt and no way to check it without opening the original and hunting for the total by eye. The extraction saved nobody any time.

This guide walks through **Marlow**, an expense capture app, and the detail that fixes it: **Filestack's `ocr` returns a bounding box for every word**, so the app can draw the extracted figure back onto the photo.

## What we're building

Someone photographs a receipt at any angle in any light. The page is found and flattened, the colour is corrected, the text is read, and every word is outlined on the image where it was found. Checking a total becomes a glance.

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Upload, storage, CDN, processing | Filestack |
| Server state | TanStack Query |
| Client state | Zustand |
| Styling | Tailwind v4 |
| Language | TypeScript |

## Step 1: Three tasks, one URL

```
doc_detection=coords:false,preprocess:true/enhance=preset:fix_dark/ocr/<handle>
```

Tasks run left to right and the order is the design:

1. **`doc_detection`** finds the receipt inside the photo and warps it flat, removing the table, the shadow and the thumb holding it down. With `coords:false` it returns the processed image rather than coordinates.
2. **`enhance=preset:fix_dark`** corrects the colour. `fix_dark` is the right preset for receipts shot indoors; `fix_tint` handles a colour cast.
3. **`ocr`** reads the result.

Running `ocr` first would read a crooked, dim photograph. Each step exists to make the next one more accurate.

## Step 2: The security split

`enhance` answers an unsigned request. `doc_detection` and `ocr` do not. So the app builds the cleaned preview in the browser:

```ts
const cleanedTasks = ['doc_detection=coords:false,preprocess:true', 'enhance=preset:fix_dark'];
const cleanedUrl = cdnUrl(file.handle, cleanedTasks);
```

...and asks the server for the reading URL:

```ts
const signed = await requestSignedUrl(uploaded.handle, [
  signedTaskSegment({ task: 'doc_detection', coords: false, preprocess: true }),
  signedTaskSegment({ task: 'ocr' }),
]);
const result = (await fetch(signed).then((r) => r.json())) as IOcrResult;
```

Knowing which tasks need a signature is the difference between an app that works and one that returns 400s in production.

## Step 3: Drawing the boxes

The response nests: `document.text_areas[].lines[].words[]`, each word carrying a bounding box, plus a flat `text` field and `text_area_percentage`.

Normalise defensively rather than trusting one field layout:

```ts
if (Array.isArray(raw) && raw.length >= 2) {
  const pts = raw as { x: number; y: number }[];
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  x = Math.min(...xs); y = Math.min(...ys);
  w = Math.max(...xs) - x; h = Math.max(...ys) - y;
} else if (typeof raw === 'object') {
  const b = raw as { x?: number; y?: number; width?: number; height?: number };
  x = b.x; y = b.y; w = b.width; h = b.height;
}
```

Then convert to fractions of the image, so the overlay survives any render size:

```ts
const norm = x <= 1 && y <= 1 && w <= 1 && h <= 1;
boxes.push({ text: word.text ?? '', x: norm ? x : x / imgW, y: norm ? y : y / imgH, ... });
```

**The boxes belong to the processed image, not the original.** They come from OCR that ran after `doc_detection`, so they must be drawn over the same chain's output. Overlay them on the raw upload and every box lands in the wrong place.

## Step 4: A total you can point at

```ts
function guessTotal(text: string): string | null {
  const matches = [...text.matchAll(/(?:total|amount due|balance)\D{0,12}([\d.,]+)/gi)];
  const last = matches.at(-1);
  if (last) return last[1];
  const money = [...text.matchAll(/\d+[.,]\d{2}/g)].map((m) => m[0]);
  return money.length > 0 ? money.sort(...)[0] : null;
}
```

Taking the **last** match is deliberate: receipts print subtotal, tax and total in that order, and the one you want is at the bottom.

This is a heuristic and should be treated as one. It is honest here because the box is drawn on the image, so a wrong guess is visibly wrong rather than silently wrong.

## Beyond expenses

| Surface | Task |
| --- | --- |
| Invoice and PO capture | `doc_detection`, `ocr` |
| ID and proof-of-address onboarding | `doc_detection`, `ocr` |
| Delivery notes and proof of delivery | `ocr` |
| Screening inbound uploads | `virus_detection` via Workflows |

## Production checklist

- Move the chain into a **Workflow** so one upload triggers everything server side.
- `doc_detection` accepts up to 2000x2000. Downscale first.
- Mind the cost shape: `ocr` includes 5,000 a month, `doc_detection` 1,000 at a notably higher overage.
- Keep the signing route's allowlist tight and the TTL short.
- Replace `guessTotal` with a real parser, and keep the boxes either way.

## Final thoughts

Extraction is not the hard part any more. **Trust** is.

A number in a field is a claim. A number with a box drawn around where it came from is evidence. Filestack gives you the second for the same call as the first, and most integrations throw the boxes away.
