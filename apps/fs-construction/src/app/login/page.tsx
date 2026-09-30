'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, User, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { FilestackLogo } from '@/components/ui/FilestackLogo';

export default function LoginPage() {
  const router = useRouter();
  const { switchToAdmin, switchToClient } = useAuthStore();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  const handleLogin = (role: 'admin' | 'client') => {
    if (role === 'admin') {
      switchToAdmin();
    } else {
      switchToClient();
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* ─── Left Panel: Image ─── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80"
          alt="Modern building architecture"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />

        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <h2
            className="text-4xl font-bold text-white leading-[1.1] tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Your Architectural<br />
            Designs. Our<br />
            Engineering.
          </h2>
          <p className="text-sm text-white/50 font-light max-w-sm leading-relaxed">
            Upload your AutoCAD blueprints and receive structural cost
            estimates from our engineering team.
          </p>
        </div>
      </div>

      {/* ─── Right Panel: Login Form ─── */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em] uppercase text-[#6b6b6b] hover:text-[#0a0a0a] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <span
            className="text-xl font-bold tracking-[0.12em] uppercase text-[#0a0a0a]"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            APEX
          </span>
        </div>

        {/* Login Content */}
        <div className="flex-1 flex items-center justify-center px-8 pb-12">
          <div className="w-full max-w-md space-y-10">
            <div className="space-y-3">
              <span className="section-label">Client Portal</span>
              <h1
                className="text-3xl sm:text-4xl font-bold tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Sign In
              </h1>
              <p className="text-sm text-[#8a8a8a] font-light leading-relaxed">
                This is a simulated authentication for the Filestack demo.
                Select a role to explore the platform.
              </p>
            </div>

            {/* Role Selection Cards */}
            <div className="space-y-4">
              <RoleCard
                role="admin"
                title="Lead Architect"
                subtitle="Marcus Vance · Apex Engineering"
                description="Review submitted CAD blueprints, run document transformations, and generate structural cost estimates."
                icon={<Shield className="h-5 w-5" />}
                isHovered={hoveredRole === 'admin'}
                onHover={() => setHoveredRole('admin')}
                onLeave={() => setHoveredRole(null)}
                onClick={() => handleLogin('admin')}
              />

              <RoleCard
                role="client"
                title="Client User"
                subtitle="Jane Doe · Horizon Developments"
                description="Submit architectural drawings and design files for engineering review and cost estimation."
                icon={<User className="h-5 w-5" />}
                isHovered={hoveredRole === 'client'}
                onHover={() => setHoveredRole('client')}
                onLeave={() => setHoveredRole(null)}
                onClick={() => handleLogin('client')}
              />
            </div>

            {/* Powered by */}
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-[#e8e8e8]">
              <span className="text-[10px] tracking-[0.1em] uppercase text-[#b0b0b0] font-medium">Document processing by</span>
              <a href="https://www.filestack.com" target="_blank" rel="noreferrer">
                <FilestackLogo className="h-4 opacity-40 hover:opacity-70 transition" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Role Card
   ───────────────────────────────────────────── */
interface IRoleCardProps {
  role: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

const RoleCard: FC<IRoleCardProps> = ({
  title,
  subtitle,
  description,
  icon,
  isHovered,
  onHover,
  onLeave,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
    className={`w-full text-left p-6 border transition-all duration-300 group ${
      isHovered
        ? 'border-[#0a0a0a] bg-[#fafaf8] shadow-lg'
        : 'border-[#e8e8e8] bg-white hover:border-[#d4d4d4]'
    }`}
  >
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 transition-colors duration-300 ${
              isHovered ? 'bg-[#0a0a0a] text-white' : 'bg-[#f5f5f3] text-[#6b6b6b]'
            }`}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#0a0a0a]">{title}</h3>
            <p className="text-[11px] text-[#8a8a8a] font-medium">{subtitle}</p>
          </div>
        </div>

        <p className="text-xs text-[#8a8a8a] leading-relaxed font-light pl-[52px]">
          {description}
        </p>
      </div>

      <ArrowRight
        className={`h-4 w-4 mt-2 transition-all duration-300 shrink-0 ${
          isHovered ? 'text-[#0a0a0a] translate-x-0 opacity-100' : 'text-[#d4d4d4] -translate-x-2 opacity-0'
        }`}
      />
    </div>
  </button>
);
