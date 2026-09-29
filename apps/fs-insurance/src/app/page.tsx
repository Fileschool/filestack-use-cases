import Link from 'next/link';
import { ArrowRight, FileText, Phone, ShieldCheck } from 'lucide-react';

import { FilestackStrip } from '@/components/ui/FilestackStrip';
import { FilestackFooter } from '@/components/ui/FilestackFooter';
import { BRAND } from '@/lib/copy';
import { MEDIA } from '@/lib/media';
import { cdnUrl } from '@/lib/filestack';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <FilestackStrip features={BRAND.filestack.features} />

      {/* Members' bar, as every insurer has */}
      <div style={{ background: 'var(--brand-950)' }}>
        <div className="mx-auto flex w-full max-w-6xl items-center gap-5 px-5 py-2 text-xs text-white/60 sm:px-8">
          <span className="flex items-center gap-1.5">
            <Phone className="size-3.5" /> Claims line 0800 118 1923
          </span>
          <span className="ml-auto hidden sm:inline">Open to members 8am to 8pm</span>
        </div>
      </div>

      <header className="border-b bg-white" style={{ borderColor: 'var(--brand-200)' }}>
        <div className="mx-auto flex w-full max-w-6xl items-center gap-8 px-5 py-5 sm:px-8">
          <Link href="/">
            <span className="font-display block text-2xl leading-none">{BRAND.name}</span>
            <span className="mt-1 block text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--accent-dark)' }}>
              {BRAND.tagline}
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-6 text-sm lg:flex">
            {BRAND.nav.map((item) => (
              <span key={item} style={{ color: 'var(--brand-700)' }}>{item}</span>
            ))}
          </nav>
          <Link href="/login" className="btn-secondary hidden shrink-0 sm:inline-flex">
            {BRAND.admin.navCta}
          </Link>
          <Link href="/demo" className="btn-primary shrink-0">{BRAND.hero.primaryCta}</Link>
        </div>
      </header>

      {/* Hero: photograph right, claim panel left, the insurer convention */}
      <section className="relative">
        <img
          src={cdnUrl(MEDIA.hero, ['resize=width:2000,height:760,fit:crop', 'output=format:webp'])}
          alt="A home insured by Ardmore Mutual"
          className="h-[500px] w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(7,26,48,.95) 0%, rgba(7,26,48,.72) 42%, rgba(7,26,48,.1) 78%)' }} />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <div className="max-w-xl">
              <p className="text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--accent-light)' }}>
                {BRAND.hero.eyebrow}
              </p>
              <h1 className="font-display mt-4 text-4xl leading-[1.08] text-white text-balance sm:text-5xl">
                {BRAND.hero.headline}
              </h1>
              <p className="mt-5 leading-7 text-white/75">{BRAND.hero.sub}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/demo" className="btn-primary" style={{ background: 'var(--accent)', color: '#fff' }}>
                  {BRAND.hero.primaryCta} <ArrowRight className="size-4" />
                </Link>
                <span className="btn-secondary" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,.4)' }}>
                  {BRAND.hero.secondaryCta}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three products, ruled cards */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="font-display text-3xl">{BRAND.services.title}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {BRAND.services.items.map((item) => (
            <div key={item.title} className="card card-ruled p-7">
              <FileText className="size-5" style={{ color: 'var(--accent-dark)' }} />
              <h3 className="font-display mt-4 text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-6" style={{ color: 'var(--brand-700)' }}>{item.body}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--brand-800)' }}>
                Read the policy <ArrowRight className="size-3.5" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Claim process on the institutional navy */}
      <section style={{ background: 'var(--brand-900)' }}>
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="font-display text-3xl text-white">{BRAND.how.title}</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {BRAND.how.steps.map((step, index) => (
              <div key={step.title}>
                <span className="font-display text-5xl" style={{ color: 'var(--accent-light)' }}>
                  {index + 1}
                </span>
                <h3 className="font-display mt-3 text-lg text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{step.body}</p>
              </div>
            ))}
          </div>
          <Link href="/demo" className="btn-primary mt-10" style={{ background: 'var(--accent)', color: '#fff' }}>
            {BRAND.portal.cta} <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Heritage: the archive photograph carries the "since 1923" claim */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1fr]">
          <img
            src={cdnUrl(MEDIA.heritage, ['resize=width:1000,fit:max', 'output=format:webp'])}
            alt="The Society's underwriting room, 1930s"
            className="w-full rounded-sm"
          />
          <div>
            <p className="eyebrow">A mutual, not a shareholder company</p>
            <h2 className="font-display mt-3 text-3xl text-balance">
              A hundred and two years of paying claims
            </h2>
            <p className="mt-4 leading-7" style={{ color: 'var(--brand-700)' }}>
              Ardmore Mutual has no external shareholders. Any surplus is held against future
              claims or returned to members, which is why our first duty when something goes
              wrong is to settle it rather than to test it.
            </p>

            <dl className="mt-8 grid gap-6 sm:grid-cols-3">
              {BRAND.stats.map((stat) => (
                <div key={stat.label} className="border-t pt-4" style={{ borderColor: 'var(--brand-300)' }}>
                  <dt className="font-display text-3xl">{stat.value}</dt>
                  <dd className="mt-1 text-xs" style={{ color: 'var(--brand-600)' }}>{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Member testimony */}
      <section className="border-t" style={{ borderColor: 'var(--brand-200)', background: 'var(--paper-sunk)' }}>
        <div className="mx-auto w-full max-w-4xl px-5 py-16 text-center sm:px-8">
          <ShieldCheck className="mx-auto size-7" style={{ color: 'var(--accent-dark)' }} />
          <blockquote className="font-display mt-5 text-2xl leading-relaxed text-balance">
            &ldquo;{BRAND.proof.quote}&rdquo;
          </blockquote>
          <p className="mt-5 text-sm" style={{ color: 'var(--brand-600)' }}>{BRAND.proof.attribution}</p>
        </div>
      </section>

      <FilestackFooter firm={BRAND.legal} blurb={BRAND.filestack.blurb} chain={BRAND.filestack.chain} />
    </div>
  );
}
