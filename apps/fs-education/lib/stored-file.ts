import type { StoredFile } from "./types";

export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

/** Reads the hidden field that the Filestack picker writes its result into. */
export function parseStoredFile(
  value: FormDataEntryValue | null,
): StoredFile | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;

  try {
    const parsed = JSON.parse(value) as Partial<StoredFile>;
    if (!parsed.url || !parsed.handle) return null;
    return {
      url: parsed.url,
      handle: parsed.handle,
      name: parsed.name ?? "attachment",
      mimetype: parsed.mimetype ?? "application/octet-stream",
      size: Number(parsed.size ?? 0),
    };
  } catch {
    return null;
  }
}
