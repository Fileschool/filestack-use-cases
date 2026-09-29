'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Download, Eye, Inbox, LogOut } from 'lucide-react';

import { FilestackStrip } from '@/components/ui/FilestackStrip';
import { FilestackFooter } from '@/components/ui/FilestackFooter';
import { BRAND } from '@/lib/copy';
import { downloadUrl, previewUrl, thumbnailUrl } from '@/lib/filestack';
import { formatBytes, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useSubmissionStore } from '@/store/submissionStore';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuthStore();
  const submissions = useSubmissionStore((state) => state.submissions);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <FilestackStrip features={BRAND.filestack.features} />

      <header className="border-b" style={{ borderColor: 'var(--brand-200)' }}>
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-4 sm:px-8">
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

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-semibold">{user.name}</span>
              <span className="block text-xs" style={{ color: 'var(--brand-500)' }}>
                {user.role}
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                signOut();
                router.push('/');
              }}
              className="btn-secondary"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl text-balance sm:text-4xl">
                {BRAND.admin.title}
              </h1>
              <p className="mt-3 max-w-2xl leading-7" style={{ color: 'var(--brand-600)' }}>
                {BRAND.admin.intro}
              </p>
            </div>
            <Link href="/demo" className="btn-primary shrink-0">
              Open the public view
            </Link>
          </div>

          {submissions.length === 0 ? (
            <div className="card mt-10 flex flex-col items-center gap-3 p-16 text-center">
              <Inbox className="size-8" style={{ color: 'var(--brand-300)' }} />
              <p className="text-sm" style={{ color: 'var(--brand-500)' }}>
                {BRAND.admin.empty}
              </p>
              <Link href="/demo" className="btn-secondary mt-2">
                Go to the public view
              </Link>
            </div>
          ) : (
            <div className="mt-10 space-y-4">
              {submissions.map((item) => (
                <article key={item.id} className="card overflow-hidden">
                  <div className="grid gap-5 p-5 sm:grid-cols-[7rem_minmax(0,1fr)_auto]">
                    <img
                      src={thumbnailUrl(item.file, 280)}
                      alt={item.file.filename}
                      className="h-28 w-28 rounded object-cover"
                      style={{ background: 'var(--brand-100)' }}
                    />

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="font-mono text-xs font-semibold"
                          style={{ color: 'var(--accent)' }}
                        >
                          {item.reference}
                        </span>
                        <span
                          className="pill"
                          style={{
                            background:
                              item.status === 'held'
                                ? 'rgba(245,158,11,.14)'
                                : 'var(--brand-100)',
                            color:
                              item.status === 'held' ? '#92400e' : 'var(--brand-600)',
                          }}
                        >
                          {item.status === 'held' ? 'Held for review' : 'Processed'}
                        </span>
                      </div>

                      <p className="mt-1.5 truncate text-sm font-semibold">
                        {item.file.filename}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--brand-500)' }}>
                        {item.submittedBy} · {formatDate(item.submittedAt)} ·{' '}
                        {formatBytes(item.file.size)}
                      </p>

                      {item.extracted && (
                        <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                          {Object.entries(item.extracted)
                            .filter(([, value]) => value)
                            .map(([key, value]) => (
                              <div key={key} className="min-w-0">
                                <dt
                                  className="font-mono text-[11px]"
                                  style={{ color: 'var(--brand-400)' }}
                                >
                                  {key}
                                </dt>
                                <dd className="truncate text-sm">{value}</dd>
                              </div>
                            ))}
                        </dl>
                      )}

                      {item.note && (
                        <p
                          className="mt-3 text-xs italic"
                          style={{ color: 'var(--brand-500)' }}
                        >
                          “{item.note}”
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-col gap-2">
                      <a
                        href={previewUrl(item.file.handle)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary"
                      >
                        <Eye className="size-4" /> View
                      </a>
                      <a
                        href={downloadUrl(item.file)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-ghost"
                      >
                        <Download className="size-4" /> Download
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
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
