# Pemberton Hale — Solicitors & Advisors

A client document room for a firm that will not send papers by email.

A Filestack use case. The firm is invented; the file handling is real.

## What it does

Issue a document to a named recipient on `/demo`. The link carries a signed policy with a visible countdown, and the preview is stamped with the recipient's name.

## Running it

```bash
npm install          # from the monorepo root
npx turbo dev --filter=fs-legal
```

Then open http://localhost:3015.

## Environment

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_FILESTACK_API_KEY` | Uploads and CDN delivery. Public by necessity: uploads go from the browser straight to Filestack. |
| `FILESTACK_APP_SECRET` | Signing the Intelligence tasks. They reject unsigned requests, so the app signs a short-lived policy server side in `src/app/api/filestack/sign/route.ts`. Never prefix this with `NEXT_PUBLIC_`. |
| `FILESTACK_WORKFLOW_ID` | Only for virus detection, which runs as a Workflow rather than a URL task. |

Copy `.env.example` to `.env` and fill it in. Without the key the upload areas explain what is missing rather than failing silently.

## Fee earner side

Sign in at `/login` to reach `/admin`, the matter room, which records what was issued, to whom, and for how long.

## Worth knowing

- The watermark is real: the recipient's name is rendered to a canvas, uploaded as its own file, and composited by Filestack, so the mark is in the pixels rather than painted over the top in CSS.
- A policy cannot be withdrawn before it expires, so keep expiries short and re-issue rather than sharing long-lived links.
- Signed URLs control access to a file, not access to the app. Real authentication still belongs in front.

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
