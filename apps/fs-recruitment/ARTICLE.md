# Scan Before You Open: Virus Detection with Filestack Workflows

A recruitment pipeline is a stream of documents from strangers, opened by non-technical staff, on machines with access to personal data.

It is one of the softest targets in any company, and the attack is old and boring: attach something to a plausible application and wait for someone to double-click it.

This guide walks through **Hollis**, an applicant tracker, and the architectural point behind it: **virus detection is not a URL task, and that changes how you build.**

## What we're building

A candidate uploads a CV. The attachment stays locked until it has been screened. Once it clears, a recruiter reads it in an embedded preview that never downloads the file, and the text is extracted so the pipeline is searchable.

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Upload, storage, CDN, processing | Filestack |
| Server state | TanStack Query |
| Client state | Zustand |
| Styling | Tailwind v4 |
| Language | TypeScript |

## Step 1: The thing to understand first

Most Filestack tasks are synchronous. You build a URL, you get a result.

`virus_detection` is not one of them. From the docs: *"This task is only available at Filestack Workflows."* It runs **after the file lands in storage**, asynchronously, and the verdict arrives by webhook.

That is not a limitation, it is the correct shape. Scanning is slow and the answer must be authoritative before anyone opens the file. You cannot make that a synchronous fetch from a browser.

It does mean the integration is different:

| | URL task | Workflows task |
| --- | --- | --- |
| Triggered by | Building a URL | A file landing in storage |
| Result arrives | In the response | At a webhook |
| Configured in | Your code | The Filestack dashboard |
| Examples | `ocr`, `enhance`, `resize` | `virus_detection` |

## Step 2: Receiving the verdict

```ts
// src/app/api/filestack/virus-webhook/route.ts
const verdict =
  body.data ??
  Object.values(body.results ?? {}).find((entry) => entry.data)?.data;

if (!body.handle || !verdict) {
  return NextResponse.json({ error: 'Expected a handle and a verdict' }, { status: 400 });
}

verdicts.set(body.handle, verdict);
```

The shape is:

```json
{ "data": { "infected": false, "infections_list": [] } }
```

Workflows nests task output under the task name you chose in the dashboard, so the route accepts both the flat shape and the per-task shape. That single line saves an afternoon when your task name and your parser disagree.

## Step 3: Locking the UI until it answers

The verdict is the gate:

```tsx
const locked = scan === 'pending' || scan === 'infected';

{locked ? (
  <div>…the preview stays locked until virus detection reports back…</div>
) : (
  <iframe src={previewUrl(file.handle)} className="h-[460px] w-full border-0" />
)}
```

**Default to locked.** An attachment whose scan has not returned is not "probably fine", it is unknown, and the whole point is that nobody opens an unknown file. The demo degrades to an explicit "no workflow configured" state rather than silently unlocking.

## Step 4: Read it without downloading it

```ts
export function previewUrl(handle: string): string {
  return `${CDN}/preview/${handle}`;
}
```

One iframe. No pdf.js, no viewer library, and the CV is never written to the recruiter's disk. For a document from a stranger, rendering server side and shipping pixels is a meaningfully smaller attack surface than handing the bytes to a desktop application.

`ocr` then makes the pipeline searchable, including for CVs that arrive as scans, which is the case a text-extraction library silently fails on.

## Beyond recruitment

| Surface | Task |
| --- | --- |
| Support ticket attachments | `virus_detection` |
| Client document intake | `virus_detection`, `preview` |
| Vendor onboarding paperwork | `virus_detection`, `ocr` |
| Marketplace seller uploads | `virus_detection` |

## Production checklist

- Create the workflow in the dashboard, add the Intelligence virus detection task, and point its webhook at your route.
- **Verify the webhook signature.** The route here trusts its caller, which is fine for a demo and not for production.
- Replace the in-memory verdict map with a column on the attachment. A restart currently forgets every verdict.
- Decide the policy for `infected: true`: quarantine, delete, and who gets told.
- Handle the scan never returning. A verdict that never arrives should page someone, not lock a recruiter out silently.
- `ocr` needs a signed policy, so keep `FILESTACK_APP_SECRET` server side.

## Final thoughts

The useful lesson here is not about recruitment. It is that **Filestack has two shapes of capability**, and picking the wrong one is the most common integration mistake.

Anything that transforms bytes is a URL. Anything that needs to be authoritative before a human acts is a Workflow, and Workflows are asynchronous, which means a webhook, a stored verdict, and a UI that defaults to locked.
