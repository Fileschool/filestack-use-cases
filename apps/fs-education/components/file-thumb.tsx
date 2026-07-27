import { isImage, isPdf, thumbnailUrl } from "@/lib/filestack";
import type { StoredFile } from "@/lib/types";

function extension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? (parts.pop() ?? "").toUpperCase() : "FILE";
}

export function FileThumb({
  file,
  size = 56,
}: {
  file: StoredFile;
  size?: number;
}) {
  if (isImage(file.mimetype) || isPdf(file.mimetype)) {
    return (
      <img
        src={thumbnailUrl(file, size * 2)}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-lg bg-white object-cover ring-1 ring-brand-200"
      />
    );
  }

  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className="grid shrink-0 place-items-center rounded-lg bg-brand-100 text-[10px] font-bold text-brand-600 ring-1 ring-brand-200"
    >
      {extension(file.name)}
    </span>
  );
}
