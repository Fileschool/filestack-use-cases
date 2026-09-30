'use client';

import { FC, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowDown, Menu, X } from 'lucide-react';
import { FilestackLogo } from '@/components/ui/FilestackLogo';

/* ─────────────────────────────────────────────
   Landing Page — Luxury Construction Company
   Inspired by SHVO.com editorial aesthetic
   ───────────────────────────────────────────── */

const PORTFOLIO_PROJECTS = [
  {
    name: 'The Meridian Tower',
    location: 'Austin, TX',
    type: 'Commercial',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    sqft: '485,000',
    year: '2024',
  },
  {
    name: 'Oakwood Hillside Villa',
    location: 'Aspen, CO',
    type: 'Residential',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    sqft: '7,200',
    year: '2023',
  },
  {
    name: 'Bayside Distribution Hub',
    location: 'Savannah, GA',
    type: 'Industrial',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    sqft: '120,000',
    year: '2025',
  },
  {
    name: 'Sterling Bridge Overpass',
    location: 'Denver, CO',
    type: 'Infrastructure',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80',
    sqft: '340,000',
    year: '2024',
  },
];

const NAV_LINKS = [
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHeroLoaded(true);
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ═══════════════════════════════════
          FILESTACK DEMO BANNER
         ═══════════════════════════════════ */}
      <div className="h-8 bg-[#0a0a0a] text-white flex items-center justify-center gap-3 px-4 text-[10px] font-medium tracking-wider z-[60] relative">
        <span className="opacity-60 uppercase">Filestack demo</span>
        <span className="text-white/20">·</span>
        <span className="hidden sm:inline opacity-60">Built on the Filestack File API</span>
        <span className="hidden sm:inline text-white/20">·</span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/filestack/filestack-use-cases"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-semibold uppercase hover:text-[#c4a77d] transition"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            View on GitHub
          </a>
          <span className="text-white/20">|</span>
          <a
            href="https://www.filestack.com/signup/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold uppercase text-[#c4a77d] hover:text-[#d4be9a] transition"
          >
            Get your API key →
          </a>
        </div>
      </div>

      {/* ═══════════════════════════════════
          NAVIGATION
         ═══════════════════════════════════ */}
      <header
        className={`fixed top-8 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <span
                className={`font-[var(--font-playfair)] text-2xl sm:text-3xl font-bold tracking-[0.12em] uppercase transition-colors duration-500 ${
                  scrolled ? 'text-[#0a0a0a]' : 'text-white'
                }`}
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                APEX
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 ${
                    scrolled
                      ? 'text-[#6b6b6b] hover:text-[#0a0a0a]'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}

              <Link
                href="/login"
                className={`text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 border-b-2 pb-0.5 ${
                  scrolled
                    ? 'text-[#0a0a0a] border-[#c4a77d]'
                    : 'text-white border-[#c4a77d]'
                }`}
              >
                Client Portal
              </Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2 transition-colors ${
                scrolled ? 'text-[#0a0a0a]' : 'text-white'
              }`}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-black/5 shadow-xl animate-fade-in">
            <div className="px-6 py-8 space-y-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm font-semibold tracking-[0.1em] uppercase text-[#2a2a2a] hover:text-[#c4a77d] transition"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/login"
                className="block btn-primary text-center mt-4"
                onClick={() => setMenuOpen(false)}
              >
                Client Portal
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════
          HERO — Full-Screen Cinematic
         ═══════════════════════════════════ */}
      <section ref={heroRef} className="relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=2400&q=80"
            alt="Modern architectural construction"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-end h-full pb-24 lg:pb-32">
          <div className="mx-auto max-w-[1400px] w-full px-6 lg:px-12">
            {heroLoaded && (
              <div className="max-w-3xl space-y-6">
                <h1
                  className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-[0.95] tracking-[-0.02em] animate-fade-up"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Building<br />
                  Tomorrow&apos;s<br />
                  Landmarks
                </h1>

                <p className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed font-light animate-fade-up delay-200">
                  APEX is a premier construction and development firm delivering
                  iconic commercial towers, luxury residences, and critical infrastructure
                  across North America.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 animate-fade-up delay-300">
                  <Link href="/login" className="btn-accent">
                    Request a Quote <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a href="#portfolio" className="btn-secondary border-white/30 text-white hover:bg-white hover:text-[#0a0a0a]">
                    View Portfolio
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#stats"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50 hover:text-white transition animate-fade-in delay-700"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase font-medium">Scroll</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </a>
      </section>

      {/* ═══════════════════════════════════
          STATS BAR
         ═══════════════════════════════════ */}
      <section id="stats" className="bg-[#0a0a0a] text-white py-16 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <StatItem value="$2.4B" label="Portfolio Value" />
            <StatItem value="1.8M" label="Sq. Ft. Developed" />
            <StatItem value="120+" label="Projects Completed" />
            <StatItem value="15" label="Years of Excellence" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          ABOUT / INTRO
         ═══════════════════════════════════ */}
      <section id="about" className="py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="section-label">About APEX</span>
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Defining Skylines.<br />
                Crafting Legacy.
              </h2>
              <p className="text-base text-[#6b6b6b] leading-relaxed max-w-lg font-light">
                APEX Development Group is the nation&apos;s foremost construction
                and engineering firm specializing in iconic commercial towers,
                luxury hillside residences, industrial mega-facilities, and
                critical infrastructure. Every project begins with visionary
                architecture and precision engineering.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://www.filestack.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[11px] text-[#8a8a8a] hover:text-[#0a0a0a] transition font-medium"
                >
                  <span className="tracking-[0.08em] uppercase">Blueprint engine powered by</span>
                  <FilestackLogo className="h-4" />
                </a>
              </div>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80"
                alt="Architectural construction"
                className="h-full w-full object-cover img-zoom"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white/80 text-sm font-light tracking-wide">
                  Sterling Bridge, Denver CO — Structural steel erection, 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          PORTFOLIO — Grid Gallery
         ═══════════════════════════════════ */}
      <section id="portfolio" className="bg-[#f5f5f3] py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <span className="section-label">Portfolio</span>
              <h2
                className="text-4xl sm:text-5xl font-bold tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Featured Projects
              </h2>
            </div>
            <Link
              href="/login"
              className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#0a0a0a] hover:text-[#c4a77d] transition flex items-center gap-2 self-start md:self-auto"
            >
              Submit Your Design <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {PORTFOLIO_PROJECTS.map((project, idx) => (
              <PortfolioCard key={idx} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          SERVICES
         ═══════════════════════════════════ */}
      <section id="services" className="py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="section-label">Services</span>
            <h2
              className="text-4xl sm:text-5xl font-bold tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Full-Spectrum Development
            </h2>
            <p className="text-base text-[#6b6b6b] font-light leading-relaxed">
              From architectural blueprint review to structural completion —
              every phase managed with precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e8e8e8]">
            <ServiceCard
              title="Blueprint & CAD Review"
              description="Upload AutoCAD DWG, DXF, and PDF architectural drawings. Our structural engineers validate foundation loads and deliver detailed cost assessments through Filestack's document processing pipeline."
            />
            <ServiceCard
              title="Structural Engineering"
              description="PE-stamped structural analysis covering deep pile foundations, steel superstructure framing, seismic compliance, and load-bearing validation for projects up to 50 stories."
            />
            <ServiceCard
              title="Commercial Development"
              description="End-to-end development of commercial office towers, mixed-use complexes, and corporate headquarters — from land acquisition through certificate of occupancy."
            />
            <ServiceCard
              title="Luxury Residential"
              description="Custom estate construction featuring cantilevered steel frames, curtain wall glazing, geothermal HVAC integration, and precision-crafted interior finishing."
            />
            <ServiceCard
              title="Industrial & Logistics"
              description="High-bay warehouses, automated distribution centers, cold storage facilities, and heavy manufacturing plants with reinforced concrete foundations."
            />
            <ServiceCard
              title="Infrastructure"
              description="Highway overpasses, bridge reconstruction, utility corridors, and municipal infrastructure projects requiring civil engineering expertise and permitting."
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          CTA — Request Quote
         ═══════════════════════════════════ */}
      <section id="contact" className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=2400&q=80"
            alt="Construction site"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Ready to Build?
            </h2>
            <p className="text-lg text-white/60 font-light leading-relaxed">
              Submit your architectural drawings and receive a comprehensive
              structural estimate from our engineering team.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/login" className="btn-accent">
                Request a Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="btn-secondary border-white/30 text-white hover:bg-white hover:text-[#0a0a0a]">
                Client Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          FOOTER
         ═══════════════════════════════════ */}
      <footer className="bg-[#0a0a0a] text-white py-16">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/10">
            <div className="space-y-4">
              <span
                className="text-2xl font-bold tracking-[0.12em] uppercase"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                APEX
              </span>
              <p className="text-sm text-white/40 font-light leading-relaxed max-w-xs">
                Premier construction and development firm delivering iconic
                structures across North America.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/50">Navigation</h4>
              <div className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-sm text-white/60 hover:text-white transition"
                  >
                    {link.label}
                  </a>
                ))}
                <Link href="/login" className="block text-sm text-[#c4a77d] hover:text-[#d4be9a] transition">
                  Client Portal
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/50">Technology</h4>
              <a
                href="https://www.filestack.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 border border-white/10 rounded px-4 py-2.5 hover:border-white/20 transition"
              >
                <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-white/40">Powered by</span>
                <FilestackLogo className="h-4" invert />
              </a>
              <p className="text-xs text-white/30 leading-relaxed">
                Blueprint processing, CAD file delivery, and document transformations
                powered by the Filestack File API.
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-white/30">
            <p>© {new Date().getFullYear()} APEX Development Group. Filestack demo application.</p>
            <p className="font-mono">AutoCAD DWG · DXF · PDF · BIM · Filestack CDN</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Subcomponents
   ───────────────────────────────────────────── */

