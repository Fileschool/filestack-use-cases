/**
 * Where a demo lives publicly, and what it says about itself.
 *
 * Every app is deployed on its own and served through a rewrite under
 * filestack.com. Two questions follow, and they need different answers:
 *
 * - What URL are crawlers told? That is SITE_ORIGIN + the public path, read
 *   from NEXT_PUBLIC_SITE_ORIGIN and NEXT_PUBLIC_SITE_PATH. It never depends on
 *   the request host, so a *.vercel.app deployment still names the
 *   filestack.com page as canonical.
 * - Where does Next serve from? That is NEXT_PUBLIC_BASE_PATH, read by
 *   next.config. It is empty locally, so `next dev` keeps working on `/`.
 */

export const FILESTACK_URL = 'https://www.filestack.com/';
export const USE_CASES_URL = 'https://www.filestack.com/use-cases/';
export const REPO_URL = 'https://github.com/Fileschool/filestack-use-cases';

const DEFAULT_ORIGIN = 'https://www.filestack.com';
const DEMOS_PATH = '/use-cases/demos';

export interface IFaqItem {
  question: string;
  answer: string;
}

export interface IStep {
  name: string;
  text: string;
}

export interface IFeature {
  name: string;
  /** The Filestack task or API, as a developer would search for it. */
  task?: string;
  what: string;
}

export interface IPage {
  /** Path inside the app, as Next routes it: '/', '/demo'. */
  path: string;
  title: string;
  /** Required for every page except '/', which uses the site description. */
  description?: string;
  priority?: number;
}

export interface IDemoSite {
  /** URL segment under /use-cases/demos. Empty for the directory itself. */
  slug: string;
  /** What the demo is, in the words people search with. */
  name: string;
  /** The fictional business the demo is dressed as. */
  brand?: string;
  vertical: string;
  /** The home page title, before " | Filestack". Keep it under ~50 characters. */
  title: string;
  /** 140 to 160 characters, no colons, written for the search result. */
  description: string;
  keywords: string[];
  /** One paragraph for the "About this demo" section and llms.txt. */
  intro: string;
  /** A Filestack handle for a 1200x630 crop of the app. */
  screenshot: string;
  screenshotAlt: string;
  /** The matching marketing page on filestack.com, when there is one. */
  useCasePage?: string;
  /** Folder in the source repository. */
  sourcePath?: string;
  features: IFeature[];
  steps: IStep[];
  faq: IFaqItem[];
  /** What the demo does not do, stated plainly. Used in llms.txt. */
  limits: string[];
  /** Indexable pages. Everything else should be noindex. */
  pages: IPage[];
  themeColor: string;
}

function trimSlashes(value: string): string {
  return value.replace(/\/+$/, '');
}

export function siteOrigin(): string {
  return trimSlashes(process.env.NEXT_PUBLIC_SITE_ORIGIN || DEFAULT_ORIGIN);
}

/** The public path of a demo, e.g. /use-cases/demos/insurance. */
export function demoPath(slug: string): string {
  return slug ? `${DEMOS_PATH}/${slug}` : DEMOS_PATH;
}

/**
 * The public URL of a page in this app. NEXT_PUBLIC_SITE_PATH overrides the
 * default path when the rewrite lives somewhere else.
 */
export function siteUrl(site: Pick<IDemoSite, 'slug'>, path = '/'): string {
  const base = trimSlashes(process.env.NEXT_PUBLIC_SITE_PATH || demoPath(site.slug));
  const suffix = path === '/' ? '' : path;
  return `${siteOrigin()}${base}${suffix}`;
}

/** The public URL of another demo. Used for cross-links, so it ignores the override. */
export function otherDemoUrl(slug: string): string {
  return `${siteOrigin()}${demoPath(slug)}`;
}

/** Prefixes a same-app path with the routing base path, for fetch() and raw <a>. */
export function withBasePath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;
}

/** A Filestack CDN crop of the screenshot at the size social cards expect. */
export function ogImageUrl(handle: string): string {
  return `https://cdn.filestackcontent.com/resize=width:1200,height:630,fit:crop,align:top/output=format:png/${handle}`;
}

export const OG_IMAGE = { width: 1200, height: 630 } as const;
