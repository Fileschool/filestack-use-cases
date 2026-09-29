# Video script: Pemberton Hale

**Working title:** Your CDN URL is a credential you published
**Target runtime:** 5 to 6 minutes
**Audience:** Developers handling confidential files

---

## Cold open (0:00 to 0:35)

**VISUAL:** A CDN URL copied from a browser, pasted into a chat, opened in a private window. It works.

**VO:**
> A plain CDN URL never expires. Forward it once, paste it in a ticket, leave it in an email thread that gets exported during discovery, and it works forever, for anyone. Fine for a product photo. Not fine for a completed set of accounts.

**VISUAL:** Pemberton Hale demo, issued link with a countdown ticking.

**VO:**
> Same file, signed policy, expiring link.

---

## What a policy is (0:35 to 2:10)

**VISUAL:** `sign/route.ts`, policy object on screen.

**VO:**
> Three fields, and each is doing real work.

**VISUAL:** Highlight `expiry`.

**VO:**
> expiry is why this is not a bearer token. The URL stops working at a time you chose, so a forwarded link decays instead of persisting.

**VISUAL:** Highlight `call`.

**VO:**
> call is the permission set. read and convert let the holder view and transform. It does not include store or remove, so a leaked read link cannot be used to write.

**VISUAL:** Highlight `handle`.

**VO:**
> And handle scopes it to one file. Without that you have minted a key to your whole storage for the length of the TTL.

**VISUAL:** The base64 and HMAC lines, then the assembled URL.

**VO:**
> Base64 the policy, HMAC it with your secret, and put the security segment in front of the task chain. Neither can be edited without invalidating the other.

---

## The signing oracle (2:10 to 3:00)

**VISUAL:** The `ALLOWED` regex, held.

**VO:**
> The browser asks for a URL and gets a finished one. The secret never leaves the server, and it must never carry a NEXT_PUBLIC prefix.

**VO:**
> And this allowlist is not optional. Without it you have built a signing oracle: an endpoint that will sign any task chain anyone posts. In a product whose entire premise is access control, that is the whole ballgame.

---

## Expiry the user can see (3:00 to 3:40)

**VISUAL:** Countdown ticking down, then the link failing.

**VO:**
> A countdown on the issued link is not decoration. Expiring links fail confusingly. The client clicks tomorrow, gets an error, and calls the firm. Showing the clock turns a support call into a "request a new link" button.

---

## Watermarking (3:40 to 4:40)

**VISUAL:** The watermarked preview.

**VO:**
> The watermark task composites another Filestack file over the page. Generate a per-recipient overlay and a screenshot still says who it was issued to.

**VO:**
> That does not prevent leaks and is not meant to. It makes them attributable, which is a different and more achievable goal.

**VISUAL:** The on-screen note about the CSS stand-in.

**VO:**
> Worth being straight about: this demo uses a CSS overlay as a stand-in so it runs without a stored watermark asset. A CSS overlay is cosmetic. A composited watermark is in the pixels. Do not ship the first and describe it as the second.

---

## Close (4:40 to 5:20)

**VO:**
> Most teams reach for signed URLs after an incident. The mechanics are not hard: a base64 policy, an HMAC, a segment in front of the chain, no token service required. The part worth internalising is the framing. An unsigned CDN URL is a credential you have published. Once you see it that way, the question stops being whether to sign and becomes how short the expiry can be. Source and write-up below.

---

## Shot list

- [ ] CDN URL copied, pasted, opened in a private window
- [ ] Policy object with each field highlighted in turn
- [ ] base64 and HMAC lines, then the assembled URL
- [ ] `ALLOWED` regex held on screen
- [ ] Countdown ticking, then the link failing
- [ ] Watermarked preview
- [ ] The CSS stand-in disclosure note
