# Redfern — Mail & Document Services

A virtual mailroom for businesses that no longer have a post room. Post is scanned, read, routed to the named recipient and indexed the same morning.

A Filestack use case. The firm is invented; the file handling is real.

## What it does

Upload photographs of envelopes on `/demo`. Each one is read, the sender and recipient come back as named fields, and the recipient is matched against the staff directory. The contents are separately straightened and read so the item is searchable. Anything unmatched is held for a supervisor.

## Running it

```bash
npm install          # from the monorepo root
npx turbo dev --filter=fs-mailroom
```

Then open http://localhost:3010.

## Environment

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_FILESTACK_API_KEY` | Uploads and CDN delivery. Public by necessity: uploads go from the browser straight to Filestack. |
| `FILESTACK_APP_SECRET` | Signing the Intelligence tasks. They reject unsigned requests, so the app signs a short-lived policy server side in `src/app/api/filestack/sign/route.ts`. Never prefix this with `NEXT_PUBLIC_`. |
| `FILESTACK_WORKFLOW_ID` | Only for virus detection, which runs as a Workflow rather than a URL task. |

Copy `.env.example` to `.env` and fill it in. Without the key the upload areas explain what is missing rather than failing silently.

## Staff side

Sign in at `/login` (no passwords, pick a name) to reach `/admin`, the sorting floor, where everything scanned appears with what was read off it.

## Worth knowing

- Envelope reading returns `sender`, `recipient_name` and `recipient_address` as fields, which is why routing is a directory lookup rather than a parser.
- The signing route keeps an allowlist of tasks it will sign. Without one it would sign anything posted to it.

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
