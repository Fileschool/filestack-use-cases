# Saltmarket — Secondhand, sold well

A marketplace for furniture and homeware with a past. Sellers list from the photo they already took.

A Filestack use case. The firm is invented; the file handling is real.

## What it does

Upload a dim or undersized photo on `/demo`. Compare the original against each correction preset, enlarge it, and see the same handle serving the search tile, the listing card and the full view.

## Running it

```bash
npm install          # from the monorepo root
npx turbo dev --filter=fs-marketplace
```

Then open http://localhost:3012.

## Environment

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_FILESTACK_API_KEY` | Uploads and CDN delivery. Public by necessity: uploads go from the browser straight to Filestack. |
| `FILESTACK_APP_SECRET` | Signing the Intelligence tasks. They reject unsigned requests, so the app signs a short-lived policy server side in `src/app/api/filestack/sign/route.ts`. Never prefix this with `NEXT_PUBLIC_`. |
| `FILESTACK_WORKFLOW_ID` | Only for virus detection, which runs as a Workflow rather than a URL task. |

Copy `.env.example` to `.env` and fill it in. Without the key the upload areas explain what is missing rather than failing silently.

## No staff side

Saltmarket is seller-facing only, so it has no admin view. The other five use cases have one.

## Worth knowing

- The whole rescue pipeline is a URL. These tasks answer unsigned requests, so there is no API route and no server in the path.
- Every distinct chain is a separate render and cache entry, so keep the preset and size matrix small.

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
