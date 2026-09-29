# Stop Rejecting Seller Photos: enhance and upscale in a Marketplace

Every marketplace sets a minimum image size, and every marketplace loses listings to it.

The seller has one photo. It was taken indoors, it is 500 pixels wide, and your upload form says no. They are not going to re-shoot it. They are going to close the tab.

This guide walks through **Saltmarket**, and the idea worth stealing: **rescue the photo instead of rejecting it**, in the URL, on the way in.

## What we're building

A peer-to-peer marketplace where the seller uploads whatever they have. The photo is colour-corrected, enlarged past the catalogue minimum, and served at every size the storefront needs. The seller never sees an error.

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Upload, storage, CDN, processing | Filestack |
| Server state | TanStack Query |
| Client state | Zustand |
| Styling | Tailwind v4 |
| Language | TypeScript |

## Step 1: One key, no server

```bash
NEXT_PUBLIC_FILESTACK_API_KEY=your_api_key_here
```

That is the whole configuration, and it is worth saying why.

`enhance` and `upscale` **answer an unsigned request**. Unlike `ocr` and `doc_detection`, they need no policy and no app secret, which means the entire rescue pipeline is a URL you can build in the browser and put straight into an `<img src>`. No API route, no server round trip.

## Step 2: enhance

```ts
export function enhanceUrl(handle: string, preset: EnhancePreset = 'auto', extra: string[] = []): string {
  return cdnUrl(handle, [`enhance=preset:${preset}`, ...extra]);
}
```

The presets map onto the ways seller photos actually fail:

| Preset | The photo it fixes |
| --- | --- |
| `fix_dark` | Shot indoors without a flash |
| `fix_tint` | Yellow or blue colour cast from bad lighting |
| `vivid` | Flat, washed-out product shot |
| `outdoor` | Hazy daylight |
| `auto` | You do not know which, let Filestack decide |

Show the original and the result side by side. The seller is far more likely to accept a corrected photo they can see than a rule they cannot satisfy.

## Step 3: upscale

```ts
export function upscaleUrl(handle: string, options: IUpscaleOptions = {}, extra: string[] = []): string {
  const parts: string[] = [];
  if (options.noise) parts.push(`noise:${options.noise}`);
  if (options.upscale === false) parts.push('upscale:false');
  const task = parts.length > 0 ? `upscale=${parts.join(',')}` : 'upscale';
  return cdnUrl(handle, [task, ...extra]);
}
```

With no parameters, `upscale` returns **exactly twice** the width and height, keeping a PNG's transparency intact. A 500px photo clears a 1000px minimum without the seller doing anything.

Because it doubles rather than fitting a target, work backwards: if your minimum is 1000px, `upscale` rescues anything at 500px or better. Below that, chain it twice or ask for a better photo.

## Step 4: One handle, every size

```ts
const STOREFRONT = [
  { label: 'Search tile',  tasks: ['resize=width:200,height:200,fit:crop', 'output=format:webp'] },
  { label: 'Listing card', tasks: ['resize=width:400,height:300,fit:crop', 'output=format:webp'] },
  { label: 'Full view',    tasks: ['resize=width:1200,fit:max',            'output=format:webp'] },
];
```

Each of those is the rescued photo with a different chain appended:

```ts
const url = cdnUrl(file.handle, [`enhance=preset:${preset}`, ...size.tasks]);
```

Put `enhance` first so every size is generated from the corrected image. Adding a breakpoint is one line and no infrastructure.

## A note on caching

Every distinct task chain is a distinct render and a distinct cache entry. That is what makes the first request slower and every subsequent one instant, and it is also the thing to design around.

Pick a small set of presets and sizes and stick to them. A UI that lets a seller drag a quality slider produces a new render per pixel of travel, all cached, none reused.

## Beyond marketplaces

| Surface | Task |
| --- | --- |
| Restoring a low-res legacy catalogue | `upscale` |
| User avatars from bad phone photos | `enhance`, `resize=fit:crop` |
| Property and travel listings | `enhance=preset:outdoor` |
| Screening seller uploads | `virus_detection` via Workflows |

## Production checklist

- Cap the preset and size matrix. Every combination is a cache entry.
- Store the handle, never a transformed URL. Presets change; handles do not.
- Consider running `enhance` once at upload through a Workflow and storing that handle, if most views want the corrected version anyway.
- Add `virus_detection` for seller uploads.
- Configure Security Policies: origin lock, `image/*`, a size cap.

## Final thoughts

The default response to a bad seller photo is a validation rule. The rule is cheap to write and expensive to own, because every rejected upload is a listing you did not get.

`enhance` and `upscale` are two URL segments that turn a rejection into a rescue. No model to host, no worker pool, and no server in the path at all.
