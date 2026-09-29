import Link from 'next/link';

import { FilestackLogo } from '@/components/FilestackLogo';

export function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b" style={{ borderColor: 'var(--ink-200)', background: 'var(--paper)' }}>
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <FilestackLogo className="h-5" />
            <span className="hidden text-sm font-semibold sm:inline" style={{ color: 'var(--ink-500)' }}>
              Use cases
            </span>
          </Link>
          <nav className="ml-auto flex items-center gap-4 text-sm">
            <Link href="/capabilities" className="font-semibold" style={{ color: 'var(--ink-600)' }}>
              Capabilities
            </Link>
            <a
              href="https://github.com/Fileschool/filestack-use-cases"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              Source
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t" style={{ borderColor: 'var(--ink-200)', background: 'var(--paper)' }}>
        <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <FilestackLogo className="h-4" />
            <p className="text-xs" style={{ color: 'var(--ink-500)' }}>
              Every screenshot on this site was captured from the running application and is
              served from Filestack.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
