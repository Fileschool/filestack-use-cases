# A CDN URL Is a Credential: Expiring, Watermarked Documents with Filestack

A plain CDN URL never expires.

Forward it once, paste it into a ticket, leave it in an email thread that gets exported during a dispute, and it works forever, for anyone who has it. That is fine for a product photo. It is not fine for a completion statement, a will or a set of company accounts.

The usual answer is a document service of your own: a token table, an endpoint that checks the token and streams the file, a renderer so the client can read it without downloading it, and something that stamps the recipient's name on every page. That is a small product in its own right, built before you have shared a single document.

This guide walks through **Pemberton Hale**, a client room for a law firm that does not want to email attachments, and the two things worth stealing from it: **a signed policy turns a CDN URL into a link that stops working on its own, and the `watermark` task puts the recipient's name into the pixels.** It also walks through the part the demo gets wrong, because the mistake is an easy one to make with signed URLs and worth seeing once.

## What we're building

A fee earner uploads a document and issues it to a named client. The client gets a link that expires. The preview they see is stamped with their name, composited into the image rather than painted on in CSS, so a screenshot still says who it was issued to. Every issue is recorded against the matter.

## Stack

| Layer                            | Tech                    |
| -------------------------------- | ----------------------- |
| Framework                        | Next.js 16 (App Router) |
| Upload, storage, CDN, processing | Filestack               |
| Client state                     | Zustand                 |
| Styling                          | Tailwind v4             |
| Language                         | TypeScript              |

Issued links are recorded in a persisted Zustand store, which is `localStorage` with a hook in front of it, so the client room and the fee earners' "matter room" share state with no database. Logins are emulated. The file layer is the real thing.

## Step 1: Two keys

```bash
NEXT_PUBLIC_FILESTACK_API_KEY=your_api_key_here
FILESTACK_APP_SECRET=your_app_secret_here
```

The public key is for uploads, which go from the browser straight to Filestack. The app secret signs policies. It lives on the server only and must never carry a `NEXT_PUBLIC_` prefix, because anyone holding it can mint a policy for any file in your account.

## Step 2: What a policy actually is

The signing route builds the policy:

```ts
// src/app/api/filestack/sign/route.ts
const policy = JSON.stringify({
  expiry: Math.floor(Date.now() / 1000) + TTL_SECONDS,
  call: ['read', 'convert'],
  handle,
});

const encodedPolicy = Buffer.from(policy).toString('base64');
const signature = createHmac('sha256', secret).update(encodedPolicy).digest('hex');

const url = [CDN, `security=p:${encodedPolicy},s:${signature}`, ...tasks, handle].join('/');
```

Three fields, each doing real work:

- **`expiry`** is a Unix timestamp. After it, the CDN refuses the URL. A forwarded link decays instead of persisting.
- **`call`** is the permission set. `read` and `convert` let the holder view and transform the file. There is no `store` or `remove`, so a leaked link cannot be used to write or delete.
- **`handle`** scopes the policy to one file. Leave it out and you have minted a key to your whole account for the length of the TTL.

The signature is an HMAC over the encoded policy, so neither half can be edited without invalidating the other. The security segment goes in front of the task chain.

## Step 3: The secret stays on the server

The browser posts a handle and a task list and gets back a finished URL:

```ts
// src/components/features/SecureShare.tsx
const response = await fetch('/api/filestack/sign', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ handle: file.handle, tasks: ['ocr'] }),
});
```

The route keeps an allowlist of tasks it is willing to sign:

```ts
const ALLOWED = /^(ocr|envelope_ocr|doc_detection(=[a-z_]+:(true|false)(,[a-z_]+:(true|false))*)?)$/;
```

Without one, you have built a signing oracle: an endpoint that will sign any chain anyone posts. In a product whose whole premise is access control, that would be the entire ballgame.

Look closely at that request body, though. It comes up again below.

## Step 4: Expiry the client can see

