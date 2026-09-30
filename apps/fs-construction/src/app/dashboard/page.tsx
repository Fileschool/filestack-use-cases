'use client';

import { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { AdminDashboard } from '@/components/features/AdminDashboard';
import { PortfolioSection } from '@/components/features/PortfolioSection';
import { QuoteRequestModal } from '@/modals/QuoteRequestModal';
import { QuoteDetailModal } from '@/modals/QuoteDetailModal';
import { FilestackLogo } from '@/components/ui/FilestackLogo';
import { LogOut, Shield, User, PlusCircle, Building2, Layers } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { role, user, isAuthenticated, logout } = useAuthStore();
  const {
    isQuoteModalOpen,
    isDetailModalOpen,
    setQuoteModalOpen,
    setDetailModalOpen,
  } = useUIStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f3]">
        <div className="text-center space-y-6 max-w-sm">
          <div className="mx-auto h-16 w-16 bg-[#0a0a0a] flex items-center justify-center">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Authentication Required
          </h1>
          <p className="text-sm text-[#8a8a8a] font-light">
            Please sign in to access the APEX client portal.
          </p>
          <Link href="/login" className="btn-primary inline-flex">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f3]">
      {/* ─── Dashboard Navbar ─── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#e8e8e8]">
        {/* Top banner */}
        <div className="h-8 bg-[#0a0a0a] text-white flex items-center justify-center gap-3 px-4 text-[10px] font-medium tracking-wider">
          <span className="opacity-60 uppercase">Filestack demo</span>
          <span className="text-white/20">·</span>
          <span className="hidden sm:inline opacity-60">APEX Construction Portal</span>
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

        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between gap-6">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3">
              <span
                className="text-xl font-bold tracking-[0.12em] uppercase text-[#0a0a0a]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                APEX
              </span>
              <div className="hidden sm:block h-5 w-px bg-[#e8e8e8]" />
              <span className="hidden sm:inline text-[10px] font-semibold tracking-[0.12em] uppercase text-[#8a8a8a]">
                {role === 'admin' ? 'Architect Portal' : 'Client Portal'}
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQuoteModalOpen(true)}
                className="btn-primary text-[11px] py-2 px-4"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Submit Design</span>
              </button>

              {/* User Info */}
              <div className="flex items-center gap-3 pl-4 border-l border-[#e8e8e8]">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-semibold text-[#0a0a0a]">{user?.name}</span>
                  <span className="text-[10px] font-medium text-[#c4a77d] uppercase tracking-wider">
                    {role === 'admin' ? 'Lead Architect' : 'Client'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8a8a8a] hover:text-[#0a0a0a] transition px-3 py-1.5 border border-[#e8e8e8] hover:border-[#d4d4d4]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="pb-16">
        {role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <PortfolioSection />
        )}
      </main>

      {/* ─── Dashboard Footer ─── */}
      <footer className="border-t border-[#e8e8e8] bg-white py-8">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#b0b0b0]">
            © {new Date().getFullYear()} APEX Development Group. Filestack demo.
          </p>
          <a
            href="https://www.filestack.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2"
          >
            <span className="text-[10px] tracking-[0.08em] uppercase text-[#b0b0b0] font-medium">Powered by</span>
            <FilestackLogo className="h-3.5 opacity-40" />
          </a>
        </div>
      </footer>

      {/* ─── Modals ─── */}
      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
      <QuoteDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />
    </div>
  );
}
