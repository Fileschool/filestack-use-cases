# Video script: Hollis

**Working title:** Not every Filestack task is a URL
**Target runtime:** 5 to 6 minutes
**Audience:** Developers integrating file uploads who have not met Workflows

---

## Cold open (0:00 to 0:30)

**VISUAL:** An inbox of applications. A CV attachment. Cursor hovers over it.

**VO:**
> A recruitment pipeline is a stream of documents from strangers, opened by non-technical staff, on machines with access to personal data. It is one of the softest targets in any company, and the attack is old and boring. Attach something to a plausible application and wait.

**VISUAL:** The demo, attachment locked with a scanning badge.

**VO:**
> So this attachment does not open until it has been screened. Here is why that changes the architecture.

---

## The core point (0:30 to 1:50)

**VISUAL:** Two-column table on screen: URL task vs Workflows task.

**VO:**
> Most Filestack tasks are synchronous. Build a URL, get a result. virus_detection is not one of them. Straight from the docs: this task is only available at Filestack Workflows. It runs after the file lands in storage, asynchronously, and the verdict comes back by webhook.

**VO:**
> That is not a limitation. Scanning is slow and the answer has to be authoritative before anyone opens the file. You cannot make that a fetch from a browser. But it does mean the integration looks different: configured in the dashboard, not in your code, and the result arrives somewhere you have to be listening.

---

## Receiving the verdict (1:50 to 3:00)

**VISUAL:** `virus-webhook/route.ts`.

**VO:**
> The payload is an infected boolean and a list of detections. Workflows nests task output under whatever you named the task in the dashboard, so this route accepts both the flat shape and the per-task shape.

**VISUAL:** Highlight the `body.data ?? Object.values(body.results...)` line.

**VO:**
> That one line saves you an afternoon when your task name and your parser disagree.

---

## Locking the UI (3:00 to 4:00)

**VISUAL:** `CandidateReview.tsx`, the `locked` derivation.

**VO:**
> The verdict is the gate, and the default is locked. An attachment whose scan has not returned is not probably fine. It is unknown, and the entire point is that nobody opens an unknown file.

**VISUAL:** Demo: upload, locked state, then unlock.

**VO:**
> When no workflow is configured the demo says so explicitly rather than silently unlocking, because failing open is the one behaviour that would defeat the feature.

---

## Reading without downloading (4:00 to 4:50)

**VISUAL:** The preview iframe, then `previewUrl` in the editor.

**VO:**
> Once it clears, the CV opens in an embedded preview. One iframe, no pdf.js, no viewer library, and the file is never written to the recruiter's disk. For a document from a stranger, rendering server side and shipping pixels is a much smaller attack surface than handing the bytes to a desktop application.

**VISUAL:** Click "Extract with ocr", text appears.

**VO:**
> And ocr makes the pipeline searchable, including for CVs that arrive as scans, which is exactly the case a text-extraction library fails on silently.

---

## Close (4:50 to 5:30)

**VO:**
> The lesson here is not about recruitment. Filestack has two shapes of capability and picking the wrong one is the most common integration mistake. Anything that transforms bytes is a URL. Anything that has to be authoritative before a human acts is a Workflow, which means a webhook, a stored verdict, and a UI that defaults to locked. Source and write-up below.

---

## Shot list

- [ ] Inbox with a CV attachment
- [ ] URL task vs Workflows comparison graphic
- [ ] Filestack dashboard: adding the virus detection task (screen record)
- [ ] `virus-webhook/route.ts` with the dual-shape line held
- [ ] `locked` derivation in the editor
- [ ] Demo: locked, then unlocked
- [ ] Preview iframe with OCR extraction
