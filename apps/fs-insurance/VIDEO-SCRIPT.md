# Video script: Ardmore Mutual

**Working title:** Chaining Filestack tasks, and why order is the design
**Target runtime:** 5 to 6 minutes
**Audience:** Developers wiring multi-step file processing

---

## Cold open (0:00 to 0:30)

**VISUAL:** A claim folder opening: dark photos of a flooded kitchen, an angled phone snap of a policy schedule, a garage PDF.

**VO:**
> A claim arrives as a pile of mixed files from a stranger having a bad day. Every one needs something different, and doing it by hand is where claims stall.

**VISUAL:** The pipeline view, steps lighting up in sequence.

**VO:**
> This is the one demo in the series where the interesting part is not any single task. It is the chain.

---

## The chain (0:30 to 2:00)

**VISUAL:** Four-step list with integration style labelled beside each.

**VO:**
> Four steps. Screen the file. Flatten it if it is paperwork. Read it. Correct it if it is a photo. Three things about that list matter more than any individual task.

**VO:**
> First, scanning goes first and gates everything. Nothing else should touch a file that has not been screened. That is the whole reason this is a sequence rather than four parallel calls.

**VO:**
> Second, the middle two are ordered by accuracy. OCR on a photographed page reads badly. doc_detection flattens it first. Run them the other way round and it still works, it just returns worse results, which is the dangerous kind of wrong.

**VO:**
> Third, they do not all have the same shape. virus_detection is a Workflow and arrives by webhook. doc_detection and ocr need a signed policy. enhance answers unsigned. One chain, three integration styles.

---

## Branching (2:00 to 3:00)

**VISUAL:** `planFor` in the editor.

**VO:**
> A damage photo and a policy schedule should not take the same path, so the plan branches on file type and marks the other branch skipped.

**VISUAL:** Demo: upload a photo, watch two steps grey out. Upload a PDF, watch the other two.

**VO:**
> Rendering the skipped steps instead of hiding them is deliberate. In production that gives an adjuster an audit trail: not just what ran, but what was considered and why it did not apply.

---

## Chaining in one URL (3:00 to 3:50)

**VISUAL:** The signed URL with both tasks.

**VO:**
> doc_detection and ocr go up as one signed URL, not two calls. Tasks chain, so the cleaned image pipes straight into the reader with no round trip.

**VISUAL:** `patch('read', { state: 'failed' ... })`.

**VO:**
> And failure is a state, not an exception. In a chain where step three can fail while one, two and four succeed, you need per-step status or you get "something went wrong" and no idea which something.

---

## Where it really belongs (3:50 to 4:50)

**VISUAL:** Filestack Workflows dashboard.

**VO:**
> The demo runs this from the client so you can watch it. In production it belongs in a Workflow. It survives the browser closing, which matters when someone uploads six photos on a phone and walks away. Retries stop being your problem. virus_detection only runs there anyway. And the client stops needing to know the order, which means the order can change without shipping frontend code.

**VO:**
> The client-side version is a good way to see the chain and the wrong way to run it.

---

## Close (4:50 to 5:20)

**VO:**
> Most integrations treat file processing as a set of independent features. Claim intake is where that breaks, because the value is in the sequence. Screened before touched, flattened before read, corrected before judged. Source and write-up below.

---

## Shot list

- [ ] Claim folder with mixed file types
- [ ] Four-step chain graphic with integration styles
- [ ] `planFor` in the editor
- [ ] Demo: photo branch, then document branch
- [ ] Signed URL with both tasks, held on screen
- [ ] Per-step failure state
- [ ] Workflows dashboard walkthrough