const StatItem: FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center lg:text-left">
    <p
      className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight"
      style={{ fontFamily: 'var(--font-playfair)' }}
    >
      {value}
    </p>
    <p className="mt-2 text-[11px] tracking-[0.12em] uppercase text-white/40 font-medium">
      {label}
    </p>
  </div>
);

const PortfolioCard: FC<{
  project: (typeof PORTFOLIO_PROJECTS)[number];
}> = ({ project }) => (
  <div className="group relative aspect-[4/3] overflow-hidden cursor-pointer">
    <img
      src={project.image}
      alt={project.name}
      className="h-full w-full object-cover img-zoom"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

    {/* Top badge */}
    <div className="absolute top-6 left-6">
      <span className="pill bg-white/90 text-[#0a0a0a]">{project.type}</span>
    </div>

    {/* Bottom info */}
    <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
      <h3
        className="text-xl sm:text-2xl font-bold text-white leading-tight tracking-tight"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {project.name}
      </h3>
      <div className="flex items-center gap-3 mt-2 text-[11px] text-white/60 font-medium tracking-wide">
        <span>{project.location}</span>
        <span className="text-white/20">·</span>
        <span>{project.sqft} sq ft</span>
        <span className="text-white/20">·</span>
        <span>{project.year}</span>
      </div>
    </div>
  </div>
);

const ServiceCard: FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="bg-white p-8 lg:p-10 space-y-4 group hover:bg-[#fafaf8] transition-colors duration-300">
    <h3
      className="text-lg sm:text-xl font-semibold text-[#0a0a0a] tracking-tight"
      style={{ fontFamily: 'var(--font-playfair)' }}
    >
      {title}
    </h3>
    <p className="text-sm text-[#6b6b6b] leading-relaxed font-light">{description}</p>
    <div className="w-8 h-px bg-[#c4a77d] group-hover:w-16 transition-all duration-500" />
  </div>
);
