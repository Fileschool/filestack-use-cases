'use client';

import { FC } from 'react';
import { Eye, MapPin, Building2, Layers, ArrowUpRight } from 'lucide-react';
import { useQuoteStore } from '@/store/quoteStore';
import { useUIStore } from '@/store/uiStore';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { IQuoteRequest } from '@/interfaces/quote.interface';

const PROJECT_IMAGES: Record<string, string> = {
  commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  residential: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  industrial: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
  infrastructure: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
  renovation: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
};

export const PortfolioSection: FC = () => {
  const { quotes, setSelectedQuote, searchQuery } = useQuoteStore();
  const { setDetailModalOpen, setQuoteModalOpen } = useUIStore();

  const filteredQuotes = quotes.filter((q) => {
    if (!searchQuery) return true;
    const s = searchQuery.toLowerCase();
    return (
      q.projectName.toLowerCase().includes(s) ||
      q.location.toLowerCase().includes(s) ||
      q.projectType.toLowerCase().includes(s)
    );
  });

  const handleInspectQuote = (quote: IQuoteRequest) => {
    setSelectedQuote(quote);
    setDetailModalOpen(true);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#e8e8e8]">
          <div className="space-y-2">
            <span className="section-label">Your Projects</span>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              CAD Submissions & Estimates
            </h2>
            <p className="text-sm text-[#8a8a8a] font-light">
              View your submitted architectural designs and structural cost estimates.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setQuoteModalOpen(true)}
            className="btn-primary text-[11px] self-start md:self-auto"
          >
            + Submit New Design
          </button>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuotes.map((quote) => {
            const firstFile = quote.designFiles[0];
            const bgImage = PROJECT_IMAGES[quote.projectType] || PROJECT_IMAGES.commercial;

            return (
              <div
                key={quote.id}
                className="group bg-white border border-[#e8e8e8] overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={bgImage}
                    alt={quote.projectName}
                    className="h-full w-full object-cover img-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                  {/* Top badges */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <span className="pill bg-white/90 text-[#0a0a0a]">
                      {quote.projectType}
                    </span>
                    <span className="pill bg-[#0a0a0a]/80 text-white font-mono text-[10px]">
                      {quote.desiredTimeline}
                    </span>
                  </div>

                  {/* Bottom overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                    <div>
                      <span className="text-[10px] font-semibold text-[#c4a77d] uppercase tracking-widest block">
                        Estimated Budget
                      </span>
                      <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {formatCurrency(quote.targetBudget)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-mono text-white/80 bg-black/50 px-2 py-1 backdrop-blur-sm">
                      <Layers className="h-3.5 w-3.5 text-[#c4a77d]" />
                      <span className="truncate max-w-[100px]">{firstFile?.filename || 'CAD_File.dwg'}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3
                      className="text-lg font-semibold text-[#0a0a0a] group-hover:text-[#c4a77d] transition flex items-center justify-between"
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      <span className="truncate">{quote.projectName}</span>
                      <ArrowUpRight className="h-4 w-4 text-[#d4d4d4] group-hover:text-[#c4a77d] shrink-0" />
                    </h3>
                    <p className="mt-1 text-xs text-[#8a8a8a] line-clamp-2 leading-relaxed font-light">
                      {quote.description}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-3 text-xs border-t border-b border-[#f5f5f3] py-3 text-[#6b6b6b]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#c4a77d] shrink-0" />
                      <span className="truncate">{quote.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-[#c4a77d] shrink-0" />
                      <span>{formatNumber(quote.squareFootage)} sq ft</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInspectQuote(quote)}
                    className="btn-primary text-[11px] w-full py-2.5"
                  >
                    <Eye className="h-3.5 w-3.5" /> View Blueprint & Estimate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
