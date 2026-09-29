# A CDN URL Is a Bearer Token: Signed, Expiring Links with Filestack

A plain CDN URL never expires.

Forward it once, paste it in a ticket, leave it in an email thread that gets exported during discovery, and it works forever, for anyone. That is fine for a product photo. It is not fine for a completed set of accounts.

This guide walks through **Pemberton Hale**, a client portal for firms that cannot email attachments, and the security model underneath it.

## What we're building

A firm shares a document with one named client. The link carries a signed policy and stops working on its own. The preview is watermarked with whoever it was issued to. Anything the client sends back is screened before a fee earner opens it.

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Upload, storage, CDN, processing | Filestack |
| Server state | TanStack Query |
| Client state | Zustand |
| Styling | Tailwind v4 |
| Language | TypeScript |

## Step 1: What a policy actually is

```ts
const policy = JSON.stringify({
  expiry: Math.floor(Date.now() / 1000) + TTL_SECONDS,
  call: ['read', 'convert'],
  handle,
});

const encodedPolicy = Buffer.from(policy).toString('base64');
const signature = createHmac('sha256', secret).update(encodedPolicy).digest('hex');

const url = [CDN, `security=p:${encodedPolicy},s:${signature}`, ...tasks, handle].join('/');
```

Three fields, and each is doing real work:

**`expiry`** is why this is not a bearer token. The URL stops working at a time you chose, so a forwarded link decays instead of persisting.

**`call`** is the permission set. `read` and `convert` let the holder view and transform. It does not include `store` or `remove`, so a leaked read link cannot be used to write.

**`handle`** scopes the policy to one file. Without it you have minted a key to your whole storage for the length of the TTL.

The security segment goes in front of the task chain, and the signature is an HMAC over the encoded policy, so neither can be edited without invalidating the other.

## Step 2: The secret never leaves the server

```ts
const response = await fetch('/api/filestack/sign', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ handle: file.handle, tasks: ['ocr'] }),
});
```

The browser asks for a URL and receives a finished one. It never sees `FILESTACK_APP_SECRET`, which must never carry a `NEXT_PUBLIC_` prefix.

The route keeps an allowlist:

```ts
const ALLOWED = /^(ocr|envelope_ocr|doc_detection(=[a-z_]+:(true|false)(,[a-z_]+:(true|false))*)?)$/;
```

Without it you have built a signing oracle: an endpoint that will sign any task chain anyone posts. In a product whose entire premise is access control, that would be the whole ballgame.

## Step 3: Expiry the user can see

```tsx
const expired = left <= 0;
const minutes = Math.floor(left / 60000);
const seconds = Math.floor((left % 60000) / 1000);
```

A countdown on the issued link is not decoration. Expiring links fail confusingly: the client clicks tomorrow, gets an error, and calls the firm. Showing the clock sets the expectation up front and turns a support call into a "request a new link" button.

## Step 4: Watermarking, and what it is for

The `watermark` task composites another Filestack file over the page:

```
watermark=file:<overlayHandle>,size:100,position:[middle,center]
```

Generate a per-recipient overlay and a screenshot still says who it was issued to. That does not prevent leaks and is not meant to. It makes them **attributable**, which is a different and more achievable goal.

The demo uses a CSS overlay as a stand-in so it runs without a stored watermark asset. That difference is called out in the UI rather than glossed over, because a CSS overlay is cosmetic and a composited watermark is in the pixels.

## Step 5: Inbound files

Client uploads run through `virus_detection` in a Workflow before they reach a fee earner. Same reasoning as the outbound side: the portal exists so documents do not travel by email, and that only holds if what comes back is screened.

## Beyond professional services

| Surface | Feature |
| --- | --- |
| Patient record sharing | signed policies, short expiry |
| Investor data rooms | signed policies, `watermark` |
| Pre-release media review | `watermark`, expiring links |
| Contractor document exchange | `virus_detection` via Workflows |

## Production checklist

- Match the TTL to the use case. Minutes for a preview, longer for a link emailed to a client, and always shorter than you first think.
- Log every issued link with recipient, handle, expiry and issuer. The audit trail is the product.
- Add revocation. A policy cannot be withdrawn before expiry, so keep short TTLs and re-issue rather than sharing long-lived links.
- Generate real watermark overlays per recipient and store their handles.
- Keep the signing allowlist tight and rotate the app secret on staff changes.
- Put real auth in front of all of it. Signed URLs control access to a file, not access to your app.

## Final thoughts

Most teams reach for signed URLs after an incident. The mechanics are not hard: a base64 policy, an HMAC, a segment in front of the task chain. Filestack gives you all of it without a token service.

The part worth internalising is the framing. An unsigned CDN URL is a **credential you have published**. Once you see it that way, the question stops being whether to sign and becomes how short the expiry can be.
