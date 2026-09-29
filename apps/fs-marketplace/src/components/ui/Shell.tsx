import Link from 'next/link';

import { FilestackStrip } from '@/components/ui/FilestackStrip';
import { FilestackFooter } from '@/components/ui/FilestackFooter';
import { BRAND } from '@/lib/copy';

/** The signed-in chrome: masthead, working area, firm footer. */
export function Shell({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <FilestackStrip features={BRAND.filestack.features} />

      <header className="border-b" style={{ borderColor: 'var(--brand-200)' }}>
        <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-5 py-4 sm:px-8">
          <Link href="/" className="shrink-0">
            <span className="font-display block text-lg leading-none font-bold tracking-tight">
              {BRAND.name}
            </span>
            <span
              className="mt-1 block text-[10px] tracking-wider uppercase"
              style={{ color: 'var(--brand-500)' }}
            >
              {BRAND.tagline}
            </span>
          </Link>
          <Link href="/" className="btn-ghost ml-auto shrink-0">
            Back to site
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
          <h1 className="font-display text-3xl text-balance sm:text-4xl">{title}</h1>
          <p
            className="mt-3 max-w-2xl leading-7"
            style={{ color: 'var(--brand-600)' }}
          >
            {intro}
          </p>
          <div className="mt-10">{children}</div>
        </div>
      </main>

      <FilestackFooter
        firm={BRAND.legal}
        blurb={BRAND.filestack.blurb}
        chain={BRAND.filestack.chain}
      />
    </div>
  );
}
