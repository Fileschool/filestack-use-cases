/**
 * Imagery for this site, stored in Filestack and served from its CDN.
 * These are handles, not files: every size on the page is built from them.
 */
export const MEDIA = {
  hero: 'Qa4MDvbYTvOAuEhNBrXN',
  heritage: 'qBP10UQdReCe8hHGgGsO',
} as const;

/** Files attached to the seeded claims, so the desk opens with real work on it. */
export const CLAIM_MEDIA = {
  property: 'Qa4MDvbYTvOAuEhNBrXN',
  repair: 'oWjH9CZfSsq7KsA1Hq8R',
  survey: 'yrcbFC8LQNug9fiVxPxM',
  paperwork: 'wCxhSgYcRkuMqquub0wd',
} as const;
