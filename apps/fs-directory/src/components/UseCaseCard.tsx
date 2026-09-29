import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { shot } from '@/lib/shot';
import type { IUseCase } from '@/interfaces/catalogue.interface';

const STATUS: Record<IUseCase['status'], { label: string; bg: string; fg: string }> = {
  mature: { label: 'Full application', bg: 'rgba(21,128,61,.12)', fg: '#15803d' },
  built: { label: 'Full application', bg: 'rgba(21,128,61,.12)', fg: '#15803d' },
  thin: { label: 'Feature demo', bg: 'rgba(180,120,20,.14)', fg: '#8a5b14' },
};

export function UseCaseCard({ useCase }: { useCase: IUseCase }) {
  const status = STATUS[useCase.status];

  return (
    <Link href={`/use-cases/${useCase.slug}`} className="card group block overflow-hidden">
      <div className="overflow-hidden border-b" style={{ borderColor: 'var(--ink-200)' }}>
        <img
          src={shot(useCase.screenshot, 800, 500)}
          alt={`${useCase.business} home page`}
          className="aspect-[8/5] w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
        />
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip" style={{ background: 'var(--ink-100)', color: 'var(--ink-600)' }}>
            {useCase.vertical}
          </span>
          <span className="chip" style={{ background: status.bg, color: status.fg }}>
            {status.label}
          </span>
        </div>

        <h2 className="mt-3 text-lg font-bold">{useCase.business}</h2>
        <p className="mt-1 text-sm leading-6" style={{ color: 'var(--ink-600)' }}>
          {useCase.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {useCase.features.slice(0, 3).map((feature) => (
            <span
              key={feature.name}
              className="chip"
              style={{ background: 'var(--ink-50)', color: 'var(--ink-500)' }}
            >
              {feature.name}
            </span>
          ))}
          {useCase.features.length > 3 && (
            <span className="chip" style={{ background: 'var(--ink-50)', color: 'var(--ink-400)' }}>
              +{useCase.features.length - 3}
            </span>
          )}
        </div>

        <span
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: 'var(--filestack)' }}
        >
          See what it uses <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
