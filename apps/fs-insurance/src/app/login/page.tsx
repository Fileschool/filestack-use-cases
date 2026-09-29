import Link from 'next/link';
import { redirect } from 'next/navigation';

import { FilestackStrip } from '@/components/ui/FilestackStrip';
import { signInAs } from '@/lib/actions/auth';
import { listAssessors } from '@/lib/data';
import { getCurrentAssessor } from '@/lib/session';
import { BRAND } from '@/lib/copy';

export default async function LoginPage() {
  if (await getCurrentAssessor()) redirect('/admin');
  const assessors = await listAssessors();

  return (
    <div className="min-h-screen">
      <FilestackStrip features={BRAND.filestack.features} />

      <div className="mx-auto flex w-full max-w-lg flex-col px-5 py-16 sm:px-8">
        <Link href="/">
          <span className="font-display block text-2xl leading-none">{BRAND.name}</span>
          <span className="mt-1 block text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--accent-dark)' }}>
            {BRAND.tagline}
          </span>
        </Link>

        <div className="card card-ruled mt-10 p-8">
          <h1 className="font-display text-2xl">Claims assessors</h1>
          <p className="mt-2 text-sm leading-6" style={{ color: 'var(--brand-700)' }}>
            Sign in to the assessment desk. Sign-in is emulated for this demonstration,
            so pick a name to continue.
          </p>

          <div className="mt-7 space-y-3">
            {assessors.map((assessor) => (
              <form key={assessor.id} action={signInAs}>
                <input type="hidden" name="assessorId" value={assessor.id} />
                <button type="submit" className="card flex w-full items-center gap-4 p-4 text-left">
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                    style={{ background: 'var(--brand-800)' }}
                  >
                    {assessor.name.split(' ').map((p) => p[0]).join('')}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{assessor.name}</span>
                    <span className="block text-xs" style={{ color: 'var(--brand-600)' }}>
                      {assessor.role}
                    </span>
                  </span>
                </button>
              </form>
            ))}
          </div>
        </div>

        <Link href="/" className="btn-ghost mt-6 self-start">Back to the site</Link>
      </div>
    </div>
  );
}
