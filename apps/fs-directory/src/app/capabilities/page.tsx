import Link from 'next/link';

import { Chrome } from '@/components/Chrome';
import { featureIndex } from '@/lib/catalogue';

const SHAPE: Record<string, { label: string; bg: string; fg: string }> = {
  url: { label: 'URL', bg: 'rgba(29,78,216,.1)', fg: '#1d4ed8' },
  signed: { label: 'Signed URL', bg: 'rgba(180,120,20,.14)', fg: '#8a5b14' },
  workflow: { label: 'Workflow', bg: 'rgba(124,58,237,.12)', fg: '#7c3aed' },
};

export default function CapabilitiesPage() {
  const features = featureIndex();

  return (
    <Chrome>
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
          Every capability, and who demonstrates it
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8" style={{ color: 'var(--ink-600)' }}>
          Filestack has three shapes of capability, and picking the wrong one is the most common
          integration mistake. Most things are a URL you build. Some reject unsigned requests and
          need a policy signed on your server. Virus detection is neither: it runs after upload
          and reports back to a webhook.
        </p>

        <div className="mt-10 space-y-3">
          {features.map((feature) => {
            const shape = SHAPE[feature.shape];
            return (
              <div key={feature.name} className="card flex flex-wrap items-center gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: 'var(--filestack)' }}>
                      {feature.name}
                    </span>
                    <span className="chip" style={{ background: shape.bg, color: shape.fg }}>
                      {shape.label}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {feature.used.map((useCase) => (
                      <Link
                        key={useCase.slug}
                        href={`/use-cases/${useCase.slug}`}
                        className="chip"
                        style={{ background: 'var(--ink-50)', color: 'var(--ink-600)' }}
                      >
                        {useCase.business}
                      </Link>
                    ))}
                  </div>
                </div>
                <span className="text-3xl font-extrabold tabular-nums" style={{ color: 'var(--ink-300)' }}>
                  {feature.used.length}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Chrome>
  );
}
