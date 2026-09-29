import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { FilestackStrip } from '@/components/ui/FilestackStrip';
import { FilestackFooter } from '@/components/ui/FilestackFooter';
import { BRAND } from '@/lib/copy';
import { MEDIA } from '@/lib/media';
import { cdnUrl } from '@/lib/filestack';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <FilestackStrip features={BRAND.filestack.features} />

      <header>
        <div className="mx-auto flex w-full max-w-5xl items-baseline gap-10 px-5 py-8 sm:px-8">
          <Link href="/">
            <span className="font-display block text-2xl leading-none tracking-wide">
              {BRAND.name}
            </span>
            <span className="mt-1.5 block text-[10px] tracking-[0.22em] uppercase" style={{ color: 'var(--brand-500)' }}>
              {BRAND.tagline}
            </span>
          </Link>
          <nav className="ml-auto hidden items-baseline gap-7 text-[13px] lg:flex">
            {BRAND.nav.map((item) => (
              <span key={item} style={{ color: 'var(--brand-600)' }}>{item}</span>
            ))}
          </nav>
          <Link href="/login" className="btn-secondary hidden shrink-0 lg:inline-flex">
            {BRAND.admin.navCta}
          </Link>
        </div>
        <div className="rule-gold" />
      </header>

      {/* Quiet hero. Type does the work; the photograph is muted underneath */}
      <section className="mx-auto w-full max-w-5xl px-5 pt-20 pb-16 sm:px-8 sm:pt-28">
        <p className="eyebrow">{BRAND.hero.eyebrow}</p>
        <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.08] text-balance sm:text-6xl">
          {BRAND.hero.headline}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8" style={{ color: 'var(--brand-600)' }}>
          {BRAND.hero.sub}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/demo" className="btn-primary">{BRAND.hero.primaryCta}</Link>
          <span className="btn-secondary">{BRAND.hero.secondaryCta}</span>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <img
          src={cdnUrl(MEDIA.hero, ['resize=width:1800,height:620,fit:crop', 'output=format:webp'])}
          alt="Signing at Pemberton Hale"
          className="w-full"
          style={{ filter: 'grayscale(85%) contrast(96%)' }}
        />
      </section>

      {/* Practice areas as a ruled list, the way firms actually present them */}
      <section className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8">
        <h2 className="font-display text-4xl">{BRAND.services.title}</h2>
        <div className="rule-gold mt-6" />

        <div>
          {BRAND.services.items.map((item) => (
            <div
              key={item.title}
              className="grid gap-4 border-b py-9 sm:grid-cols-[16rem_minmax(0,1fr)]"
              style={{ borderColor: 'var(--brand-200)' }}
            >
              <h3 className="font-display text-2xl">{item.title}</h3>
              <p className="leading-7" style={{ color: 'var(--brand-600)' }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The firm, on the ivory ground */}
      <section style={{ background: '#fff' }}>
        <div className="mx-auto grid w-full max-w-5xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="font-display text-3xl">{BRAND.how.title}</h2>
            <div className="rule-gold mt-5 w-20" />
            <ol className="mt-8 space-y-7">
              {BRAND.how.steps.map((step, index) => (
                <li key={step.title}>
                  <span className="text-[11px] tracking-[0.2em] uppercase" style={{ color: 'var(--accent)' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display mt-2 text-xl">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-7" style={{ color: 'var(--brand-600)' }}>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="label">{BRAND.statsLabel}</p>
            <dl className="mt-6">
              {BRAND.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-baseline justify-between border-b py-5"
                  style={{ borderColor: 'var(--brand-200)' }}
                >
                  <dt className="text-sm" style={{ color: 'var(--brand-600)' }}>{stat.label}</dt>
                  <dd className="font-display text-3xl">{stat.value}</dd>
                </div>
              ))}
            </dl>

            <blockquote className="font-display mt-12 text-xl leading-relaxed italic">
              &ldquo;{BRAND.proof.quote}&rdquo;
            </blockquote>
            <p className="mt-4 text-xs tracking-wider uppercase" style={{ color: 'var(--brand-500)' }}>
              {BRAND.proof.attribution}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8">
        <div className="rule-gold" />
        <div className="flex flex-wrap items-end justify-between gap-6 pt-10">
          <div className="max-w-lg">
            <h2 className="font-display text-3xl">{BRAND.portal.title}</h2>
            <p className="mt-3 leading-7" style={{ color: 'var(--brand-600)' }}>{BRAND.portal.body}</p>
          </div>
          <Link href="/demo" className="btn-primary shrink-0">
            {BRAND.portal.cta} <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      <FilestackFooter firm={BRAND.legal} blurb={BRAND.filestack.blurb} chain={BRAND.filestack.chain} />
    </div>
  );
}
