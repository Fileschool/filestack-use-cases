# The Pipeline Is the Product: Chaining Filestack Tasks for Claim Intake

A claim arrives as a pile of mixed files from a stranger having a bad day.

Photos of a flooded kitchen taken in the dark. A phone snap of a policy schedule, at an angle, on a worktop. A PDF from a garage. Every file needs something different, and doing it by hand is where claims stall.

This guide walks through **Ardmore Mutual**, and the one demo in this series where the interesting part is not any single task. It is **the chain**.

## What we're building

A policyholder uploads everything at once. One upload triggers a sequence: screen the file, clean it if it is paperwork, read it, correct it if it is a photo. The adjuster opens a claim that already has its policy number extracted and its photos legible.

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Upload, storage, CDN, processing | Filestack |
| Server state | TanStack Query |
| Client state | Zustand |
| Styling | Tailwind v4 |
| Language | TypeScript |

## Step 1: The chain, and why order is the design

```
1. virus_detection    Workflows    screen before anything else touches it
2. doc_detection      signed URL   flatten photographed paperwork
3. ocr                signed URL   pull the policy and claim numbers
4. enhance            unsigned     correct damage photos taken in bad light
```

Three properties of that list matter more than any individual task.

**Scanning goes first and gates everything.** No other step should touch a file that has not been screened. That is the whole reason the chain has an order rather than being four parallel calls.

**The middle two are ordered by accuracy.** `ocr` on a photographed page reads badly. `doc_detection` warps it flat first, so the reader gets something closer to a scan. Running them the other way round would work and return worse results, which is the dangerous kind of wrong.

**They do not all have the same shape.** `virus_detection` is a Workflows task and arrives by webhook. `doc_detection` and `ocr` need a signed policy. `enhance` answers an unsigned request. One chain, three integration styles.

## Step 2: Branching on file type

A damage photo and a policy schedule should not take the same path:

```ts
function planFor(file: IStoredFile): Step[] {
  const photo = isImage(file.mimetype);
  return [
    { key: 'scan',  task: 'virus_detection', state: 'waiting' },
    { key: 'clean', task: 'doc_detection',   state: photo ? 'skipped' : 'waiting' },
    { key: 'read',  task: 'ocr',             state: photo ? 'skipped' : 'waiting' },
    { key: 'fix',   task: 'enhance=preset:fix_dark', state: photo ? 'waiting' : 'skipped' },
  ];
}
```

Rendering the skipped steps rather than hiding them is a deliberate choice. In a demo it shows the branch. In production the same idea gives an adjuster an audit trail: not just what ran, but what was considered and why it did not apply.

## Step 3: Making the pipeline visible

The UI is a list of steps with state, which sounds trivial and is the most useful part of the app:

```tsx
patch('read', { state: 'running' });
try {
  const signed = await requestSignedUrl(uploaded.handle, [
    signedTaskSegment({ task: 'doc_detection', coords: false, preprocess: true }),
    signedTaskSegment({ task: 'ocr' }),
  ]);
  const result = await fetch(signed).then((r) => r.json()) as IOcrResult;
  const policy = result.text?.match(/\b(?:policy|claim)\s*(?:no|number|ref)?\.?[:\s]*([A-Z0-9-]{5,})/i);
  patch('read', { state: 'done', detail: policy ? `Found reference ${policy[1]}` : 'Text extracted' });
} catch (err) {
  patch('read', { state: 'failed', detail: err instanceof Error ? err.message : 'ocr failed' });
}
```

Note that `doc_detection` and `ocr` go up as **one signed URL**, not two calls. Tasks chain, so the cleaned image is piped straight into the reader without a round trip.

Failure is a state, not an exception. A chain where step three can fail while one, two and four succeed needs per-step status or you get "something went wrong" and no idea which something.

## Step 4: Where this really belongs

The demo runs the chain from the client so you can watch it. In production it belongs in a **Workflow**:

- It survives the browser closing, which matters when a policyholder uploads six photos on a phone and walks away.
- Retries are Filestack's problem.
- `virus_detection` only runs there anyway.
- The client stops needing to know the order, which means the order can change without shipping frontend code.

The client-side version is a good way to see the chain and the wrong way to run it.

## Beyond insurance

| Surface | Chain |
| --- | --- |
| Loan and mortgage applications | scan, clean, read, verify |
| Patient intake forms | scan, clean, read |
| Vendor onboarding | scan, read, route |
| Field inspection reports | scan, correct, compile |

## Production checklist

- Move the chain into a Workflow and keep the UI as a status view over stored state.
- Store per-step outcomes so an adjuster can see what ran.
- Replace the policy-number regex with a real parser, and keep the OCR bounding boxes so a human can verify.
- Mind the cost shape: `doc_detection` is the expensive one and should not run on photos.
- Decide the policy for an infected file before you need it.

## Final thoughts

Most integrations treat file processing as a set of independent features. Claim intake is the case where that breaks down, because the value is in the **sequence**: screened before touched, flattened before read, corrected before judged.

Filestack lets that sequence be a URL and a Workflow rather than a queue, a worker pool and retry logic. The pipeline stops being infrastructure you own and becomes a list you can read.
