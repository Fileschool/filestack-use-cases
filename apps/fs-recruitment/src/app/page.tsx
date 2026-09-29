import Link from 'next/link';
import { ArrowRight, Lock, Search, ShieldCheck } from 'lucide-react';

import { FilestackStrip } from '@/components/ui/FilestackStrip';
import { FilestackFooter } from '@/components/ui/FilestackFooter';
import { BRAND } from '@/lib/copy';
import { MEDIA } from '@/lib/media';
import { cdnUrl } from '@/lib/filestack';

const CUSTOMERS = ['Northwind', 'Aldergate', 'Brightpath', 'Cairnstone', 'Halcyon Labs', 'Merrow'];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <FilestackStrip features={BRAND.filestack.features} />

      <header className="border-b" style={{ borderColor: 'var(--brand-200)' }}>
        <div className="mx-auto flex w-full max-w-6xl items-center gap-8 px-5 py-4 sm:px-8">
          <Link href="/" className="font-display text-xl leading-none">{BRAND.name}</Link>
          <nav className="ml-auto hidden items-center gap-7 text-sm font-semibold md:flex">
            {BRAND.nav.map((item) => (
              <span key={item} style={{ color: 'var(--brand-600)' }}>{item}</span>
            ))}
          </nav>
          <Link href="/login" className="btn-secondary hidden shrink-0 sm:inline-flex">
            {BRAND.admin.navCta}
          </Link>
          <Link href="/demo" className="btn-primary shrink-0">{BRAND.hero.primaryCta}</Link>
        </div>
      </header>

      {/* Split hero: claim left, product proof right */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-16 pb-12 sm:px-8 sm:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p className="eyebrow">{BRAND.hero.eyebrow}</p>
            <h1 className="font-display mt-4 text-4xl leading-[1.05] text-balance sm:text-5xl">
              {BRAND.hero.headline}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8" style={{ color: 'var(--brand-600)' }}>
              {BRAND.hero.sub}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/demo" className="btn-primary px-5 py-3 text-base">
                {BRAND.hero.primaryCta} <ArrowRight className="size-4" />
              </Link>
              <span className="btn-secondary px-5 py-3 text-base">{BRAND.hero.secondaryCta}</span>
            </div>
          </div>

          {/* A fragment of the product, which is what SaaS hero images are */}
          <div className="card overflow-hidden p-0">
            <img
              src={cdnUrl(MEDIA.hero, ['resize=width:1100,height:420,fit:crop', 'output=format:webp'])}
              alt=""
              className="h-40 w-full object-cover"
            />
            <div className="p-6">
              <p className="label">Candidate</p>
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={cdnUrl(MEDIA.portrait, ['resize=width:120,height:120,fit:crop', 'output=format:webp'])}
                  alt=""
                  className="size-11 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold">Daniel Vasquez</p>
                  <p className="text-xs" style={{ color: 'var(--brand-500)' }}>
                    Senior Platform Engineer · applied 2 hours ago
                  </p>
                </div>
                <span className="pill ml-auto shrink-0" style={{ background: 'var(--brand-100)', color: 'var(--brand-700)' }}>
                  <ShieldCheck className="size-3.5" /> Screened
                </span>
              </div>

              <div className="mt-5 space-y-2.5">
                {[
                  { icon: ShieldCheck, label: 'No threats found', tone: 'var(--accent-dark)' },
                  { icon: Search, label: 'Text indexed, searchable', tone: 'var(--brand-600)' },
                  { icon: Lock, label: 'Opened in browser, never downloaded', tone: 'var(--brand-600)' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-2.5 text-sm">
                    <row.icon className="size-4 shrink-0" style={{ color: row.tone }} />
                    <span style={{ color: 'var(--brand-700)' }}>{row.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer strip */}
      <section className="border-y" style={{ borderColor: 'var(--brand-200)', background: 'var(--paper-sunk)' }}>
        <div className="mx-auto w-full max-w-6xl px-5 py-7 sm:px-8">
          <p className="label text-center">Hiring teams using Hollis</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {CUSTOMERS.map((name) => (
              <span key={name} className="font-display text-lg opacity-40">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits, three across with rules */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
        <h2 className="font-display max-w-2xl text-3xl leading-tight text-balance sm:text-4xl">
          {BRAND.services.title}
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {BRAND.services.items.map((item) => (
            <div key={item.title} className="border-t pt-6" style={{ borderColor: 'var(--brand-300)' }}>
              <h3 className="font-display text-lg">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-6" style={{ color: 'var(--brand-600)' }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security band, the thing this product sells on */}
      <section style={{ background: 'var(--brand-900)' }}>
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="label" style={{ color: 'var(--accent-light)' }}>Security</p>
            <h2 className="font-display mt-3 text-3xl text-white text-balance">{BRAND.how.title}</h2>
            <ol className="mt-8 space-y-6">
              {BRAND.how.steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="font-display text-xl" style={{ color: 'var(--accent-light)' }}>
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/55">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid content-start gap-5 sm:grid-cols-3 lg:grid-cols-1">
            {BRAND.stats.map((stat) => (
              <div key={stat.label} className="border-l pl-5" style={{ borderColor: 'rgba(255,255,255,.18)' }}>
                <p className="font-display text-4xl text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-white/45">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <blockquote className="font-display text-2xl leading-relaxed text-balance">
            &ldquo;{BRAND.proof.quote}&rdquo;
            <footer className="mt-5 text-sm not-italic" style={{ color: 'var(--brand-500)' }}>
              {BRAND.proof.attribution}
            </footer>
          </blockquote>
          <Link href="/demo" className="btn-primary shrink-0 px-6 py-3.5 text-base">
            {BRAND.portal.cta} <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <FilestackFooter firm={BRAND.legal} blurb={BRAND.filestack.blurb} chain={BRAND.filestack.chain} />
    </div>
  );
}
