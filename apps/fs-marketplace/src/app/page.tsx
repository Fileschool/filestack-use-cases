import Link from 'next/link';
import { ArrowRight, Heart, Search } from 'lucide-react';

import { FilestackStrip } from '@/components/ui/FilestackStrip';
import { FilestackFooter } from '@/components/ui/FilestackFooter';
import { BRAND } from '@/lib/copy';
import { MEDIA } from '@/lib/media';
import { cdnUrl } from '@/lib/filestack';

/** One photograph, many crops. Every tile below is the same handle. */
const tile = (handle: string, w: number, h: number, extra: string[] = []) =>
  cdnUrl(handle, [...extra, `resize=width:${w},height:${h},fit:crop`, 'output=format:webp']);

const LISTINGS = [
  { title: 'Ercol elm dining chairs, set of four', price: '£340', place: 'Leeds', handle: MEDIA.chairs, crop: 'top' },
  { title: 'Danish teak sideboard, 1962', price: '£615', place: 'Bristol', handle: MEDIA.hero, crop: 'faces' },
  { title: 'Anglepoise 1227, original cream', price: '£128', place: 'Glasgow', handle: MEDIA.chairs, crop: 'center' },
  { title: 'Pair of rattan lounge chairs', price: '£290', place: 'Margate', handle: MEDIA.chairs, crop: 'bottom' },
  { title: 'Mid-century nest of tables', price: '£175', place: 'Sheffield', handle: MEDIA.hero, crop: 'left' },
  { title: 'Brass reading lamp, rewired', price: '£96', place: 'Norwich', handle: MEDIA.chairs, crop: 'right' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <FilestackStrip features={BRAND.filestack.features} />

      <header className="border-b" style={{ borderColor: 'var(--brand-200)' }}>
        <div className="mx-auto flex w-full max-w-6xl items-center gap-5 px-5 py-4 sm:px-8">
          <Link href="/" className="font-display text-2xl leading-none font-semibold">
            {BRAND.name}
          </Link>

          <div
            className="ml-2 hidden flex-1 items-center gap-2 rounded-md border px-3 py-2 md:flex"
            style={{ borderColor: 'var(--brand-300)', background: '#fff' }}
          >
            <Search className="size-4" style={{ color: 'var(--brand-400)' }} />
            <span className="text-sm" style={{ color: 'var(--brand-400)' }}>
              Search sideboards, lamps, armchairs…
            </span>
          </div>

          <Link href="/demo" className="btn-primary ml-auto shrink-0 md:ml-0">
            {BRAND.hero.primaryCta}
          </Link>
        </div>

        {/* Category rail, the way a marketplace actually navigates */}
        <div className="mx-auto w-full max-w-6xl px-5 pb-3 sm:px-8">
          <nav className="flex gap-6 overflow-x-auto text-sm font-medium">
            {BRAND.nav.map((item) => (
              <span key={item} className="shrink-0 pb-1" style={{ color: 'var(--brand-600)' }}>
                {item}
              </span>
            ))}
          </nav>
        </div>
      </header>

      {/* Editorial hero over the market hall */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-8 sm:px-8">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={cdnUrl(MEDIA.hero, ['resize=width:1800,height:720,fit:crop', 'output=format:webp'])}
            alt="The market hall"
            className="h-[380px] w-full object-cover sm:h-[440px]"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(34,37,30,.86) 8%, rgba(34,37,30,.15) 70%)' }} />
          <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10">
            <p className="eyebrow" style={{ color: '#f2c9b4' }}>{BRAND.hero.eyebrow}</p>
            <h1 className="font-display mt-3 max-w-2xl text-4xl leading-[1.05] text-white text-balance sm:text-5xl">
              {BRAND.hero.headline}
            </h1>
            <p className="mt-4 max-w-xl leading-7 text-white/75">{BRAND.hero.sub}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/demo" className="btn-primary">
                {BRAND.hero.primaryCta} <ArrowRight className="size-4" />
              </Link>
              <span className="btn-secondary" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.4)' }}>
                {BRAND.hero.secondaryCta}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The grid is the product */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl">Just listed</h2>
          <span className="text-sm underline" style={{ color: 'var(--brand-600)' }}>See everything</span>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LISTINGS.map((listing) => (
            <article key={listing.title} className="group">
              <div className="relative overflow-hidden rounded-md">
                <img
                  src={tile(listing.handle, 700, 560)}
                  alt={listing.title}
                  className="aspect-[5/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <button
                  type="button"
                  aria-label="Save"
                  className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-white/90"
                >
                  <Heart className="size-4" style={{ color: 'var(--brand-600)' }} />
                </button>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h3 className="text-sm leading-5 font-semibold">{listing.title}</h3>
                <span className="font-display shrink-0 text-lg">{listing.price}</span>
              </div>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--brand-500)' }}>{listing.place}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Seller proposition, warm band */}
      <section style={{ background: '#fff', borderTop: '1px solid var(--brand-200)', borderBottom: '1px solid var(--brand-200)' }}>
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="font-display text-3xl text-balance">{BRAND.services.title}</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {BRAND.services.items.map((item) => (
              <div key={item.title}>
                <h3 className="font-display text-xl">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-6" style={{ color: 'var(--brand-600)' }}>{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div>
              <h2 className="font-display text-2xl">{BRAND.how.title}</h2>
              <ol className="mt-6 space-y-5">
                {BRAND.how.steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="font-display text-2xl" style={{ color: 'var(--accent)' }}>{index + 1}</span>
                    <div>
                      <h3 className="text-sm font-bold">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6" style={{ color: 'var(--brand-600)' }}>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="card p-7">
              <p className="eyebrow">{BRAND.statsLabel}</p>
              <dl className="mt-5 space-y-5">
                {BRAND.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="font-display text-3xl">{stat.value}</dt>
                    <dd className="mt-0.5 text-xs" style={{ color: 'var(--brand-500)' }}>{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-5 py-16 text-center sm:px-8">
        <blockquote className="font-display text-2xl leading-relaxed text-balance">
          &ldquo;{BRAND.proof.quote}&rdquo;
        </blockquote>
        <p className="mt-5 text-sm" style={{ color: 'var(--brand-500)' }}>{BRAND.proof.attribution}</p>
        <Link href="/demo" className="btn-primary mt-8">
          {BRAND.portal.cta} <ArrowRight className="size-4" />
        </Link>
      </section>

      <FilestackFooter firm={BRAND.legal} blurb={BRAND.filestack.blurb} chain={BRAND.filestack.chain} />
    </div>
  );
}
