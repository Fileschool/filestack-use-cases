# Video script: Redfern

**Working title:** Route the post automatically with one Filestack task
**Target runtime:** 5 to 6 minutes
**Audience:** Full-stack developers who have hit the "parse an address" problem

---

## Cold open (0:00 to 0:25)

**VISUAL:** A scanned envelope. General OCR output pastes over it: a wall of undifferentiated text.

**VO:**
> Here is an envelope, and here is what normal OCR gives you back. A company name, a street, a postcode, a person, and nothing telling you which is which. If you want to route this to the right desk, you now write a parser. And your parser breaks on the next envelope, because the address is in a different place.

**VISUAL:** Cut to the same envelope with three labelled fields: sender, recipient_name, recipient_address.

**VO:**
> This is the same envelope through one Filestack task. Same picture, already labelled.

---

## What we're building (0:25 to 0:55)

**VISUAL:** Redfern demo, batch of envelopes dropped in, cards filling with routed recipients.

**VO:**
> Redfern is a virtual mailroom. Scan the morning post, every item gets matched to a person, and anything that cannot be matched goes to a human queue. Next.js, Filestack, and no OCR model anywhere.

---

## The key detail (0:55 to 1:50)

**VISUAL:** Editor, `filestack.interface.ts`, highlight `IEnvelopeOcrResult`.

**VO:**
> The whole demo rests on the shape of this response. Not a string of text. Three named fields. Which means routing is a property lookup, not a parsing problem.

**VISUAL:** `matchRecipient` in `Mailroom.tsx`, highlight the surname fallback.

**VO:**
> Match the full name, then fall back to a surname, then give up and ask a human. Envelopes carry initials and married names, so exact matching fails more often than you would like.

---

## The security wrinkle (1:50 to 3:10)

**VISUAL:** `.env.example`, both variables on screen.

**VO:**
> Now the thing that catches people out. This app needs two keys, not one. envelope_ocr, ocr and doc_detection all reject unsigned requests. They need a policy signed with your app secret, and that secret cannot go in the browser.

**VISUAL:** `sign/route.ts`, step through policy, base64, HMAC, URL assembly.

**VO:**
> So one API route holds the secret. A policy is base64 JSON, the signature is its HMAC-SHA256, and the security segment goes in front of the task chain.

**VISUAL:** Highlight the `ALLOWED` regex.

**VO:**
> And this line matters more than it looks. Without a task allowlist you have built a signing oracle. Anyone can post any chain and get it signed with your secret.

---

## The clean-before-read chain (3:10 to 4:10)

**VISUAL:** Terminal or browser showing `doc_detection=coords:false,preprocess:true/ocr/HANDLE`.

**VO:**
> For the contents, two tasks chain in one URL. doc_detection finds the page, warps it flat and preprocesses it. Then ocr reads the result. Order matters. Deskewing after reading would be pointless.

**VISUAL:** Side by side, crooked scan and flattened output.

---

## Live run (4:10 to 5:15)

**VISUAL:** Full demo. Drop six envelopes. Cards populate. Counters move. One lands in "needs a human".

**VO:**
> Six envelopes, one batch. Five routed automatically, one unmatched because the name is not in the directory, and that one is the only item a person touches.

---

## Close (5:15 to 5:45)

**VISUAL:** Article and repo links.

**VO:**
> No OCR engine, no deskew pipeline, no address parser to maintain. The task returns the answer already labelled, and that is the difference between a feature you ship and a parser you own forever. Source and write-up are linked below.

---

## Shot list

- [ ] Envelope with OCR wall-of-text overlay (build this graphic)
- [ ] Same envelope with three labelled fields
- [ ] `IEnvelopeOcrResult` in the editor
- [ ] `matchRecipient` with the fallback highlighted
- [ ] `.env.example`
- [ ] `sign/route.ts` scrolled slowly through the signing steps
- [ ] `ALLOWED` regex, held on screen
- [ ] Crooked scan vs flattened, side by side
- [ ] Six-envelope batch run, uncut
