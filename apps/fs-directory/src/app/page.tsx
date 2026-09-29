import { UseCaseCard } from '@/components/UseCaseCard';
import { Chrome } from '@/components/Chrome';
import { USE_CASES, featureIndex } from '@/lib/catalogue';

export default function HomePage() {
  const features = featureIndex();
  const full = USE_CASES.filter((u) => u.status !== 'thin').length;

  return (
    <Chrome>
      <section className="mx-auto w-full max-w-6xl px-5 pt-16 pb-10 sm:px-8">
        <p
          className="mono text-xs font-semibold tracking-[0.18em] uppercase"
          style={{ color: 'var(--filestack)' }}
        >
          Filestack use cases
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl">
          Ten working applications, and exactly what each one uses.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8" style={{ color: 'var(--ink-600)' }}>
          Each is a complete product dressed as a business you would recognise, not a snippet.
          Clone one, drop in your own API key, and change the parts you need. Every screenshot
          below was captured from the app actually running.
        </p>

        <dl className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { value: String(USE_CASES.length), label: 'Use cases in the repository' },
            { value: String(features.length), label: 'Filestack capabilities covered' },
            { value: `${full}`, label: 'Built out as full applications' },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="text-4xl font-extrabold tracking-tight">{stat.value}</dt>
              <dd className="mt-1 text-sm" style={{ color: 'var(--ink-500)' }}>{stat.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((useCase) => (
            <UseCaseCard key={useCase.slug} useCase={useCase} />
          ))}
        </div>
      </section>
    </Chrome>
  );
}
