import { FilestackGlyph } from '@/components/ui/FilestackLogo';

/**
 * The bar that says this is a Filestack use case rather than a real firm.
 * Sits above the client's own masthead on every page.
 */
export function FilestackStrip({ features }: { features: string }) {
  return (
    <div className="relative z-[60] flex h-8 items-center justify-center gap-3 bg-[#0a0a0a] px-4 text-[10px] font-medium tracking-wider text-white">
      <FilestackGlyph className="h-3.5" />
      <span className="uppercase opacity-60">Filestack use case</span>
      <span className="text-white/20">·</span>
      <span className="hidden opacity-60 sm:inline">{features}</span>
      <span className="hidden text-white/20 sm:inline">·</span>
      <a
        href="https://github.com/Fileschool/filestack-use-cases"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden opacity-60 underline-offset-2 transition hover:opacity-100 hover:underline sm:inline"
      >
        Source
      </a>
      <span className="hidden text-white/20 sm:inline">·</span>
      <a
        href="https://www.filestack.com/signup-start/"
        target="_blank"
        rel="noopener noreferrer"
        className="opacity-60 underline-offset-2 transition hover:opacity-100 hover:underline"
      >
        Get an API key
      </a>
    </div>
  );
}
