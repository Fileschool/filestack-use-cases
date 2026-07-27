import type { Client, PickerFileMetadata } from "filestack-js";

import { FILESTACK_API_KEY } from "./filestack";
import type { StoredFile } from "./types";

let clientPromise: Promise<Client> | null = null;

/**
 * Loads filestack-js lazily. The SDK touches `window` on import, so it must
 * never be pulled into a server render.
 */
export function filestackClient(): Promise<Client> {
  clientPromise ??= import("filestack-js").then((mod) =>
    mod.init(FILESTACK_API_KEY),
  );
  return clientPromise;
}

export function toStoredFile(file: PickerFileMetadata): StoredFile {
  return {
    url: file.url,
    handle: file.handle,
    name: file.filename,
    mimetype: file.mimetype,
    size: file.size ?? 0,
  };
}

/** Uploads a canvas export (the annotation overlay) straight to Filestack. */
export async function uploadImageBlob(
  blob: Blob,
  filename: string,
): Promise<StoredFile> {
  const client = await filestackClient();
  const file = new File([blob], filename, { type: blob.type || "image/png" });
  const result = await client.upload(file);

  return {
    url: result.url,
    handle: result.handle,
    name: result.filename ?? filename,
    mimetype: result.mimetype ?? "image/png",
    size: result.size ?? blob.size,
  };
}
