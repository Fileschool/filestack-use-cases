import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, FileCode, Film, Terminal } from 'lucide-react';

import { Chrome } from '@/components/Chrome';
import { shot } from '@/lib/shot';
import { USE_CASES, getUseCase } from '@/lib/catalogue';

export function generateStaticParams() {
  return USE_CASES.map((useCase) => ({ slug: useCase.slug }));
}

const SHAPE: Record<string, { label: string; note: string; bg: string; fg: string }> = {
  url: {
    label: 'URL',
    note: 'Built in the browser and dropped straight into an image tag.',
    bg: 'rgba(29,78,216,.1)',
    fg: '#1d4ed8',
  },
  signed: {
    label: 'Signed URL',
    note: 'Rejects unsigned requests, so a policy is signed server side first.',
    bg: 'rgba(180,120,20,.14)',
    fg: '#8a5b14',
  },
  workflow: {
    label: 'Workflow',
    note: 'Runs after the file lands in storage and reports back to a webhook.',
    bg: 'rgba(124,58,237,.12)',
    fg: '#7c3aed',
  },
};

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) notFound();

  return (
    <Chrome>
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: 'var(--ink-600)' }}
        >
          <ArrowLeft className="size-3.5" /> All use cases
        </Link>

        <header className="mt-6 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <span className="chip" style={{ background: 'var(--ink-100)', color: 'var(--ink-600)' }}>
              {useCase.vertical}
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
              {useCase.business}
            </h1>
            <p className="mt-1 text-lg" style={{ color: 'var(--ink-500)' }}>{useCase.tagline}</p>
            <p className="mt-5 text-lg leading-8" style={{ color: 'var(--ink-700)' }}>
              {useCase.description}
            </p>
          </div>
        </header>

        <figure className="card mt-10 overflow-hidden p-0">
          <img
            src={shot(useCase.screenshot, 1600)}
            alt={`${useCase.business} home page`}
            className="block w-full"
          />
          <figcaption
            className="border-t px-5 py-3 text-xs"
            style={{ borderColor: 'var(--ink-200)', color: 'var(--ink-500)' }}
          >
            Captured from the running application, stored in Filestack, and resized for this
            page by the same URL convention the demo itself uses.
          </figcaption>
        </figure>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold tracking-tight">What Filestack does here</h2>
              <div className="mt-5 space-y-3">
                {useCase.features.map((feature) => {
                  const shape = SHAPE[feature.shape];
                  return (
                    <div key={feature.name} className="card p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: 'var(--filestack)' }}>
                          {feature.name}
                        </span>
                        <span className="chip" style={{ background: shape.bg, color: shape.fg }}>
                          {shape.label}
                        </span>
                        {feature.task && (
                          <code className="mono text-[11px]" style={{ color: 'var(--ink-400)' }}>
                            {feature.task}
                          </code>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-6" style={{ color: 'var(--ink-700)' }}>
                        {feature.what}
                      </p>
                      <p className="mt-1.5 text-xs" style={{ color: 'var(--ink-500)' }}>
                        {shape.note}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="card p-6">
              <h2 className="text-lg font-bold">What you would otherwise build</h2>
              <p className="mt-2 leading-7" style={{ color: 'var(--ink-700)' }}>
                {useCase.instead}
              </p>
            </section>
          </div>

          <aside className="space-y-5">
            <div className="card p-5">
              <h2 className="label">Run it</h2>
              <pre
                className="mono mt-3 overflow-x-auto rounded-lg p-3 text-[11px] leading-5"
                style={{ background: 'var(--ink-50)', color: 'var(--ink-700)' }}
              >{`npm install
npx turbo dev \\
  --filter=${useCase.folder.split('/').pop()}`}</pre>
              <p className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: 'var(--ink-500)' }}>
                <Terminal className="size-3.5" /> localhost:{useCase.port}
              </p>
            </div>

            <div className="card p-5">
              <h2 className="label">In the repository</h2>
              <p className="mono mt-2 text-sm">{useCase.folder}</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {[
                  { has: useCase.docs.readme, icon: FileCode, label: 'README.md' },
                  { has: useCase.docs.article, icon: BookOpen, label: 'ARTICLE.md' },
                  { has: useCase.docs.videoScript, icon: Film, label: 'VIDEO-SCRIPT.md' },
                ].map((doc) => (
                  <li
                    key={doc.label}
                    className="flex items-center gap-2"
                    style={{ color: doc.has ? 'var(--ink-700)' : 'var(--ink-300)' }}
                  >
                    <doc.icon className="size-3.5 shrink-0" />
                    {doc.label}
                    {!doc.has && <span className="text-xs">(not written)</span>}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5">
              <h2 className="label">Built with</h2>
              <ul className="mt-3 space-y-1 text-sm" style={{ color: 'var(--ink-700)' }}>
                {useCase.stack.map((item) => <li key={item}>{item}</li>)}
              </ul>

              <h2 className="label mt-5">Roles you can explore</h2>
              <ul className="mt-2 space-y-1 text-sm" style={{ color: 'var(--ink-700)' }}>
                {useCase.roles.map((role) => <li key={role}>{role}</li>)}
              </ul>

              <h2 className="label mt-5">Data</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--ink-700)' }}>
                {useCase.persistence}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </Chrome>
  );
}
