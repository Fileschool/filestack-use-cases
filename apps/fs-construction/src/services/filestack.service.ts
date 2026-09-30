import type { Client, PickerFileMetadata } from 'filestack-js';
import { FILESTACK_API_KEY } from '@/lib/filestack';
import { IStoredFile } from '@/interfaces/filestack.interface';

let clientPromise: Promise<Client> | null = null;

export function getFilestackClient(): Promise<Client> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Filestack client can only be initialized on client-side'));
  }

  clientPromise ??= import('filestack-js').then((mod) =>
    mod.init(FILESTACK_API_KEY)
  );

  return clientPromise;
}

export function formatPickerMetadata(file: PickerFileMetadata): IStoredFile {
  return {
    url: file.url,
    handle: file.handle,
    filename: file.filename || 'cad-design-file',
    mimetype: file.mimetype || 'application/octet-stream',
    size: file.size || 0,
    uploadDate: new Date().toISOString(),
  };
}
