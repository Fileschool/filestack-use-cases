# Video script: Saltmarket

**Working title:** Stop rejecting bad seller photos, fix them in the URL
**Target runtime:** 4 to 5 minutes
**Audience:** Developers building marketplaces, storefronts or any UGC image flow

---

## Cold open (0:00 to 0:25)

**VISUAL:** Upload form. A small, dim product photo. Red validation: "Image must be at least 1000px wide."

**VO:**
> Every marketplace has this rule, and every marketplace loses listings to it. The seller has one photo. It is 500 pixels wide and it was taken indoors. They are not going to re-shoot it. They are going to close the tab.

**VISUAL:** Same photo, corrected and enlarged, sitting in a catalogue grid.

**VO:**
> Two URL segments and that photo is catalogue ready.

---

## What we're building (0:25 to 0:50)

**VISUAL:** Saltmarket demo, upload to storefront grid.

**VO:**
> A peer-to-peer marketplace that rescues the photo instead of rejecting it, then serves it at every size the storefront needs. All from one upload.

---

## No server at all (0:50 to 1:30)

**VISUAL:** `.env` with a single variable.

**VO:**
> One key. That is the whole configuration, and it is worth saying why. enhance and upscale answer unsigned requests. Unlike ocr or doc_detection they need no policy and no app secret, so the entire rescue pipeline is a URL you build in the browser and drop into an img tag. No API route. No round trip.

---

## enhance (1:30 to 2:30)

**VISUAL:** Demo, cycling presets with before and after side by side.

**VO:**
> enhance takes a preset, and the presets map onto the ways seller photos actually fail. fix_dark for indoors without a flash. fix_tint for a colour cast. vivid for a flat product shot. outdoor for haze. Or auto when you do not know.

**VISUAL:** URL bar updating live with each preset.

**VO:**
> Show the seller the before and after. They are far more likely to accept a corrected photo they can see than a rule they cannot satisfy.

---

## upscale (2:30 to 3:15)

**VISUAL:** Toggle upscale on. Dimensions readout doubles.

**VO:**
> upscale with no parameters returns exactly twice the width and height, and keeps a PNG's transparency. So a 500 pixel photo clears a 1000 pixel minimum without the seller doing anything.

**VO:**
> Because it doubles rather than fitting a target, work backwards from your minimum. If you need 1000, upscale rescues anything from 500 up.

---

## One handle, every size (3:15 to 4:05)

**VISUAL:** Three storefront sizes rendering, each with its URL visible.

**VO:**
> Now the same rescued photo feeds the search tile, the listing card and the full view. Each one is the same handle with a different chain appended, and enhance goes first so every size comes from the corrected image.

**VISUAL:** Add a fourth preset in the editor, save, new size appears.

**VO:**
> Adding a breakpoint is one line. No worker pool, no re-upload.

---

## Caching caveat (4:05 to 4:35)

**VO:**
> One thing to design around. Every distinct chain is a separate render and a separate cache entry. That is what makes the second request instant. It is also why you should pick a small set of presets and sizes, rather than giving sellers a quality slider that mints a new render per pixel of travel.

---

## Close (4:35 to 5:00)

**VO:**
> The default answer to a bad seller photo is a validation rule. Rules are cheap to write and expensive to own, because every rejection is a listing you did not get. Source and write-up below.

---

## Shot list

- [ ] Upload form with a red size-validation error
- [ ] Preset cycling with live before and after
- [ ] URL bar updating per preset
- [ ] Upscale toggle with dimensions readout
- [ ] Three storefront sizes with URLs
- [ ] Editor: add a preset, save, it appears
