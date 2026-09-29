import Link from 'next/link';
import { LogOut } from 'lucide-react';

import { FilestackStrip } from '@/components/ui/FilestackStrip';
import { FilestackFooter } from '@/components/ui/FilestackFooter';
import { signOutAction } from '@/lib/actions/auth';
import { BRAND } from '@/lib/copy';
import type { IAssessor } from '@/interfaces/claim.interface';

/** The signed-in chrome for the assessment desk. */
export function DeskChrome({
  assessor,
  children,
}: {
  assessor: IAssessor;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <FilestackStrip features={BRAND.filestack.features} />

      <header className="border-b bg-white" style={{ borderColor: 'var(--brand-200)' }}>
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-4 sm:px-8">
          <Link href="/admin">
            <span className="font-display block text-xl leading-none">{BRAND.name}</span>
            <span className="mt-0.5 block text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--accent-dark)' }}>
              Assessment desk
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-semibold">{assessor.name}</span>
              <span className="block text-xs" style={{ color: 'var(--brand-600)' }}>
                {assessor.role}
              </span>
            </span>
            <form action={signOutAction}>
              <button type="submit" className="btn-secondary">
                <LogOut className="size-4" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <FilestackFooter firm={BRAND.legal} blurb={BRAND.filestack.blurb} chain={BRAND.filestack.chain} />
    </div>
  );
}
