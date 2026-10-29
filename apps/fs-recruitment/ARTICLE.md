# Scan Before You Open: Virus Detection in an Applicant Tracker Built on Filestack

A recruitment pipeline is a stream of documents from strangers, opened by non-technical staff, on machines with access to personal data.

It is one of the softest targets in any company, and the attack is old and boring: attach something to a plausible application and wait for someone to double-click it.

Building the defence yourself means a malware scanner you keep updated, a quarantine bucket, a queue that holds each upload until the scan finishes, and a document viewer so recruiters never download the file in the first place. That is a security product, and you were trying to build a hiring tool.

This guide walks through **Hollis**, an applicant tracker, and the thing worth stealing from it: **virus detection is not a URL task. It runs in a Workflow and answers by webhook, and that changes how you build the UI around it.** It also walks through why the demo's lock fails open, because that is the mistake this pattern most often ships with.

## What we're building

A candidate uploads a CV. The attachment stays locked until it has been scanned. Once it clears, a recruiter reads it in an embedded preview that never puts the file on their disk, and can extract the text with OCR so the pipeline is searchable.

## Stack

| Layer                            | Tech                    |
| -------------------------------- | ----------------------- |
| Framework                        | Next.js 16 (App Router) |
| Upload, storage, CDN, processing | Filestack               |
| Malware scanning                 | Filestack Workflows     |
| Client state                     | Zustand                 |
| Styling                          | Tailwind v4             |
| Language                         | TypeScript              |

Applications live in a persisted Zustand store, which is `localStorage` behind a hook, so the candidate view and the recruiter pipeline share state with no database. Logins are emulated. Scan verdicts live in an in-memory `Map` on the server, which matters more than it sounds and comes up below.

## Step 1: Three settings

```bash
NEXT_PUBLIC_FILESTACK_API_KEY=your_api_key_here
FILESTACK_APP_SECRET=your_app_secret_here
NEXT_PUBLIC_FILESTACK_WORKFLOW_ID=your_workflow_id
```

