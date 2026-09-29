/**
 * Filestack URL helpers. Safe to import from server and client: the only
 * environment variable read here is the public API key.
 *
 * Processing API: https://www.filestack.com/docs/api/processing/
 * Intelligence:   https://www.filestack.com/docs/transformations/intelligence/
 */
import {
  EnhancePreset,
  ISignedTask,
  IStoredFile,
  IUpscaleOptions,
} from '@/interfaces/filestack.interface';

export const CDN = 'https://cdn.filestackcontent.com';

export const FILESTACK_API_KEY = process.env.NEXT_PUBLIC_FILESTACK_API_KEY ?? '';

export function hasFilestackKey(): boolean {
  return FILESTACK_API_KEY.length > 0;
}

export function isImage(mimetype?: string | null): boolean {
  return Boolean(mimetype?.startsWith('image/'));
}

export function isPdf(mimetype?: string | null): boolean {
  return mimetype === 'application/pdf';
}

/** `https://cdn.filestackcontent.com/<tasks>/<handle>` */
export function cdnUrl(handle: string, tasks: string[] = []): string {
  if (!handle) return '';
  const segments = [CDN];
  if (tasks.length > 0) segments.push(tasks.join('/'));
  segments.push(handle);
  return segments.join('/');
}

// ---------------------------------------------------------------------------
// Unsigned tasks. enhance and upscale answer an unsigned request, so these can
// be built in the browser and dropped straight into an <img src>.
// ---------------------------------------------------------------------------

export function enhanceUrl(
  handle: string,
  preset: EnhancePreset = 'auto',
  extra: string[] = []
): string {
  return cdnUrl(handle, [`enhance=preset:${preset}`, ...extra]);
}

/** upscale with no parameters returns exactly twice the width and height. */
export function upscaleUrl(
  handle: string,
  options: IUpscaleOptions = {},
  extra: string[] = []
): string {
  const parts: string[] = [];
  if (options.noise) parts.push(`noise:${options.noise}`);
  if (options.upscale === false) parts.push('upscale:false');
  const task = parts.length > 0 ? `upscale=${parts.join(',')}` : 'upscale';
  return cdnUrl(handle, [task, ...extra]);
}

export function thumbnailUrl(file: IStoredFile, size = 240): string {
  if (!file?.handle) return '';
  if (isPdf(file.mimetype)) {
    return cdnUrl(file.handle, [
      'output=format:png,page:1,density:72',
      `resize=width:${size},height:${size},fit:crop`,
    ]);
  }
  return cdnUrl(file.handle, [`resize=width:${size},height:${size},fit:crop`]);
}

export function pageImageUrl(file: IStoredFile, page = 1, width = 1600): string {
  if (isPdf(file.mimetype)) {
    return cdnUrl(file.handle, [
      `output=format:png,page:${page},density:150`,
      `resize=width:${width},fit:max`,
    ]);
  }
  return cdnUrl(file.handle, [`resize=width:${width},fit:max`]);
}

export function downloadUrl(file: IStoredFile): string {
  return cdnUrl(file.handle, ['cache=expiry:max']);
}

/** The hosted document previewer. One iframe, no viewer library. */
export function previewUrl(handle: string): string {
  return `${CDN}/preview/${handle}`;
}

// ---------------------------------------------------------------------------
// Signed tasks. ocr, envelope_ocr and doc_detection reject unsigned requests.
// ---------------------------------------------------------------------------

/** Serialises a signed task into its URL segment. */
export function signedTaskSegment(spec: ISignedTask): string {
  if (spec.task === 'doc_detection') {
    return `doc_detection=coords:${spec.coords ?? false},preprocess:${spec.preprocess ?? true}`;
  }
  return spec.task;
}

/**
 * Composites another Filestack file over this one. Used to stamp a preview
 * with the name of the person it was issued to, so a screenshot stays
 * attributable. https://www.filestack.com/docs/api/processing/#watermark
 */
export function watermarkUrl(
  handle: string,
  overlayHandle: string,
  before: string[] = [],
  size = 100
): string {
  return cdnUrl(handle, [
    ...before,
    `watermark=file:${overlayHandle},size:${size},position:[middle,center]`,
  ]);
}
