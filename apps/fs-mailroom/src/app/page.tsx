import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';

import { FilestackStrip } from '@/components/ui/FilestackStrip';
import { FilestackFooter } from '@/components/ui/FilestackFooter';
import { BRAND } from '@/lib/copy';
import { MEDIA } from '@/lib/media';
import { cdnUrl } from '@/lib/filestack';

const img = (handle: string, tasks: string[]) => cdnUrl(handle, tasks);

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <FilestackStrip features={BRAND.filestack.features} />

      {/* Contact bar: the utility strip every logistics firm runs */}
      <div
        className="hidden border-b text-xs sm:block"
        style={{ borderColor: 'var(--brand-200)', background: '#fff' }}
      >
        <div
          className="mx-auto flex w-full max-w-6xl items-center gap-6 px-5 py-2 sm:px-8"
          style={{ color: 'var(--brand-500)' }}
        >
          <span className="flex items-center gap-1.5">
            <Phone className="size-3.5" /> 0113 496 0110
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" /> Collections 07:00–18:00
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <MapPin className="size-3.5" /> Colville Works, Leeds
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b bg-white" style={{ borderColor: 'var(--brand-200)' }}>
        <div className="mx-auto flex w-full max-w-6xl items-center gap-8 px-5 py-4 sm:px-8">
          <Link href="/">
            <span className="font-display block text-xl leading-none font-extrabold tracking-tight">
              {BRAND.name}
            </span>
            <span className="font-mono mt-1 block text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--accent)' }}>
              {BRAND.tagline}
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-6 text-sm font-medium lg:flex">
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

      {/* Full-bleed hero over the sorting wall */}
      <section className="relative">
        <img
          src={img(MEDIA.hero, ['resize=width:2000,fit:max', 'output=format:webp'])}
          alt="Sorting wall at the Redfern facility"
          className="h-[520px] w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(12,21,38,.94) 0%, rgba(12,21,38,.78) 45%, rgba(12,21,38,.25) 100%)' }} />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase" style={{ color: 'var(--accent-light)' }}>
              {BRAND.hero.eyebrow}
            </p>
            <h1 className="font-display mt-4 max-w-2xl text-4xl leading-[1.05] font-extrabold text-white text-balance sm:text-5xl">
              {BRAND.hero.headline}
            </h1>
            <p className="mt-5 max-w-xl leading-7 text-white/70">{BRAND.hero.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/demo" className="btn-primary" style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }}>
                {BRAND.hero.primaryCta} <ArrowRight className="size-4" />
              </Link>
              <span className="btn-secondary" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,.35)' }}>
                {BRAND.hero.secondaryCta}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Operating figures, as a hard band */}
      <section style={{ background: 'var(--brand-900)' }}>
        <div className="mx-auto grid w-full max-w-6xl gap-px px-5 sm:grid-cols-3 sm:px-8">
          {BRAND.stats.map((stat) => (
            <div key={stat.label} className="py-8">
              <p className="font-display text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="font-mono mt-1 text-[11px] tracking-wider uppercase text-white/45">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services as a schedule, not cards */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="font-display text-3xl font-extrabold">{BRAND.services.title}</h2>
        <div className="rule-franked mt-4 w-24" />

        <div className="mt-10 divide-y" style={{ borderColor: 'var(--brand-200)' }}>
          {BRAND.services.items.map((item, index) => (
            <div key={item.title} className="grid gap-4 py-7 sm:grid-cols-[4rem_14rem_minmax(0,1fr)]" style={{ borderColor: 'var(--brand-200)' }}>
              <span className="font-mono text-sm" style={{ color: 'var(--accent)' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-lg font-bold">{item.title}</h3>
              <p className="text-sm leading-6" style={{ color: 'var(--brand-600)' }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process over a second facility photograph */}
      <section className="border-y" style={{ borderColor: 'var(--brand-200)', background: '#fff' }}>
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2">
          <img
            src={img(MEDIA.mailroom, ['resize=width:1000,height:760,fit:crop', 'output=format:webp'])}
            alt="Redfern mailroom"
            className="h-full w-full rounded-sm object-cover"
          />
          <div>
            <h2 className="font-display text-3xl font-extrabold">{BRAND.how.title}</h2>
            <div className="rule-franked mt-4 w-24" />
            <ol className="mt-8 space-y-7">
              {BRAND.how.steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    className="font-mono grid size-8 shrink-0 place-items-center rounded-sm text-xs font-bold text-white"
                    style={{ background: 'var(--brand-900)' }}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6" style={{ color: 'var(--brand-600)' }}>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-5 py-16 text-center sm:px-8">
        <blockquote className="font-display text-2xl leading-relaxed text-balance">
          &ldquo;{BRAND.proof.quote}&rdquo;
        </blockquote>
        <p className="font-mono mt-5 text-xs tracking-wider uppercase" style={{ color: 'var(--brand-500)' }}>
          {BRAND.proof.attribution}
        </p>
      </section>

      <section className="relative">
        <img
          src={img(MEDIA.warehouse, ['resize=width:1800,height:420,fit:crop', 'output=format:webp'])}
          alt=""
          className="h-64 w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(12,21,38,.88)' }} />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-5 sm:px-8">
            <div className="max-w-lg">
              <h2 className="font-display text-2xl font-extrabold text-white">{BRAND.portal.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">{BRAND.portal.body}</p>
            </div>
            <Link href="/demo" className="btn-primary shrink-0" style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }}>
              {BRAND.portal.cta} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <FilestackFooter firm={BRAND.legal} blurb={BRAND.filestack.blurb} chain={BRAND.filestack.chain} />
    </div>
  );
}
