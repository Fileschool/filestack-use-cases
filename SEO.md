# SEO notes for the filestack.com demo rewrites

Each app in `apps/` is deployed on its own and served publicly through a
rewrite under `https://www.filestack.com/use-cases/demos/`. The rewrite is an
advantage: the demos sit on filestack.com and inherit its authority. Most of
what makes them rank is done inside this repository. The rest has to happen on
filestack.com, and it is listed here.

## What the apps already do

Every app gets the same treatment from the shared `packages/seo` package, fed
by one content file per app (`src/lib/seo.ts`, or `lib/seo.ts` in the older
apps):

- A title, description and keywords written for the search the demo answers,
  framed as a Filestack demo rather than the fictional brand.
- A canonical URL that always names the filestack.com page, whatever host
  serves the request.
- Open Graph and Twitter cards with a 1200x630 screenshot served from the
  Filestack CDN.
- One JSON-LD `@graph`: `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`,
  `WebApplication`, `SoftwareSourceCode`, `HowTo` and `FAQPage`. The directory
  uses `CollectionPage` and `ItemList` instead.
- A visible "About this demo" section on the home page: features, steps, FAQ
  and links to every other demo. FAQ answers stay in the DOM when collapsed,
  and they are the same strings as the `FAQPage` schema.
- `sitemap.xml` and `llms.txt`, generated from the same content file.
- `noindex` on sign-in screens, staff queues, user uploads and the fictional
  brand pages (contacts, agents and so on), with no inherited canonical.

## 1. The rewrites

| Public path                              | App              |
| ---------------------------------------- | ---------------- |
| `/use-cases/demos`                       | `fs-directory`   |
| `/use-cases/demos/insurance`             | `fs-insurance`   |
| `/use-cases/demos/recruitment`           | `fs-recruitment` |
| `/use-cases/demos/legal`                 | `fs-legal`       |
| `/use-cases/demos/mailroom`              | `fs-mailroom`    |
| `/use-cases/demos/expenses`              | `fs-expenses`    |
| `/use-cases/demos/marketplace`           | `fs-marketplace` |
| `/use-cases/demos/construction`          | `fs-construction`|
| `/use-cases/demos/education`             | `fs-education`   |
| `/use-cases/demos/real-estate`           | `fs-realestate`  |
| `/use-cases/demos/file-sharing`          | `fs-filesharing` |

Each rewrite has to forward the **whole path**, sub-path included, because each
app is built with that sub-path as its `basePath`:

```
/use-cases/demos/insurance/:path*  ->  https://<insurance-deployment>/use-cases/demos/insurance/:path*
```

On each Vercel project, set:

```
NEXT_PUBLIC_BASE_PATH=/use-cases/demos/insurance
```

`NEXT_PUBLIC_BASE_PATH` controls routing and must match the rewrite.
`NEXT_PUBLIC_SITE_PATH` controls what crawlers are told and defaults to the
same path, so it only needs setting if the public path changes. Keep them
separate: pointing the canonical at a Vercel URL tells Google not to index the
real page, and setting `basePath` locally 404s every dev run.

If the paths above are not where the demos will live, change the default in
`packages/seo/src/site.ts` (`DEMOS_PATH`) and the slugs in each `seo.ts`. Every
URL in the metadata, schema, sitemaps and cross-links follows from those.

## 2. robots.txt must live at the filestack.com root

Crawlers only read `https://www.filestack.com/robots.txt`. The apps do not
ship one for that reason. The current file (Yoast) is permissive, which is
fine:

```
User-agent: *
Disallow:

Sitemap: https://www.filestack.com/sitemap_index.xml
```

Two additions worth making:

- The demo sitemaps, either as `Sitemap:` lines or as entries in the Yoast
  sitemap index (see section 3).
- The answer-engine crawlers, named explicitly. They are not covered reliably by
  `User-agent: *` behind every CDN, and they are how a demo gets quoted in an
  AI answer:

```
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-User
User-agent: Claude-SearchBot
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
User-agent: Meta-ExternalAgent
Allow: /
```

## 3. The demos are not in the sitemap

`https://www.filestack.com/sitemap_index.xml` lists no `/use-cases/demos/`
URLs. A page that is not in the sitemap and has no internal links pointing at
it is found slowly, if at all.

