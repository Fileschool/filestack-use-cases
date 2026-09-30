import { IStoredFile, ViewFilterMode } from '@/interfaces/filestack.interface';

const CDN = 'https://cdn.filestackcontent.com';

export const FILESTACK_API_KEY = process.env.NEXT_PUBLIC_FILESTACK_API_KEY ?? '';

export function hasFilestackKey(): boolean {
  return FILESTACK_API_KEY.length > 0;
}

export function cdnUrl(handle: string, tasks: string[] = []): string {
  if (!handle) return '';
  const segments = [CDN];
  if (tasks.length > 0) {
    segments.push(tasks.join('/'));
  }
  segments.push(handle);
  return segments.join('/');
}

export function isImage(mimetype: string | null | undefined): boolean {
  return Boolean(mimetype?.startsWith('image/'));
}

export function isPdf(mimetype: string | null | undefined): boolean {
  return mimetype === 'application/pdf';
}

export function isCadOrDrawing(filename: string | null | undefined, mimetype?: string): boolean {
  if (!filename) return false;
  const lower = filename.toLowerCase();
  return (
    lower.endsWith('.dwg') ||
    lower.endsWith('.dxf') ||
    lower.endsWith('.rvt') ||
    lower.endsWith('.skp') ||
    lower.endsWith('.bim') ||
    isPdf(mimetype)
  );
}

/**
 * Filestack Document Previewer URL
 * Embeddable iframe for viewing CAD drawings, PDFs, and Office docs directly
 */
export function getFilestackPreviewUrl(handle: string): string {
  return `https://cdn.filestackcontent.com/preview/${handle}`;
}

/**
 * Generates transformed CDN URL for architectural blueprint view mode
 */
export function getFilestackTransformedUrl(
  file: IStoredFile,
  options: {
    filter?: ViewFilterMode;
    rotate?: number;
    width?: number;
    page?: number;
  } = {}
): string {
  const tasks: string[] = [];

  // PDF output conversion task
  if (isPdf(file.mimetype)) {
    const page = options.page ?? 1;
    tasks.push(`output=format:png,page:${page},density:150`);
  }

  // Rotation task
  if (options.rotate && options.rotate > 0) {
    tasks.push(`rotate=deg:${options.rotate}`);
  }

  // Filter effect task (monochrome/blueprint style)
  if (options.filter === 'blueprint') {
    tasks.push('monochrome');
  } else if (options.filter === 'grayscale') {
    tasks.push('blackwhite');
  } else if (options.filter === 'contrast') {
    tasks.push('enhance');
  }

  // Sizing task
  const width = options.width ?? 1600;
  tasks.push(`resize=width:${width},fit:max`);

  return cdnUrl(file.handle, tasks);
}

/**
 * Square thumbnail preview for list views
 */
export function getFilestackThumbnailUrl(file: IStoredFile, size = 200): string {
  if (!file?.handle) return '';

  if (isPdf(file.mimetype)) {
    return cdnUrl(file.handle, [
      'output=format:png,page:1,density:72',
      `resize=width:${size},height:${size},fit:crop`,
    ]);
  }

  if (isImage(file.mimetype)) {
    return cdnUrl(file.handle, [`resize=width:${size},height:${size},fit:crop`]);
  }

  // Return standard preview for documents
  return cdnUrl(file.handle, [`resize=width:${size},height:${size},fit:crop`]);
}

export function getDownloadUrl(file: IStoredFile): string {
  return cdnUrl(file.handle, ['cache=expiry:max']);
}