The public key is for uploads. The secret signs `ocr` requests, which Filestack rejects unsigned, and must never carry a `NEXT_PUBLIC_` prefix. The workflow ID names the workflow where the scan lives. The upload starts it from the browser, so it needs the public prefix (the demo's `.env.example` calls it `FILESTACK_WORKFLOW_ID`).

## Step 2: The thing to understand first

Most Filestack tasks are synchronous. You build a URL, you get a result.

`virus_detection` is not one of them. It is only available in Workflows. It runs **after the file lands in storage**, asynchronously, and the verdict arrives at a webhook you configure.

That is the right shape for a scan. Scanning takes time, and the answer has to be authoritative before anyone opens the file. It cannot be a synchronous fetch from a browser. It does mean the integration looks different from everything else in this series:

|               | URL task                     | Workflow task                 |
| ------------- | ---------------------------- | ----------------------------- |
| Triggered by  | Building a URL               | A file landing in storage     |
| Result arrives | In the response             | At your webhook               |
| Configured in | Your code                    | The Filestack dashboard       |
| Examples      | `ocr`, `enhance`, `resize`   | `virus_detection`             |

To set it up, create a workflow in the dashboard, add the virus detection task, and point its webhook at `/api/filestack/virus-webhook`. Then tell the upload to run it. The picker takes the workflow ID in its storage options:

```ts
pickFiles({
  accept: ['application/pdf', 'image/*', '.doc', '.docx'],
  maxFiles: 1,
  storeTo: { workflows: [process.env.NEXT_PUBLIC_FILESTACK_WORKFLOW_ID!] },
});
```

That last step is missing from the demo. `FILESTACK_WORKFLOW_ID` is listed in `.env.example` but nothing reads it, and the picker is opened without `workflows`, so no upload ever starts a scan. Combined with the timeout below, that means the demo always ends in the "no workflow configured" state. A workflow ID is not a secret, so a public variable is fine here.

## Step 3: Receiving the verdict

```ts
// src/app/api/filestack/virus-webhook/route.ts
const verdicts = new Map<string, Verdict>();

export async function POST(request: Request) {
  const body = (await request.json()) as {
    handle?: string;
    data?: Verdict;
    results?: Record<string, { data?: Verdict }>;
  };

  // Workflows nests task output under the task name you chose, so accept both
  // the flat shape and the per-task shape.
  const verdict = body.data ?? Object.values(body.results ?? {}).find((entry) => entry.data)?.data;

  if (!body.handle || !verdict) {
    return NextResponse.json({ error: 'Expected a handle and a verdict' }, { status: 400 });
  }

  verdicts.set(body.handle, verdict);
  return NextResponse.json({ ok: true });
}
```

The verdict itself is small:

```json
{ "infected": false, "infections_list": [] }
```

Accepting both payload shapes is a good habit. Workflows nest each task's output under the name you gave the task, so a parser that hard-codes one shape breaks the day someone renames the task. Log the first real payload you receive and confirm the shape against your own account before you rely on it.

The same route answers `GET ?handle=…` with `pending` or `complete`, which is what the browser polls.

## Step 4: Locking the UI until it answers

```tsx
// src/components/features/CandidateReview.tsx
const locked = scan === 'pending' || scan === 'infected';

{locked ? (
  <div>…The preview stays locked until virus detection reports back…</div>
) : (
  <iframe src={previewUrl(file.handle)} className="h-[460px] w-full border-0" title={file.filename} />
)}
```

The browser polls for the verdict every 1.5 seconds:

```ts
const poll = async (): Promise<void> => {
  attempts += 1;
  const body = await fetch(`/api/filestack/virus-webhook?handle=${encodeURIComponent(uploaded.handle)}`)
    .then((r) => r.json());

  if (body.status === 'complete') {
    setScan(body.infected ? 'infected' : 'clean');
    return;
  }
  if (attempts >= 5) {
    setScan('unconfigured');
    return;
  }
  setTimeout(() => void poll(), 1500);
};
```

## Step 5: Read it without downloading it

```ts
export function previewUrl(handle: string): string {
  return `https://cdn.filestackcontent.com/preview/${handle}`;
}
```

One iframe. No pdf.js, no viewer library, and the CV is never written to the recruiter's disk. For a document from a stranger, rendering it on Filestack's side and sending the recruiter a viewer is a much smaller attack surface than handing the raw bytes to a desktop application.

Text extraction is a signed `ocr` call, offered once the file has cleared:

```ts
const signed = await requestSignedUrl(file.handle, [signedTaskSegment({ task: 'ocr' })]);
const result = (await fetch(signed).then((r) => r.json())) as IOcrResult;
```

That makes the pipeline searchable, including CVs that arrive as photographs or scans, which is the case a PDF text-extraction library silently gets wrong.

## Fail open, fail closed

This is the part of the codebase most worth arguing about, because the pattern is right and the defaults are not.

**The lock opens on a timeout.** Look at `locked` again: it is `pending` or `infected`. After five polls, about 7.5 seconds, the state becomes `unconfigured`, which is neither, so the preview unlocks. The UI is honest about it and says the preview is unlocked "so you can still explore the demo". But a slow scan and a missing workflow look identical from the browser. A large file on a busy afternoon that takes eight seconds to scan unlocks before its verdict arrives.

**On serverless, the verdict never arrives.** The verdicts are in a module-level `Map`. On Vercel or any other serverless platform, the webhook `POST` and the browser's `GET` can be handled by different instances, each with its own empty `Map`. The `GET` returns `pending` five times, the lock times out, and the file opens. Deployed as it is, every attachment unlocks unscanned.

**Anyone can mark a file clean.** The webhook trusts whoever calls it. A single `POST` with `{ "handle": "…", "data": { "infected": false, "infections_list": [] } }` clears any file. Filestack signs its webhook requests; verify that signature with your webhook secret before reading the body.

**The lock is in the UI, not on the file.** The handle is known to the browser from the moment the upload finishes, and both `preview/<handle>` and `cdn.filestackcontent.com/<handle>` are unsigned. Hiding an iframe does not stop anyone fetching the URL. A real gate means enabling Security for the application, so unsigned requests fail, and having the server issue a signed preview URL only after a clean verdict is on record.

**Infected files reach the recruiter's queue.** Infected applications are recorded with `status: 'held'`, and the recruiter pipeline shows held items with the same **View** and **Download** buttons as clean ones. The pipeline's own intro text says "attachments that have not cleared are not shown here at all". The one file the system knows is dangerous is one click from a recruiter's disk.

The principle that fixes all five is the same: **unknown is not clean.**

- Store verdicts in the database, as a column on the attachment, so any instance can read them.
- Treat "no verdict yet" as locked, for as long as it takes. Show the recruiter a "still scanning" state, and alert someone if a scan has not returned in a few minutes, instead of unlocking.
- Verify webhook signatures.
- Enable Security and hand out signed preview URLs only for files with a clean verdict.
- Never render View or Download for anything that is not clean.

There is one smaller bug in the same component. The poll's `setTimeout` is never cancelled. Click "Review another application" during a scan, upload a second CV, and the first file's verdict can arrive and set the scan state for the second.

## Beyond recruitment

| Surface                              | Filestack feature                        |
| ------------------------------------ | ---------------------------------------- |
| Support ticket attachments           | `virus_detection` in a Workflow          |
| Client document intake               | `virus_detection`, `preview`             |
| Vendor onboarding paperwork          | `virus_detection`, `ocr`                 |
| Marketplace seller uploads           | `virus_detection`                        |
| Pulling skills and dates out of a CV | `ocr`, with bounding boxes for review    |

## Production checklist

- **Trigger the workflow.** Pass the workflow ID to the picker in `storeTo.workflows`; at the moment nothing starts a scan.
- **Fail closed.** Remove the timeout unlock. A missing verdict is locked, and a long-missing verdict alerts someone.
- **Persist verdicts** in the database, not a module-level `Map`, so they survive restarts and work across serverless instances.
- **Verify the webhook signature** before trusting any verdict.
- **Enable Security for the application** and issue signed preview and download URLs only after a clean verdict.
- **Hide View and Download** for held items in the recruiter pipeline, or leave them out of it, as its copy promises.
- **Decide the policy for `infected: true`**: quarantine, delete, and who gets told.
- **Cancel the poll** when the user moves on to another file.
- **Move applications out of `localStorage`** and replace the emulated login.
- **Keep `FILESTACK_APP_SECRET` server side**; `ocr` needs it.

## Further reading

| Topic                                 | Link                                                                        |
| ------------------------------------- | --------------------------------------------------------------------------- |
| Virus detection and other Intelligence | [Intelligence](https://www.filestack.com/docs/transformations/intelligence/) |
| Running tasks on upload, webhooks     | [Workflows](https://www.filestack.com/docs/workflows/)                       |
| Document preview and delivery         | [Deliver files](https://www.filestack.com/products/deliver-files/)           |
| Policies, signatures and app security | [Security](https://www.filestack.com/docs/security/)                         |
| File Picker configuration and sources | [Pickers](https://www.filestack.com/docs/uploads/pickers/web/)               |

## Final thoughts

The useful lesson here is not really about recruitment. It is that **Filestack has two shapes of capability**, and the second one changes your architecture:

- Anything that transforms bytes is a URL, and you get the answer in the response.
- Anything that has to be authoritative before a human acts is a Workflow, which means a webhook, a stored verdict and a UI that waits.

The waiting is the hard part. A scan that unlocks on a timer is not a scan, it is a delay. Build the gate so that every path you have not thought about ends with the file locked, and the security model holds even on the day your webhook does not fire.

Try the live demo or grab the source on GitHub.
