# Filestack Use Cases

Sample applications we build in-house to show developers what they can build with
Filestack. Each one is a complete, working product rather than a snippet, built as
a business a customer would recognise, with a written guide and a video script
alongside it.

Every app carries a black strip above its own masthead marking it as a Filestack
use case, and a footer explaining in plain English what Filestack is doing.

## Start here

[`apps/fs-directory`](apps/fs-directory) is a catalogue of everything below. It shows a
screenshot of each application, what it does, and exactly which Filestack capabilities it
uses, with a page per use case and an index of every capability across the set.

```bash
npx turbo dev --filter=fs-directory    # localhost:3009
```

The screenshots are real: each app was run locally, captured, and the image stored in
Filestack like everything else in the repository.

## The apps

| Folder | The business | Vertical | What Filestack does |
| --- | --- | --- | --- |
| [`apps/fs-education`](apps/fs-education) | Fairmount College | Education | Renders any submission as a page a lecturer can draw on, and stores the markup separately |
| [`apps/fs-realestate`](apps/fs-realestate) | Horizon Pro | Real estate | One uploaded photo serves every image size the marketplace needs |
| [`apps/fs-filesharing`](apps/fs-filesharing) | Fireshare | File sharing | Upload, short link, and image transformations by URL |
| [`apps/fs-construction`](apps/fs-construction) | APEX | Construction | Serves one drawing through two viewers: an interactive preview and a flattened blueprint |
| [`apps/fs-mailroom`](apps/fs-mailroom) | Redfern | Logistics | Reads the sender and recipient off an envelope, then indexes the contents |
| [`apps/fs-expenses`](apps/fs-expenses) | Marlow | Fintech | Flattens and reads a receipt, and marks each figure where it was found |
| [`apps/fs-marketplace`](apps/fs-marketplace) | Saltmarket | E-commerce | Corrects and enlarges a poor seller photo, then serves every size |
| [`apps/fs-recruitment`](apps/fs-recruitment) | Hollis | HR tech | Screens attachments before they open, previews without downloading |
| [`apps/fs-insurance`](apps/fs-insurance) | Ardmore Mutual | Insurance | Runs a whole claim-intake chain from one upload |
| [`apps/fs-legal`](apps/fs-legal) | Pemberton Hale | Legal | Signed expiring links and watermarked previews |

## Running them

```bash
npm install
npx turbo dev --filter=fs-insurance     # or any folder above
```

Each app runs on its own port so several can run at once.

| App | Port | | App | Port |
| --- | --- | --- | --- | --- |
| fs-mailroom | 3010 | | fs-recruitment | 3013 |
| fs-expenses | 3011 | | fs-insurance | 3014 |
| fs-marketplace | 3012 | | fs-legal | 3015 |
| fs-directory | 3009 | | | |

The original four use the default port, so run them one at a time or pass `-p`.

## Environment

Copy `.env.example` to `.env` in each app.

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_FILESTACK_API_KEY` | Every app. Uploads and CDN delivery. Public by necessity, because uploads go from the browser straight to Filestack. |
| `FILESTACK_APP_SECRET` | The apps that read documents. Text extraction, envelope reading and document detection all reject unsigned requests, so those apps sign a short-lived policy server side. Never prefix this with `NEXT_PUBLIC_`. |
| `FILESTACK_WORKFLOW_ID` | Virus scanning, which runs as a Workflow rather than a URL and reports back by webhook. |
| `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` | Only fs-education and fs-filesharing, which use a database. |

## Two things worth knowing before you build another one

**Not everything is a URL.** Most of Filestack works by building a URL and
reading the result. Virus scanning does not: it runs after the file lands in
storage and reports back to a webhook you configure in the dashboard. Picking the
wrong shape is the most common integration mistake.

**Some tasks must be signed.** Text extraction, envelope reading and document
detection reject unsigned requests. The apps that use them each have a route at
`src/app/api/filestack/sign/route.ts` that holds the secret, keeps an allowlist of
tasks it is willing to sign, and returns a finished URL to the browser.

## Each app ships with

- `README.md` — what it is and how to run it
- `ARTICLE.md` — the long-form technical write-up
- `VIDEO-SCRIPT.md` — a shot-by-shot script for the demo video

Planned use cases and their status are tracked in
[`NEXT-USE-CASES.csv`](NEXT-USE-CASES.csv).
