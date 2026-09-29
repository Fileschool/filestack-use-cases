'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

import { FilestackStrip } from '@/components/ui/FilestackStrip';
import { BRAND } from '@/lib/copy';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);

  return (
    <div className="min-h-screen">
      <FilestackStrip features={BRAND.filestack.features} />

      <div className="mx-auto flex w-full max-w-lg flex-col px-5 py-16 sm:px-8">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight">
          {BRAND.name}
        </Link>
        <p
          className="mt-1 text-[11px] tracking-wider uppercase"
          style={{ color: 'var(--brand-500)' }}
        >
          {BRAND.tagline}
        </p>

        <div className="card mt-10 p-8">
          <h1 className="font-display text-2xl">{BRAND.admin.loginTitle}</h1>
          <p className="mt-2 text-sm leading-6" style={{ color: 'var(--brand-600)' }}>
            {BRAND.admin.loginIntro}
          </p>

          <div className="mt-7 space-y-3">
            {BRAND.admin.accounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => {
                  signIn(account);
                  router.push('/admin');
                }}
                className="card flex w-full items-center gap-4 p-4 text-left transition"
              >
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                  style={{ background: 'var(--brand-800)' }}
                >
                  {account.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{account.name}</span>
                  <span className="block text-xs" style={{ color: 'var(--brand-500)' }}>
                    {account.role}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <p
            className="mt-6 flex items-start gap-2 text-xs leading-5"
            style={{ color: 'var(--brand-500)' }}
          >
            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
            Sign-in is emulated for this demonstration. Pick an account to continue,
            there are no passwords.
          </p>
        </div>

        <Link href="/" className="btn-ghost mt-6 self-start">
          Back to site
        </Link>
      </div>
    </div>
  );
}
