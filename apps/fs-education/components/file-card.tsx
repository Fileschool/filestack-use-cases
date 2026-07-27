import Link from "next/link";

import { FileThumb } from "@/components/file-thumb";
import { downloadUrl, isAnnotatable } from "@/lib/filestack";
import { formatBytes } from "@/lib/format";
import type { StoredFile } from "@/lib/types";

type Props = {
  file: StoredFile;
  caption?: string;
  /** Shown as a primary action when the file can be drawn on. */
  annotateHref?: string;
  annotateLabel?: string;
};

export function FileCard({
  file,
  caption,
  annotateHref,
  annotateLabel = "Open in editor",
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-brand-100 bg-brand-50/50 p-4">
      <FileThumb file={file} size={64} />

      <div className="min-w-0 flex-1">
        {caption && (
          <p className="text-xs font-semibold tracking-wide text-brand-400 uppercase">
            {caption}
          </p>
        )}
        <p className="truncate text-sm font-semibold text-brand-900">
          {file.name}
        </p>
        <p className="text-xs text-brand-400">
          {file.mimetype} · {formatBytes(file.size)}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <a
          href={downloadUrl(file)}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary px-3 py-2 text-xs"
        >
          View file
        </a>
        {annotateHref && isAnnotatable(file.mimetype) && (
          <Link href={annotateHref} className="btn-primary px-3 py-2 text-xs">
            {annotateLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
