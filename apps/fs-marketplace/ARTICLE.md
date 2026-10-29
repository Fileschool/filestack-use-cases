# Rescue, Don't Reject: Fixing Seller Photos in the URL with Filestack

Every marketplace sets a minimum image size, and every marketplace loses listings to it.

The seller has one photo. It was taken in a dim hallway, it is 500 pixels wide, and your upload form says no. They are not going to reshoot the sideboard. They are going to close the tab.

The usual alternative is to fix the photo yourself, which is an image pipeline: an exposure and colour correction step, a super-resolution model on a GPU, a resize service for every surface the storefront needs, storage for the derived files, and a cache in front of all of it. That is a lot of infrastructure to stop rejecting a JPEG.

This guide walks through **Saltmarket**, a secondhand furniture marketplace, and the thing worth stealing from it: **colour correction, enlargement and every storefront size are task segments in a URL, so the rescue happens on the way out of the CDN, with no server in the path.**

## What we're building

A seller uploads whatever photo they have. They see it colour-corrected with a preset that matches how it went wrong, enlarged past the catalogue minimum, and rendered at the three sizes the shop uses: a search tile, a listing card and a full view. Nothing is rejected.

The storefront itself is built the same way. Every listing image on the home page is one of two stored handles, cropped differently.

## Stack

| Layer                            | Tech                    |
| -------------------------------- | ----------------------- |
| Framework                        | Next.js 16 (App Router) |
| Upload, storage, CDN, processing | Filestack               |
| Styling                          | Tailwind v4             |
| Language                         | TypeScript              |

There is no database and no login here. The demo is one page of React state: upload a photo and see what the URL does to it. That is deliberate, because the whole point is that the processing needs no backend.

## Step 1: One key, no server

```bash
NEXT_PUBLIC_FILESTACK_API_KEY=your_api_key_here
```

That is the whole configuration, and it is worth saying why.

`enhance` and `upscale` **answer an unsigned request**. Unlike `ocr` or `doc_detection`, they need no policy and no app secret, so the entire rescue is a URL you can build in the browser and put straight into an `<img src>`. There is no API route in this app's request path at all.

