'use client';

import { FC } from 'react';
import {
  Shield,
  Clock,
  DollarSign,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle2,
  FileText,
  Layers,
} from 'lucide-react';
import { useQuoteStore } from '@/store/quoteStore';
import { useUIStore } from '@/store/uiStore';
import { useQuotes, useDeleteQuote } from '@/hooks/useQuotes';
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils';
import { IQuoteRequest, QuoteStatus, ProjectType } from '@/interfaces/quote.interface';

export const AdminDashboard: FC = () => {
  const {
    quotes,
    statusFilter,
    typeFilter,
    searchQuery,
    setStatusFilter,
    setTypeFilter,
    setSearchQuery,
    setSelectedQuote,
  } = useQuoteStore();

  const { setDetailModalOpen } = useUIStore();
  const deleteQuote = useDeleteQuote();

  const { isLoading } = useQuotes({
    status: statusFilter,
    projectType: typeFilter,
    search: searchQuery,
  });

  const filteredQuotes = quotes.filter((q) => {
    if (statusFilter !== 'all' && q.status !== statusFilter) return false;
    if (typeFilter !== 'all' && q.projectType !== typeFilter) return false;
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      return (
        q.projectName.toLowerCase().includes(s) ||
        q.clientName.toLowerCase().includes(s) ||
        q.companyName?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const totalValue = quotes.reduce((acc, q) => acc + q.targetBudget, 0);
  const pendingCount = quotes.filter((q) => q.status === 'pending' || q.status === 'in_review').length;
  const sentCount = quotes.filter((q) => q.status === 'quote_sent' || q.status === 'approved').length;

  const handleInspect = (quote: IQuoteRequest) => {
    setSelectedQuote(quote);
    setDetailModalOpen(true);
  };

  const getStatusBadge = (status: QuoteStatus) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-50 text-amber-800 border border-amber-200',
      in_review: 'bg-blue-50 text-blue-800 border border-blue-200',
      quote_sent: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      approved: 'bg-purple-50 text-purple-800 border border-purple-200',
    };
    return (
      <span className={`pill ${styles[status] || 'bg-gray-50 text-gray-700 border border-gray-200'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#e8e8e8]">
          <div className="space-y-2">
            <span className="section-label flex items-center gap-2">
              <Shield className="h-3.5 w-3.5" /> Lead Architect Portal
            </span>
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Quote Requests & CAD Review
            </h1>
            <p className="text-sm text-[#8a8a8a] font-light">
              Review client AutoCAD submissions, run document transformations, and generate structural estimates.
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Requests"
            value={quotes.length.toString()}
            sublabel="Submitted design files"
            icon={<FileText className="h-5 w-5" />}
            iconColor="text-[#c4a77d]"
          />
          <MetricCard
            label="Needs Review"
            value={pendingCount.toString()}
            sublabel="Pending structural analysis"
            icon={<Clock className="h-5 w-5" />}
            iconColor="text-blue-500"
            valueColor="text-blue-600"
          />
          <MetricCard
            label="Estimates Sent"
            value={sentCount.toString()}
            sublabel="Quotes delivered to client"
            icon={<CheckCircle2 className="h-5 w-5" />}
            iconColor="text-emerald-500"
            valueColor="text-emerald-600"
          />
          <MetricCard
            label="Pipeline Value"
            value={formatCurrency(totalValue)}
            sublabel="Cumulative budget scope"
            icon={<DollarSign className="h-5 w-5" />}
            iconColor="text-[#c4a77d]"
          />
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border border-[#e8e8e8]">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#b0b0b0]" />
            <input
              type="text"
              placeholder="Search project, client, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#b0b0b0]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as QuoteStatus | 'all')}
                className="input py-2 px-3 text-xs w-auto"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_review">In Review</option>
                <option value="quote_sent">Quote Sent</option>
                <option value="approved">Approved</option>
              </select>
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ProjectType | 'all')}
              className="input py-2 px-3 text-xs w-auto"
            >
              <option value="all">All Types</option>
              <option value="commercial">Commercial</option>
              <option value="residential">Residential</option>
              <option value="industrial">Industrial</option>
              <option value="infrastructure">Infrastructure</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#e8e8e8] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#e8e8e8] bg-[#fafaf8]">
              <tr className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a8a8a]">
                <th className="px-6 py-4">Project & Client</th>
                <th className="px-6 py-4">Scope & Budget</th>
                <th className="px-6 py-4">CAD Files</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f5f3]">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-[#b0b0b0]">
                    No matching architectural quote requests found.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-[#fafaf8] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-[#0a0a0a] text-sm">{quote.projectName}</p>
                        <p className="text-xs text-[#8a8a8a] mt-0.5">
                          {quote.clientName} · <span className="text-[#c4a77d] font-medium">{quote.companyName || quote.clientEmail}</span>
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-[#0a0a0a]">{formatCurrency(quote.targetBudget)}</p>
                        <p className="text-xs text-[#8a8a8a] mt-0.5">
                          {formatNumber(quote.squareFootage)} sq ft · {quote.location}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {quote.designFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[#6b6b6b] font-mono text-xs">
                            <Layers className="h-3.5 w-3.5 shrink-0 text-[#c4a77d]" />
                            <span className="truncate max-w-[180px]">{file.filename}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4">{getStatusBadge(quote.status)}</td>

                    <td className="px-6 py-4 text-[#8a8a8a] font-mono text-xs">
                      {formatDate(quote.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleInspect(quote)}
                          className="btn-secondary text-[10px] py-1.5 px-3"
                        >
                          <Eye className="h-3.5 w-3.5" /> Inspect
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteQuote.mutate(quote.id)}
                          className="p-1.5 text-[#d4d4d4] hover:text-rose-500 transition"
                          title="Delete Request"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Metric Card
   ───────────────────────────────────────────── */
interface IMetricCardProps {
  label: string;
  value: string;
  sublabel: string;
  icon: React.ReactNode;
  iconColor?: string;
  valueColor?: string;
}

const MetricCard: FC<IMetricCardProps> = ({
  label,
  value,
  sublabel,
  icon,
  iconColor = 'text-[#6b6b6b]',
  valueColor = 'text-[#0a0a0a]',
}) => (
  <div className="bg-white border border-[#e8e8e8] p-5">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a8a8a]">{label}</span>
      <span className={iconColor}>{icon}</span>
    </div>
    <p className={`mt-3 text-2xl font-bold tracking-tight ${valueColor}`} style={{ fontFamily: 'var(--font-playfair)' }}>
      {value}
    </p>
    <p className="mt-1 text-[11px] text-[#b0b0b0]">{sublabel}</p>
  </div>
);
