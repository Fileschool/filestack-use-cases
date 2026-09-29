# Route the Post Automatically: envelope_ocr in a Digital Mailroom

Scanning the post is easy. Working out who each item belongs to is the job.

That is the part that stays manual in every mailroom, and the reason is structural. The address block sits in a different place on every envelope, in a different typeface, sometimes handwritten, sometimes behind a window. Run general OCR over it and you get back a wall of text containing a company name, a street, a postcode and a person, with nothing telling you which is which. You are now writing a parser, and the parser breaks on the next layout it meets.

This guide walks through **Redfern**, a virtual mailroom, and the task that removes the parser entirely.

## What we're building

Someone scans a batch of envelopes. Each one is read, matched to a person in the staff directory, and filed. Contents get flattened and indexed so a year of post is searchable. Anything that cannot be matched goes to a queue for a human, which is the only part a person touches.

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Upload, storage, CDN, processing | Filestack |
| Server state | TanStack Query |
| Client state | Zustand |
| Styling | Tailwind v4 |
| Language | TypeScript |

## Step 1: Keys, and why this one needs two

```bash
NEXT_PUBLIC_FILESTACK_API_KEY=your_api_key_here
FILESTACK_APP_SECRET=your_app_secret_here
```

Most Filestack demos need only the first. This one needs both, and the reason matters for how the app is built.

`envelope_ocr`, `ocr` and `doc_detection` **reject unsigned requests**. They need a policy signed with your app secret, which means they cannot be called from the browser the way `resize` or `enhance` can. The secret has to stay on the server.

## Step 2: Signing on the server

One API route holds the secret and hands back finished URLs:

```ts
// src/app/api/filestack/sign/route.ts
const policy = JSON.stringify({
  expiry: Math.floor(Date.now() / 1000) + TTL_SECONDS,
  call: ["read", "convert"],
  handle,
});

const encodedPolicy = Buffer.from(policy).toString("base64");
const signature = createHmac("sha256", secret).update(encodedPolicy).digest("hex");

const url = [CDN, `security=p:${encodedPolicy},s:${signature}`, ...tasks, handle].join("/");
```

A policy is base64 JSON. The signature is its HMAC-SHA256 under the secret. The security segment goes **in front of** the task chain.

Two decisions worth copying. The policy is scoped to a single `handle`, so a leaked URL is useless against any other file. And the route keeps an allowlist of tasks it is willing to sign:

```ts
const ALLOWED = /^(ocr|envelope_ocr|doc_detection(=[a-z_]+:(true|false)(,[a-z_]+:(true|false))*)?)$/;
```

Without that, you have built an open signing oracle: anyone can post any task chain and get it signed with your secret.

## Step 3: The task that does the work

```ts
const signed = await requestSignedUrl(file.handle, [signedTaskSegment({ task: 'envelope_ocr' })]);
const result = (await fetch(signed).then((r) => r.json())) as IEnvelopeOcrResult;
```

What comes back is not text. It is named fields:

```ts
export interface IEnvelopeOcrResult {
  sender?: string;
  recipient_name?: string;
  recipient_address?: string;
}
```

That is the whole difference. `recipient_name` is a property, so routing is a directory lookup:

```ts
function matchRecipient(name?: string) {
  if (!name) return null;
  const lower = name.toLowerCase();
  return (
    DIRECTORY.find((person) => lower.includes(person.name.toLowerCase())) ??
    DIRECTORY.find((person) =>
      person.name.split(' ').some((part) => part.length > 3 && lower.includes(part.toLowerCase()))
    ) ?? null
  );
}
```

The fallback to a surname match is deliberate. Envelopes carry initials, married names and misspellings, so an exact match on the full name fails more often than it should. Two passes, then a human queue.

## Step 4: Clean before you read

The contents get a different chain, because a photographed page reads far worse than a flat one:

```
doc_detection=coords:false,preprocess:true/ocr/<handle>
```

`doc_detection` finds the page inside the image, warps it flat and preprocesses it. With `coords:false` it returns the processed image, which `ocr` then reads. Order matters: deskewing after OCR would be pointless.

`ocr` returns text areas, lines and words with bounding boxes, plus a flat `text` field. For a search index you want the flat field. For anything a human has to verify, you want the boxes.

## Beyond the mailroom

| Surface | Task |
| --- | --- |
| Returned-mail and address correction | `envelope_ocr` |
| Cheque and remittance capture | `doc_detection`, `ocr` |
| Parcel label sorting | `ocr` |
| Screening inbound post for malware | `virus_detection` via Workflows |

## Production checklist

- Run the whole chain as a **Workflow** rather than three client calls, so a batch of 400 envelopes does not become 400 round trips from a browser.
- Keep the signing route's task allowlist tight, and keep the TTL short.
- `doc_detection` accepts images up to 2000x2000, so downscale before sending.
- Watch the cost shape: `ocr` includes 5,000 a month, `doc_detection` 1,000 and at a higher overage. Do not run `doc_detection` on envelopes you only need routed.
- Match against a real directory with an alias table, and keep the unmatched queue visible.

## Final thoughts

The interesting thing here is not that Filestack can read an envelope. It is that it gives the answer back **already labelled**. General OCR hands you a paragraph and leaves the hard part to you. `envelope_ocr` hands you three fields.

That is the difference between a routing feature you ship and a parser you maintain forever.
