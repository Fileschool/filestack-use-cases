# Ardmore Mutual — Insurance since 1923

A mutual insurer for homes and small businesses. Members report a claim from a phone and the file is prepared before an assessor sees it.

A Filestack use case. The firm is invented; the file handling is real.

## What it does

Upload a damage photograph or a picture of a policy schedule on `/demo` and watch the intake chain run. Photographs and paperwork take different branches through the same sequence.

## Running it

```bash
npm install          # from the monorepo root
npx turbo dev --filter=fs-insurance
```

Then open http://localhost:3014.

## Environment

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_FILESTACK_API_KEY` | Uploads and CDN delivery. Public by necessity: uploads go from the browser straight to Filestack. |
| `FILESTACK_APP_SECRET` | Signing the Intelligence tasks. They reject unsigned requests, so the app signs a short-lived policy server side in `src/app/api/filestack/sign/route.ts`. Never prefix this with `NEXT_PUBLIC_`. |
| `FILESTACK_WORKFLOW_ID` | Only for virus detection, which runs as a Workflow rather than a URL task. |

Copy `.env.example` to `.env` and fill it in. Without the key the upload areas explain what is missing rather than failing silently.

## Assessor side

Sign in at `/login` to reach `/admin`, the assessment desk, where prepared claims arrive.

## Worth knowing

- The order of the chain is the design: screened before touched, flattened before read, corrected before judged.
- The demo runs the chain from the browser so you can watch it. In production it belongs in a Workflow, which survives the browser closing.
- Virus detection is still simulated here, because it needs a workflow configured in your dashboard.

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