In production you still lock the key down with [Security Policies](https://www.filestack.com/docs/security/): allowed origins, `image/*`, a size cap.

## Step 2: Upload

The upload is the shared picker helper used across this series, opened with `accept: ['image/*']`. It wraps the File Picker in a promise, lazily imports `filestack-js` so the SDK never ends up in a server render, and returns one trimmed record per file:

```ts
export interface IStoredFile {
  url: string;
  handle: string;
  filename: string;
  mimetype: string;
  size: number;
  uploadedAt?: string;
}
```

From here on, the handle is the only thing the app uses.

## Step 3: enhance

```ts
// src/lib/filestack.ts
export function enhanceUrl(handle: string, preset: EnhancePreset = 'auto', extra: string[] = []): string {
  return cdnUrl(handle, [`enhance=preset:${preset}`, ...extra]);
}
```

The demo offers five presets, each labelled with the kind of photo it fixes rather than the name of the algorithm:

```ts
// src/components/features/PhotoRescue.tsx
const PRESETS = [
  { value: 'auto',     label: 'Auto',     when: 'Let Filestack decide' },
  { value: 'fix_dark', label: 'Fix dark', when: 'Shot indoors without a flash' },
  { value: 'fix_tint', label: 'Fix tint', when: 'Yellow or blue colour cast' },
  { value: 'vivid',    label: 'Vivid',    when: 'Flat, washed-out product shot' },
  { value: 'outdoor',  label: 'Outdoor',  when: 'Hazy daylight photo' },
];
```

That labelling is worth copying. A seller does not know what `fix_tint` means. They do know their photo looks yellow.

The original and the corrected version sit side by side, each with its URL underneath and a copy button. Seeing the change is what makes a seller accept it. A corrected photo they can see is an easier sell than a rule they cannot satisfy.

## Step 4: upscale

```ts
/** upscale with no parameters returns exactly twice the width and height. */
export function upscaleUrl(handle: string, options: IUpscaleOptions = {}, extra: string[] = []): string {
  const parts: string[] = [];
  if (options.noise) parts.push(`noise:${options.noise}`);
  if (options.upscale === false) parts.push('upscale:false');
  const task = parts.length > 0 ? `upscale=${parts.join(',')}` : 'upscale';
  return cdnUrl(handle, [task, ...extra]);
}
```

With no parameters, `upscale` doubles the width and height. Because it doubles rather than fitting a target, work backwards from your minimum: if the catalogue needs 1000px, `upscale` rescues anything at 500px or better. Below that, ask for a better photo. Upscaling a 200px thumbnail four times over does not produce a product photo.

`noise` is the useful option for phone pictures taken in poor light, which are exactly the ones that arrive small and grainy.

## Step 5: One handle, every storefront size

```ts
const STOREFRONT = [
  { label: 'Search tile',  tasks: ['resize=width:200,height:200,fit:crop', 'output=format:webp'] },
  { label: 'Listing card', tasks: ['resize=width:400,height:300,fit:crop', 'output=format:webp'] },
  { label: 'Full view',    tasks: ['resize=width:1200,fit:max',            'output=format:webp'] },
];

const url = cdnUrl(file.handle, [`enhance=preset:${preset}`, ...size.tasks]);
```

Which produces URLs like:

```
https://cdn.filestackcontent.com/enhance=preset:fix_dark/resize=width:400,height:300,fit:crop/output=format:webp/<handle>
```

Tasks apply left to right, and the order here is right. `enhance` runs on the full-resolution original, so the correction has every pixel to work with. `resize` comes next, and `output=format:webp` comes last, so the format conversion encodes the final pixels once. Adding a breakpoint is one line in an array.

## Where the rescue should be composed

This is the part of the codebase most worth arguing about. The demo shows the two rescues **separately**, and the storefront only uses one of them.

The `enhance` section and the `upscale` section each start from the raw handle. Then the storefront sizes are built from `enhance` alone:

```ts
cdnUrl(file.handle, [`enhance=preset:${preset}`, ...size.tasks]);
```

There is no `upscale` in that chain. And the full view uses `resize=width:1200,fit:max`, which shrinks a large image to fit but will not enlarge a small one. So the 500px seller photo the whole app is built around reaches the storefront at 500px. The minimum-size problem is shown, explained, and then not solved where it matters.

The upscale preview has a quieter version of the same issue. It doubles the image and then resizes it straight back down:

```ts
upscaleUrl(file.handle, {}, ['resize=width:600,fit:max']);
```

Any photo already 600px or wider looks identical with and without the checkbox, which makes `upscale` look like it does nothing.

The fix is to compose the rescue once and build every size from that:

```ts
const MIN_WIDTH = 1000;

function rescue(preset: EnhancePreset, originalWidth: number): string[] {
  return [`enhance=preset:${preset}`, ...(originalWidth < MIN_WIDTH ? ['upscale'] : [])];
}

const url = cdnUrl(file.handle, [...rescue(preset, originalWidth), ...size.tasks]);
```

Upscale only when the original is below the minimum. The original's dimensions are one `imagesize` call away, and worth storing with the handle at upload. Doubling a photo that is already big enough costs a render and buys nothing.

## The same idea, on the home page

The storefront grid shows the opposite habit done well, and one detail that did not make it through.

Every listing tile is built from one of two stored handles, with a `resize=…,fit:crop` and a WebP conversion:

```ts
// src/app/page.tsx
const tile = (handle: string, w: number, h: number, extra: string[] = []) =>
  cdnUrl(handle, [...extra, `resize=width:${w},height:${h},fit:crop`, 'output=format:webp']);
```

Each listing also declares a `crop` value, `'top'`, `'faces'`, `'left'` and so on, clearly meant to give each tile a different framing of the shared photo. Nothing reads it. So "Ercol elm dining chairs", "Anglepoise 1227" and "Brass reading lamp" are pixel-identical. `resize` takes an `align` parameter for exactly this:

```ts
cdnUrl(handle, [`resize=width:${w},height:${h},fit:crop,align:${listing.crop}`, 'output=format:webp']);
```

`align:faces` is the one worth knowing about for marketplaces that sell anything a person might be holding or wearing.

## A note on caching

Every distinct task chain is a distinct render and a distinct cache entry. That is what makes the first request slower and every later one instant, and it is also the thing to design around.

Five presets times three sizes is fifteen cached variants per photo, before `upscale` doubles that. Pick the preset once, at listing time, store it next to the handle, and serve every view from that single chain. A UI that lets every buyer pick a preset would produce a render per buyer, all cached, none reused.

## Beyond marketplaces

| Surface                                    | Filestack feature                          |
| ------------------------------------------ | ------------------------------------------ |
| Restoring a low-resolution legacy catalogue | `upscale`                                  |
| Profile photos from bad phone cameras      | `enhance`, `resize=fit:crop,align:faces`   |
| Property and travel listings               | `enhance=preset:outdoor`                   |
| Detecting near-duplicate listings          | `phash`                                    |
| Screening seller uploads                   | `virus_detection` in a Workflow            |
| Rescuing every photo at upload time        | [Workflows](https://www.filestack.com/docs/workflows/) |

## Production checklist

- **Compose the rescue.** Build every storefront size from `enhance` plus a conditional `upscale`, not from `enhance` alone.
- **Upscale only when needed.** Check the original's dimensions and skip `upscale` when it already clears the minimum.
- **Use the `crop` values** on the home page grid by passing them to `resize` as `align`.
- **Store the preset with the handle**, and never store a transformed URL. Presets change; handles do not.
- **Cap the preset and size matrix.** Every combination is a cache entry.
- **Consider running the rescue once at upload** through a Workflow and storing the result as its own handle, if most views want the corrected version anyway.
- **Add `virus_detection`** for seller uploads.
- **Configure Security Policies**: origin lock, `image/*`, a size cap.

## Further reading

| Topic                                 | Link                                                              |
| ------------------------------------- | ----------------------------------------------------------------- |
| File Picker configuration and sources | [Pickers](https://www.filestack.com/docs/uploads/pickers/web/)     |
| Every transformation task             | [Processing API](https://www.filestack.com/docs/api/processing/)   |
| `enhance` and `upscale`               | [Intelligence](https://www.filestack.com/docs/transformations/intelligence/) |
| Chaining processing on upload         | [Workflows](https://www.filestack.com/docs/workflows/)             |
| Security policies and signed URLs     | [Security](https://www.filestack.com/docs/security/)               |

## Final thoughts

The default response to a bad seller photo is a validation rule. The rule is cheap to write and expensive to own, because every rejected upload is a listing you did not get.

- `enhance` fixes how it looks.
- `upscale` fixes how big it is.
- `resize` and `output` fix where it goes.

Each is a URL segment, and the only real design work is putting them in one chain in the right order, so the photo a buyer sees is the one you rescued.

The general shape holds well beyond marketplaces: **when user content falls short of a rule, see whether a URL can fix the content before you enforce the rule.**

Try the live demo or grab the source on GitHub.
