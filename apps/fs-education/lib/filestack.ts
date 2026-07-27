/**
 * Filestack URL helpers. Safe to import from both server and client components:
 * the only environment variable read here is the public API key.
 *
 * Processing API reference: https://www.filestack.com/docs/api/processing/
 */
const CDN = "https://cdn.filestackcontent.com";

export const FILESTACK_API_KEY =
  process.env.NEXT_PUBLIC_FILESTACK_API_KEY ?? "";

export function hasFilestackKey(): boolean {
  return FILESTACK_API_KEY.length > 0;
}

/** `https://cdn.filestackcontent.com/<key>/<tasks>/<handle>` */
function cdnUrl(handle: string, tasks: string[] = []): string {
  const segments = [CDN];
  if (FILESTACK_API_KEY) segments.push(FILESTACK_API_KEY);
  segments.push(...tasks, handle);
  return segments.join("/");
}

export function isImage(mimetype: string | null | undefined): boolean {
  return Boolean(mimetype?.startsWith("image/"));
}

export function isPdf(mimetype: string | null | undefined): boolean {
  return mimetype === "application/pdf";
}

/** Only images and PDFs can be opened in the marking editor. */
export function isAnnotatable(mimetype: string | null | undefined): boolean {
  return isImage(mimetype) || isPdf(mimetype);
}

/**
 * A raster image of the file, suitable for drawing on top of. PDFs are
 * rendered a page at a time by the `output` task; images are just resized.
 */
export function pageImageUrl(
  file: { handle: string; mimetype: string },
  page = 1,
): string {
  if (isPdf(file.mimetype)) {
    return cdnUrl(file.handle, [
      `output=format:png,page:${page},density:150`,
      "resize=width:1600,fit:max",
    ]);
  }
  return cdnUrl(file.handle, ["resize=width:1600,fit:max"]);
}

/** Small square preview for list rows and cards. */
export function thumbnailUrl(
  file: { handle: string; mimetype: string },
  size = 160,
): string {
  if (isPdf(file.mimetype)) {
    return cdnUrl(file.handle, [
      "output=format:png,page:1,density:72",
      `resize=width:${size},height:${size},fit:crop`,
    ]);
  }
  return cdnUrl(file.handle, [
    `resize=width:${size},height:${size},fit:crop`,
  ]);
}

export function downloadUrl(file: { handle: string }): string {
  return cdnUrl(file.handle, ["cache=expiry:max"]);
}

/**
 * Page count for a PDF via the `pdfinfo` task. Returns null when the task is
 * unavailable (for example document processing is not enabled on the account),
 * in which case the editor lets the lecturer page through manually.
 */
export async function getPdfPageCount(handle: string): Promise<number | null> {
  try {
    const response = await fetch(cdnUrl(handle, ["pdfinfo"]), {
      // Page counts never change for a given handle.
      cache: "force-cache",
    });
    if (!response.ok) return null;
    const info: unknown = await response.json();
    const pages = (info as { pages?: unknown })?.pages;
    return typeof pages === "number" && pages > 0 ? pages : null;
  } catch {
    return null;
  }
}