Each app serves its own sitemap at `<public path>/sitemap.xml`, for example
`https://www.filestack.com/use-cases/demos/insurance/sitemap.xml`. Add all
eleven to the sitemap index, or to `robots.txt` as `Sitemap:` lines.

## 4. Internal links from filestack.com

Internal links are the cheapest ranking lever available, and right now there
are none. In priority order:

1. Link `/use-cases/demos` from the filestack.com navigation or footer, next to
   the existing use-case pages.
2. Link each demo from its matching marketing page. The demos already link
   back:

   | Marketing page                                                    | Demo              |
   | ----------------------------------------------------------------- | ----------------- |
   | `/use-cases/real-estate-file-management/`                         | `real-estate`     |
   | `/use-cases/education-file-management/`                           | `education`       |
   | `/use-cases-file-uploads-delivery/fireshare-file-sharing-app-built-with-filestack/` | `file-sharing` |
   | `/use-cases/claims-intake-automation/`                            | `insurance`       |

3. Link demos from the relevant docs pages, for example `ocr` to the expenses
   demo, `envelope_ocr` to the mailroom, `virus_detection` to recruitment and
   security policies to legal.

`/use-cases/claims-intake-automation/` currently returns 404. The insurance
demo links to it, so publish the page before the demo goes live, or remove
`useCasePage` from `apps/fs-insurance/src/lib/seo.ts` until it exists.

## 5. llms.txt

`https://www.filestack.com/llms.txt` exists but does not mention the demos.
Each app serves its own at `<public path>/llms.txt`. Add a section to the root
file listing them, so answer engines that start at the root can find them:

```
## Demo applications

- [All demos](https://www.filestack.com/use-cases/demos/llms.txt)
- [Claims intake automation](https://www.filestack.com/use-cases/demos/insurance/llms.txt)
- …one line per demo
```

## 6. Keep the Vercel origins out of the index

If a `*.vercel.app` deployment answers publicly, it is a duplicate of the
filestack.com page on another host. The canonical on every page already names
filestack.com, because `packages/seo` reads the public origin from an
environment variable, not from the request host. For a cleaner result, turn on
Vercel Deployment Protection for production deployments that are only reached
through the rewrite.

Do not solve this with an `X-Robots-Tag: noindex` header on the Vercel host.
Most proxies forward the rewritten request to Vercel under the Vercel
hostname, so a host-matched header would usually follow the response through
to filestack.com and de-index the real page.

## 7. Ranking, honestly

- **Head terms are close to unwinnable.** "OCR API" and "file upload API" are
  owned by documentation and comparison pages. The demos are written for the
  long tail: "receipt OCR with bounding boxes", "envelope OCR", "scan CV
  uploads for viruses", "expiring signed URLs", "brighten dark product photos
  API". Each FAQ entry is one of those questions.
- **Each demo's H1 is still the fictional brand's headline.** The query the
  demo answers is in the title, the description and the "About this demo"
  heading, which is enough for the long tail. If a demo should compete for a
  broader term, change its H1 to carry that term.
- **Google shows FAQ rich results only for government and health sites.** The
  `FAQPage` schema will not produce a rich result for filestack.com. It is
  still read by answer engines and is harmless to keep.

## Checklist for a new demo

1. Add the app's slug, name and summary to `packages/seo/src/demos.ts`.
2. Write `src/lib/seo.ts`: title under ~50 characters, a 140 to 160 character
   description with no colons, five or six FAQ entries that are true of the
   code, and the indexable pages.
3. Root layout: `rootMetadata(SITE)` and `viewport(SITE)`.
4. Home page: `<JsonLd site={SITE} />` and `<DemoAbout site={SITE} />` before
   the footer.
5. Other indexable pages: `pageMetadata(SITE, '/path')`. Everything else:
   `noindex`, through a segment `layout.tsx` if the page is a client component.
6. `app/sitemap.ts` and `app/llms.txt/route.ts`, copied from any other app.
7. `next.config`: `basePath` from `NEXT_PUBLIC_BASE_PATH` and
   `transpilePackages: ['@repo/seo']`. Wrap any root-relative `fetch()` in
   `withBasePath()`.
8. Render any content that matters on the server. A headline that only mounts
   after an effect is invisible to crawlers.
9. Add the rewrite, the sitemap and an internal link on filestack.com.
