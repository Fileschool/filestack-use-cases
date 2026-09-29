import Link from 'next/link';

import { ReportClaimForm } from '@/components/features/ReportClaimForm';
import { FilestackStrip } from '@/components/ui/FilestackStrip';
import { FilestackFooter } from '@/components/ui/FilestackFooter';
import { BRAND } from '@/lib/copy';

export default function ReportPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <FilestackStrip features={BRAND.filestack.features} />

      <header className="border-b bg-white" style={{ borderColor: 'var(--brand-200)' }}>
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-4 sm:px-8">
          <Link href="/">
            <span className="font-display block text-xl leading-none">{BRAND.name}</span>
            <span className="mt-0.5 block text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--accent-dark)' }}>
              {BRAND.tagline}
            </span>
          </Link>
          <Link href="/login" className="btn-ghost ml-auto shrink-0">Assessor login</Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
          <h1 className="font-display text-3xl">Report a claim</h1>
          <p className="mt-3 max-w-2xl leading-7" style={{ color: 'var(--brand-700)' }}>
            Tell us what happened and send us what you have. Photographs taken in bad light are
            brightened, and if you photograph your policy schedule we will read the policy number
            off it rather than asking you to type it.
          </p>

          <div className="mt-10">
            <ReportClaimForm />
          </div>
        </div>
      </main>

      <FilestackFooter firm={BRAND.legal} blurb={BRAND.filestack.blurb} chain={BRAND.filestack.chain} />
    </div>
  );
}
