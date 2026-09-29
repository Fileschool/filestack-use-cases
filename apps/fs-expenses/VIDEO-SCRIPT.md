# Video script: Marlow

**Working title:** OCR that shows its working
**Target runtime:** 5 to 6 minutes
**Audience:** Developers building document capture or expense tooling

---

## Cold open (0:00 to 0:30)

**VISUAL:** A creased receipt on a dark table. A form field appears with a total. Cursor hovers, nothing to click.

**VO:**
> Most receipt scanners give you a number and ask you to trust it. When it is wrong, and on a receipt like this it sometimes is, your reviewer has a figure they doubt and no way to check it without opening the original and hunting.

**VISUAL:** Same photo, flattened and corrected, every word outlined, the total highlighted.

**VO:**
> Filestack's OCR returns a bounding box for every word. So you can draw the answer back onto the photo, and checking a total becomes a glance.

---

## What we're building (0:30 to 1:00)

**VISUAL:** Marlow demo end to end at speed.

**VO:**
> Photograph a receipt at any angle in any light. Three tasks flatten it, fix the colour and read it, and the app shows you exactly where every figure came from.

---

## The chain (1:00 to 2:20)

**VISUAL:** The URL, built up one segment at a time on screen.

**VO:**
> doc_detection finds the receipt inside the photo and warps it flat. enhance with the fix_dark preset corrects the colour. Then ocr reads the result. Tasks run left to right, and the order is the design. Reading first would mean reading a crooked, dim photograph.

**VISUAL:** Three-panel: original, after doc_detection, after enhance.

---

## The security split (2:20 to 3:10)

**VISUAL:** `ReceiptReader.tsx`, the two URL-building paths side by side.

**VO:**
> Here is a detail worth knowing before you ship. enhance answers an unsigned request. doc_detection and ocr do not. So the preview is built in the browser, and the reading URL is signed on the server. Getting that split wrong is how you end up with 400s in production.

---

## Bounding boxes (3:10 to 4:30)

**VISUAL:** `toBoxes`, highlight the two shape branches.

**VO:**
> The response nests: text areas, lines, words, each with a box. Normalise defensively rather than trusting one field layout, then convert to fractions of the image so the overlay survives any render size.

**VISUAL:** Toggle the boxes on and off over the receipt. Resize the browser, boxes track.

**VO:**
> And one thing that will bite you. These boxes belong to the processed image, not the original upload. They came from OCR that ran after doc_detection, so they have to be drawn over that same chain's output. Overlay them on the raw photo and every box lands in the wrong place.

---

## The total (4:30 to 5:10)

**VISUAL:** `guessTotal`, highlight `.at(-1)`.

**VO:**
> Finding the total is a heuristic, and taking the last match is deliberate. Receipts print subtotal, tax, then total. That is honest here only because the box is drawn on the image, so a wrong guess is visibly wrong rather than silently wrong.

---

## Close (5:10 to 5:40)

**VO:**
> Extraction is not the hard part any more. Trust is. A number in a field is a claim. A number with a box around where it came from is evidence, and you get it in the same call. Source and write-up below.

---

## Shot list

- [ ] Receipt photographed badly, on a table
- [ ] Three-panel: original, flattened, colour corrected
- [ ] URL assembled segment by segment
- [ ] `ReceiptReader.tsx` dual URL paths
- [ ] `toBoxes` with both branches highlighted
- [ ] Boxes toggling on and off
- [ ] Browser resize with boxes tracking
- [ ] `guessTotal` with `.at(-1)` held
