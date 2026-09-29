# Hollis — Applicant Tracking

An applicant tracker for teams that treat every attachment as a file from a stranger.

A Filestack use case. The firm is invented; the file handling is real.

## What it does

Upload a CV on `/demo`. It stays locked until virus detection reports back, then opens in an embedded preview that never downloads it, with the text extractable for search.

## Running it

```bash
npm install          # from the monorepo root
npx turbo dev --filter=fs-recruitment
```

Then open http://localhost:3013.

## Environment

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_FILESTACK_API_KEY` | Uploads and CDN delivery. Public by necessity: uploads go from the browser straight to Filestack. |
| `FILESTACK_APP_SECRET` | Signing the Intelligence tasks. They reject unsigned requests, so the app signs a short-lived policy server side in `src/app/api/filestack/sign/route.ts`. Never prefix this with `NEXT_PUBLIC_`. |
| `FILESTACK_WORKFLOW_ID` | Only for virus detection, which runs as a Workflow rather than a URL task. |

Copy `.env.example` to `.env` and fill it in. Without the key the upload areas explain what is missing rather than failing silently.

## Recruiter side

Sign in at `/login` to reach `/admin`, the pipeline, which only lists applications that have been screened.

## Worth knowing

- Virus detection is a Workflows task, not a URL task. Create the workflow in the Filestack dashboard and point its webhook at `/api/filestack/virus-webhook`.
- The UI defaults to locked. An unscanned attachment is unknown, not probably fine.
- The verdict store is an in-memory map, so it forgets on restart. In production that is a column on the attachment.

## Layout

```
src/
  app/            Public site, /demo, /login, /admin, and the signing route
  components/
    features/     The working parts of the demo
    ui/           Chrome, including the Filestack strip and footer
  interfaces/     I-prefixed types
  lib/            filestack.ts (URL builders), copy.ts (all wording), media.ts (image handles)
  services/       filestack.service.ts (SDK, picker, signed URLs)
  store/          Zustand stores
```
