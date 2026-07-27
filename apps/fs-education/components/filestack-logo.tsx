/**
 * Filestack brand assets. The glyph path is the official Filestack logo
 * (a document with a folded corner and three text lines), taken from
 * https://github.com/filestack/filestack-go/blob/master/logo.svg
 * Brand orange is #EF4925 (exposed as the `accent` colour scale).
 */

const GLYPH_PATH =
  "M25,22 L25,3 L3,3 L3,29 L18,29 L18,32 L28,32 L28,22 L25,22 Z M0,0 L28,0 L28,32 L0,32 L0,0 Z M20,24 L28,24 L20,32 L20,24 Z M9,9 L19,9 L19,12 L9,12 L9,9 Z M9,14 L17,14 L17,17 L9,17 L9,14 Z M9,19 L12,19 L12,22 L9,22 L9,19 Z";

/** The bare Filestack icon in brand orange. Size it with a height class. */
export function FilestackGlyph({
  className = "h-5",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 28 32"
      fill="currentColor"
      aria-hidden
      className={`w-auto text-accent-500 ${className}`}
    >
      <path d={GLYPH_PATH} />
    </svg>
  );
}

/** The icon set inside a charcoal app-tile, for headers and hero lockups. */
export function FilestackMark({
  className = "size-10 rounded-xl",
}: {
  className?: string;
}) {
  return (
    <span className={`grid place-items-center bg-brand-900 ${className}`}>
      <FilestackGlyph className="h-[58%] text-accent-500" />
    </span>
  );
}

export function FilestackWordmark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span className={`font-bold tracking-tight text-brand-900 ${className}`}>
      file<span className="text-accent-500">stack</span>
    </span>
  );
}

export function FilestackLogo({
  markClassName,
  wordClassName = "text-lg",
}: {
  markClassName?: string;
  wordClassName?: string;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <FilestackMark className={markClassName} />
      <FilestackWordmark className={wordClassName} />
    </span>
  );
}
