import { FilestackLogo } from '@/components/ui/FilestackLogo';

/** The "powered by" block that closes every page. */
export function FilestackFooter({
  firm,
  blurb,
  chain,
}: {
  firm: string;
  blurb: string;
  chain: string;
}) {
  return (
    <div className="bg-[#0a0a0a] px-5 py-12 text-white sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <a
              href="https://www.filestack.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded border border-white/10 px-4 py-2.5 transition hover:border-white/20"
            >
              <span className="text-[10px] font-medium tracking-[0.1em] text-white/40 uppercase">
                Powered by
              </span>
              <FilestackLogo className="h-4" invert />
            </a>
            <p className="mt-4 text-xs leading-relaxed text-white/30">{blurb}</p>
          </div>

          <div className="max-w-sm text-xs leading-relaxed text-white/30 sm:text-right">
            <p className="font-medium text-white/50">What Filestack does here</p>
            <p className="mt-1.5">{chain}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-white/30 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {firm}. A Filestack use case, not a real company.
          </p>
          <a
            href="https://github.com/Fileschool/filestack-use-cases"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:text-white/60 hover:underline"
          >
            View the source
          </a>
        </div>
      </div>
    </div>
  );
}
