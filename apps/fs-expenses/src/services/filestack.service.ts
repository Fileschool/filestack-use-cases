import type { Client, PickerFileMetadata, PickerOptions } from 'filestack-js';

import { FILESTACK_API_KEY } from '@/lib/filestack';
import { IStoredFile } from '@/interfaces/filestack.interface';

let clientPromise: Promise<Client> | null = null;

/**
 * Loads filestack-js lazily. The SDK touches `window` on import, so it must
 * never be pulled into a server render.
 */
export function getFilestackClient(): Promise<Client> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Filestack client can only be initialized on client-side'));
  }
  clientPromise ??= import('filestack-js').then((mod) => mod.init(FILESTACK_API_KEY));
  return clientPromise;
}

export function formatPickerMetadata(file: PickerFileMetadata): IStoredFile {
  return {
    url: file.url,
    handle: file.handle,
    filename: file.filename ?? 'upload',
    mimetype: file.mimetype ?? 'application/octet-stream',
    size: file.size ?? 0,
    uploadedAt: new Date().toISOString(),
  };
}

/** Opens the picker and resolves with whatever was uploaded. */
export async function pickFiles(options: Partial<PickerOptions> = {}): Promise<IStoredFile[]> {
  const client = await getFilestackClient();

  return new Promise<IStoredFile[]>((resolve, reject) => {
    client
      .picker({
        fromSources: ['local_file_system', 'url', 'googledrive', 'dropbox', 'onedrive'],
        ...options,
        onUploadDone: (response) => {
          resolve((response.filesUploaded ?? []).map(formatPickerMetadata));
        },
        onCancel: () => resolve([]),
        onFileUploadFailed: (_file, error) => reject(error),
      })
      .open()
      .catch(reject);
  });
}

/**
 * Asks our own API route to build a signed CDN URL. The app secret stays on
 * the server; the browser only ever receives a finished URL.
 */
export async function requestSignedUrl(handle: string, tasks: string[]): Promise<string> {
  const response = await fetch('/api/filestack/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle, tasks }),
  });

  if (!response.ok) {
    const detail = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(detail.error ?? `Could not sign request (${response.status})`);
  }

  const { url } = (await response.json()) as { url: string };
  return url;
}
