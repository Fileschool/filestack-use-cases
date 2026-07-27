import { isAnnotatable, pageImageUrl } from "@/lib/filestack";
import type { Annotation, StoredFile } from "@/lib/types";

/**
 * Shows the marked-up work: the page rendered by the Filestack Processing API
 * with the lecturer's transparent PNG overlay stacked on top of it.
 */
export function AnnotatedPages({
  file,
  annotations,
}: {
  file: StoredFile;
  annotations: Annotation[];
}) {
  if (!isAnnotatable(file.mimetype)) return null;

  const marked = annotations.filter((annotation) => annotation.overlayUrl);
  const pages = marked.length > 0 ? marked : [];

  if (pages.length === 0) return null;

  return (
    <div className="space-y-4">
      {pages.map((annotation) => (
        <figure key={annotation.id}>
          <div className="relative overflow-hidden rounded-xl border border-brand-200 bg-white">
            <img
              src={pageImageUrl(file, annotation.page)}
              alt={`Page ${annotation.page}`}
              className="block w-full"
            />
            <img
              src={annotation.overlayUrl ?? ""}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
            />
          </div>
          <figcaption className="mt-1.5 text-xs text-brand-400">
            Page {annotation.page} · marked by your lecturer
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
