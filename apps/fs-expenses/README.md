# Marlow — Spend & Expense Management

Expense capture for finance teams. Someone photographs a receipt at the table and the claim arrives coded, with every figure checkable.

A Filestack use case. The firm is invented; the file handling is real.

## What it does

Photograph a receipt on `/demo`, at any angle in any light. It is flattened, colour corrected and read, and every word the reader returns is drawn back onto the image where it was found.

## Running it

```bash
npm install          # from the monorepo root
npx turbo dev --filter=fs-expenses
```

Then open http://localhost:3011.

## Environment

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_FILESTACK_API_KEY` | Uploads and CDN delivery. Public by necessity: uploads go from the browser straight to Filestack. |
| `FILESTACK_APP_SECRET` | Signing the Intelligence tasks. They reject unsigned requests, so the app signs a short-lived policy server side in `src/app/api/filestack/sign/route.ts`. Never prefix this with `NEXT_PUBLIC_`. |
| `FILESTACK_WORKFLOW_ID` | Only for virus detection, which runs as a Workflow rather than a URL task. |

Copy `.env.example` to `.env` and fill it in. Without the key the upload areas explain what is missing rather than failing silently.

## Finance side

Sign in at `/login` to reach `/admin`, the approval queue, where captured receipts arrive with the total already extracted.

## Worth knowing

- The bounding boxes belong to the processed image, not the original upload, so they are drawn over the same chain's output. Overlay them on the raw photo and every box lands in the wrong place.
- Finding the total is a heuristic and takes the last match, because receipts print subtotal, tax, then total.

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