```tsx
function Countdown({ expiresAt }: { expiresAt: number }) {
  const [left, setLeft] = useState(() => Math.max(0, expiresAt - Date.now()));

  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, expiresAt - Date.now())), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  // …renders "9:42 left" or "Expired"
}
```

A countdown on an issued link is not decoration. Expiring links fail confusingly: the client clicks it tomorrow, gets an error from a CDN, and rings the firm. Showing the clock sets the expectation up front and turns a support call into a "request a new link" button.

## Step 5: A watermark in the pixels

The `watermark` task composites one stored file over another:

```ts
// src/lib/filestack.ts
export function watermarkUrl(handle: string, overlayHandle: string, before: string[] = [], size = 100): string {
  return cdnUrl(handle, [...before, `watermark=file:${overlayHandle},size:${size},position:[middle,center]`]);
}
```

The overlay has to be a file, so the app draws the recipient's name onto a transparent canvas and uploads it:

```ts
async function buildOverlay(recipient: string): Promise<string | null> {
  const canvas = document.createElement('canvas');
  canvas.width = 1400;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 8);
  ctx.fillStyle = 'rgba(123, 45, 59, 0.22)';
  ctx.font = '700 84px Georgia, serif';
  ctx.fillText(`ISSUED TO ${recipient.toUpperCase()}`, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) return null;

  return (await uploadImageBlob(blob, `watermark-${Date.now()}.png`)).handle;
}
```

Then the first page is rasterised and stamped in one chain:

```
https://cdn.filestackcontent.com/output=format:png,page:1,density:150/resize=width:900,fit:max/watermark=file:<overlay>,size:100,position:[middle,center]/<handle>
```

The order matters. `output` turns the PDF page into an image, `resize` sets the size, and `watermark` goes last so the overlay is scaled against the final image rather than the original page.

The point of a watermark is not to prevent leaks. It does not, and it is not meant to. The point is to make a leak **attributable**, which is a different and more achievable goal. A CSS overlay is cosmetic and disappears on download. A composited watermark is in the image itself.

## Signing a URL is not the same as securing a file

This is the section to read twice. The demo has both halves of a secure share, and they never meet.

**The signed link is not the document.** Look at the request in Step 3 again: `tasks: ['ocr']`. The link the client is given is a signed URL for an `ocr` call, so opening it returns the OCR JSON of the document, not the document. That is because the signing route was written for OCR, and its allowlist only knows `ocr`, `envelope_ocr` and `doc_detection`. There is no way to ask it for a plain signed read, so the share borrows a task that happened to be signable.

**The watermarked page is not signed.** The stamped preview is built with `cdnUrl`, unsigned and permanent. So the client room shows a watermarked image anyone can open forever, and issues a link that expires but carries no watermark.

**Neither matters until security is switched on.** This is the subtle part. A signed URL proves you were allowed to make the request. It does not stop anyone making the **unsigned** request for the same handle. `https://cdn.filestackcontent.com/<handle>` keeps working unless Security is enabled for the application in the Filestack dashboard. Only then does the CDN refuse requests without a valid policy. Until that switch is on, every expiring link in this app is a decoy sitting next to a permanent one.

Turning it on is the right move, and it will break everything else in this demo that is currently unsigned: the picker upload, the preview iframe, the watermark overlay upload and the matter room's thumbnails. That is the point. Every one of those is a request that should have needed a policy.

What a correct share looks like:

```ts
// A dedicated route: the browser names the file and the overlay, the server owns the chain.
const tasks = [
  'output=format:png,page:1,density:150',
  'resize=width:900,fit:max',
  `watermark=file:${overlayHandle},size:100,position:[middle,center]`,
];
const url = [CDN, `security=p:${encodedPolicy},s:${signature}`, ...tasks, handle].join('/');
```

