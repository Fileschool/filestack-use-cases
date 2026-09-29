import Link from 'next/link';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

import { FilestackStrip } from '@/components/ui/FilestackStrip';
import { FilestackFooter } from '@/components/ui/FilestackFooter';
import { BRAND } from '@/lib/copy';
import { MEDIA } from '@/lib/media';
import { cdnUrl } from '@/lib/filestack';

export default function HomePage() {
  const shot = cdnUrl(MEDIA.hero, [
    'enhance=preset:auto',
    'resize=width:1200,fit:max',
    'output=format:webp',
  ]);

  return (
    <div className="min-h-screen">
      <FilestackStrip features={BRAND.filestack.features} />

      <header className="mx-auto flex w-full max-w-6xl items-center gap-8 px-5 py-6 sm:px-8">
        <Link href="/" className="font-display text-2xl leading-none">
          {BRAND.name}
        </Link>
        <nav className="ml-auto hidden items-center gap-7 text-sm font-medium md:flex">
          {BRAND.nav.map((item) => (
            <span key={item} style={{ color: 'var(--brand-600)' }}>{item}</span>
          ))}
        </nav>
        <Link href="/login" className="btn-secondary hidden shrink-0 sm:inline-flex">
          {BRAND.admin.navCta}
        </Link>
        <Link href="/demo" className="btn-primary shrink-0">{BRAND.hero.primaryCta}</Link>
      </header>

      {/* Centred hero, the fintech convention */}
      <section className="mx-auto w-full max-w-4xl px-5 pt-12 pb-4 text-center sm:px-8 sm:pt-20">
        <span
          className="pill inline-flex"
          style={{ background: 'color-mix(in srgb, var(--accent) 14%, transparent)', color: 'var(--accent)' }}
        >
          <Sparkles className="size-3.5" /> {BRAND.hero.eyebrow}
        </span>
        <h1 className="font-display mt-6 text-5xl leading-[1.02] text-balance sm:text-7xl">
          {BRAND.hero.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8" style={{ color: 'var(--brand-600)' }}>
          {BRAND.hero.sub}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/demo" className="btn-primary px-6 py-3.5 text-base">
            {BRAND.hero.primaryCta} <ArrowRight className="size-4" />
          </Link>
          <span className="btn-secondary px-6 py-3.5 text-base">{BRAND.hero.secondaryCta}</span>
        </div>
      </section>

      {/* Product shot in a tilted frame */}
      <section className="mx-auto w-full max-w-5xl px-5 pt-10 pb-20 sm:px-8">
        <div
          className="rounded-[2rem] p-3 sm:p-5"
          style={{ background: 'color-mix(in srgb, var(--brand-900) 8%, transparent)' }}
        >
          <img
            src={shot}
            alt="A receipt and paperwork being captured"
            className="w-full rounded-[1.4rem] shadow-2xl"
            style={{ transform: 'rotate(-0.6deg)' }}
          />
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {BRAND.stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-5xl leading-none">{stat.value}</p>
              <p className="mt-2 text-sm" style={{ color: 'var(--brand-500)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Alternating feature rows */}
      <section style={{ background: '#fff' }}>
        <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8">
          <h2 className="font-display max-w-2xl text-4xl leading-tight text-balance">
            {BRAND.services.title}
          </h2>

          <div className="mt-14 space-y-6">
            {BRAND.services.items.map((item, index) => (
              <div
                key={item.title}
                className="card grid items-center gap-8 p-8 sm:grid-cols-[1fr_auto] sm:p-10"
              >
                <div>
                  <span className="label">0{index + 1}</span>
                  <h3 className="font-display mt-2 text-2xl">{item.title}</h3>
                  <p className="mt-3 max-w-xl leading-7" style={{ color: 'var(--brand-600)' }}>
                    {item.body}
                  </p>
                </div>
                <span
                  className="hidden size-16 shrink-0 place-items-center rounded-full sm:grid"
                  style={{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent)' }}
                >
                  <Check className="size-7" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps as a horizontal rail */}
      <section className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8">
        <h2 className="font-display text-4xl text-balance">{BRAND.how.title}</h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {BRAND.how.steps.map((step, index) => (
            <div key={step.title}>
              <span
                className="grid size-9 place-items-center rounded-full text-sm font-bold text-white"
                style={{ background: 'var(--brand-900)' }}
              >
                {index + 1}
              </span>
              <h3 className="font-display mt-4 text-xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-6" style={{ color: 'var(--brand-600)' }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote on a coloured slab */}
      <section className="mx-auto w-full max-w-5xl px-5 pb-20 sm:px-8">
        <div className="rounded-[2rem] p-10 sm:p-14" style={{ background: 'var(--brand-900)' }}>
          <blockquote className="font-display text-3xl leading-snug text-balance" style={{ color: 'var(--paper)' }}>
            &ldquo;{BRAND.proof.quote}&rdquo;
          </blockquote>
          <p className="mt-6 text-sm" style={{ color: 'var(--brand-400)' }}>{BRAND.proof.attribution}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4 border-t pt-8" style={{ borderColor: 'var(--brand-700)' }}>
            <div className="max-w-md">
              <h2 className="font-display text-2xl" style={{ color: 'var(--paper)' }}>{BRAND.portal.title}</h2>
              <p className="mt-2 text-sm leading-6" style={{ color: 'var(--brand-400)' }}>{BRAND.portal.body}</p>
            </div>
            <Link
              href="/demo"
              className="btn-primary ml-auto shrink-0"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              {BRAND.portal.cta} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <FilestackFooter firm={BRAND.legal} blurb={BRAND.filestack.blurb} chain={BRAND.filestack.chain} />
    </div>
  );
}
