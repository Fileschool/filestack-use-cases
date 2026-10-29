import { llmsResponse } from '@repo/seo';
import { SITE } from '@/lib/seo';

export const dynamic = 'force-static';

/** A plain-text summary for answer engines, built from the same data as the page. */
export function GET() {
  return llmsResponse(SITE);
}