The browser asks for a share and supplies nothing but handles, both validated against the same `^[A-Za-z0-9_-]+$` pattern the route already uses. The server builds the watermarked chain itself, signs it with a policy scoped to the document, and returns that. Because the chain is fixed on the server, there is no task allowlist to loosen. One thing to test against your own account: `watermark` reads a second file, so confirm that a policy scoped to the document's handle is enough for the overlay to be fetched once Security is on. The [Security docs](https://www.filestack.com/docs/security/) list the policy fields if it needs widening. The link the client receives is then **both** expiring and stamped. Do the same for the preview the fee earner sees, and enable Security for the app so the unsigned path no longer exists.

Two smaller things in the same component:

- **The overlay upload is public.** Each issue uploads a PNG with a client's name on it, unsigned, into the same account. With Security on, that upload needs a policy too. Consider overlays as short-lived files and delete them when the link expires.
- **The pipeline chips always say done.** `<TaskChip task="Watermark" state="done" />` is hard-coded, so the UI reports a watermark before anything has been watermarked. Status should come from state.

## Inbound documents

The client room says that anything a client sends back is screened by `virus_detection` before it reaches a fee earner. Nothing in this app does that yet. There is no upload path for clients and no webhook. The pattern is the same as in the recruitment demo in this series: a Workflow runs `virus_detection` after upload, posts a verdict to a webhook, and the file stays locked until the verdict says clean. Do not promise it in the UI until it is wired up.

## Beyond professional services

| Surface                         | Filestack feature                         |
| ------------------------------- | ----------------------------------------- |
| Patient record sharing          | Signed policies, short expiry             |
| Investor data rooms             | Signed policies, `watermark`              |
| Pre-release media review        | `watermark`, expiring links               |
| Contract review with a counterparty | `preview`, signed policies            |
| Client document returns         | `virus_detection` in a Workflow           |

## Production checklist

- **Enable Security for the application.** Without it, signed URLs are decoration; the unsigned URL for the same handle still works.
- **Sign the thing you share.** Add a fixed share pattern to the allowlist and sign the watermarked chain, instead of borrowing `ocr`.
- **Sign the preview too**, and every thumbnail in the matter room.
- **Match the TTL to the use.** Minutes for an in-app preview, longer for a link emailed to a client, and always shorter than you first think.
- **Plan for revocation.** A policy cannot be withdrawn before it expires, so keep TTLs short and re-issue rather than sharing long-lived links.
- **Log every issue** with recipient, handle, expiry and issuer, in a real database. The audit trail is the product.
- **Treat overlays as sensitive.** Upload them under a policy and clean them up.
- **Drive status chips from state**, not constants.
- **Wire up inbound `virus_detection`** before the UI claims it.
- **Rotate the app secret** on staff changes, and put real auth in front of all of it. Signed URLs control access to a file, not to your app.

## Further reading

| Topic                                 | Link                                                              |
| ------------------------------------- | ----------------------------------------------------------------- |
| Policies, signatures and app security | [Security](https://www.filestack.com/docs/security/)               |
| `watermark` and every other task      | [Processing API](https://www.filestack.com/docs/api/processing/)   |
| Document preview and delivery         | [Deliver files](https://www.filestack.com/products/deliver-files/) |
| File Picker configuration and sources | [Pickers](https://www.filestack.com/docs/uploads/pickers/web/)     |
| Virus scanning on upload              | [Workflows](https://www.filestack.com/docs/workflows/)             |

## Final thoughts

Most teams reach for signed URLs after an incident. The mechanics are not hard: a base64 policy, an HMAC, a segment in front of the task chain. Filestack gives you all of it without a token service.

The part worth taking away is the framing:

- An unsigned CDN URL is a **credential you have published**.
- A signed one is a credential with an expiry, **if** the unsigned one has been switched off.
- A watermark makes whatever leaks anyway traceable, **if** it is on the copy you actually share.

Each control only works once it covers the copy the client actually receives. Get that right and the question stops being whether to sign, and becomes how short the expiry can be.

Try the live demo or grab the source on GitHub.
