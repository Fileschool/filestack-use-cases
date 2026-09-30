'use client';

import { FC, useState } from 'react';
import { IModalProps } from '@/interfaces/modal.interface';
import { useQuoteStore } from '@/store/quoteStore';
import { useRespondToQuote, useUpdateQuote } from '@/hooks/useQuotes';
import { FilestackViewer } from '@/components/features/FilestackViewer';
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils';
import { QuoteStatus } from '@/interfaces/quote.interface';
import { X, CheckCircle2, Send, Building2 } from 'lucide-react';

export const QuoteDetailModal: FC<IModalProps> = ({ isOpen, onClose }) => {
  const { selectedQuote } = useQuoteStore();
  const updateQuote = useUpdateQuote();
  const respondToQuote = useRespondToQuote();

  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [estimatedCost, setEstimatedCost] = useState<number>(selectedQuote?.targetBudget || 250000);
  const [timelineWeeks, setTimelineWeeks] = useState<number>(12);
  const [architectNotes, setArchitectNotes] = useState<string>('');
  const [isResponding, setIsResponding] = useState<boolean>(false);

  if (!isOpen || !selectedQuote) return null;

  const currentFile = selectedQuote.designFiles[activeFileIndex] || selectedQuote.designFiles[0];

  const handleStatusChange = async (newStatus: QuoteStatus) => {
    await updateQuote.mutateAsync({
      id: selectedQuote.id,
      dto: { status: newStatus },
    });
  };

  const handleSendEstimate = async () => {
    await respondToQuote.mutateAsync({
      id: selectedQuote.id,
      response: {
        estimatedCost,
        estimatedTimelineWeeks: timelineWeeks,
        architectNotes: architectNotes || 'Structural load analysis complete. Cost estimate calculated based on foundation & structural framing requirements.',
        costBreakdown: [
          { id: 'b1', category: 'Architectural & Engineering Signoff', description: 'PE Structural stamp & load validation', amount: Math.round(estimatedCost * 0.08) },
          { id: 'b2', category: 'Foundation & Earthwork', description: 'Excavation, grading & deep pile foundation', amount: Math.round(estimatedCost * 0.32) },
          { id: 'b3', category: 'Structural Superstructure', description: 'Steel framing, concrete slab & envelope', amount: Math.round(estimatedCost * 0.45) },
          { id: 'b4', category: 'MEP Integration & Permits', description: 'Electrical, HVAC & municipal permitting', amount: Math.round(estimatedCost * 0.15) },
        ],
        respondedAt: new Date().toISOString(),
        respondedBy: 'Marcus Vance (Lead Architect)',
      },
    });
    setIsResponding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white border border-[#e8e8e8] shadow-2xl overflow-hidden my-6 animate-scale-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e8e8e8] bg-[#fafaf8] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-[#0a0a0a] text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#0a0a0a]" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {selectedQuote.projectName}
                </h2>
                <span className="pill bg-[#f5f5f3] text-[#6b6b6b] border border-[#e8e8e8]">
                  {selectedQuote.projectType}
                </span>
              </div>
              <p className="text-xs text-[#8a8a8a] font-light mt-0.5">
                Client: {selectedQuote.clientName} ({selectedQuote.clientEmail})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#b0b0b0] hover:text-[#0a0a0a] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[82vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Scope & Status */}
            <div className="lg:col-span-5 space-y-4">
              {/* Status Bar */}
              <div className="border border-[#e8e8e8] bg-[#fafaf8] p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0a0a0a]">Quote Status</span>
                  <span className="font-mono text-[10px] text-[#b0b0b0]">ID: {selectedQuote.id}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(['pending', 'in_review', 'quote_sent', 'approved'] as QuoteStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`flex-1 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition ${
                        selectedQuote.status === st
                          ? 'bg-[#0a0a0a] text-white'
                          : 'bg-white text-[#6b6b6b] hover:text-[#0a0a0a] border border-[#e8e8e8]'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Specs */}
              <div className="border border-[#e8e8e8] bg-white p-4 space-y-3 text-xs">
                <h3 className="section-title">Project Specifications</h3>
                <div className="space-y-2.5 text-[#3a3a3a]">
                  <SpecRow label="Target Budget" value={formatCurrency(selectedQuote.targetBudget)} valueClass="font-semibold text-emerald-700" />
                  <SpecRow label="Area" value={`${formatNumber(selectedQuote.squareFootage)} sq ft`} />
                  <SpecRow label="Location" value={selectedQuote.location} />
                  <SpecRow label="Desired Timeline" value={selectedQuote.desiredTimeline} />
                  <SpecRow label="Date Submitted" value={formatDate(selectedQuote.createdAt)} valueClass="font-mono text-[#8a8a8a]" />
                </div>

                <div className="pt-3 border-t border-[#f5f5f3]">
                  <p className="text-[10px] font-semibold text-[#0a0a0a] uppercase tracking-wider mb-1">Design Notes</p>
                  <p className="text-xs text-[#6b6b6b] leading-relaxed bg-[#fafaf8] p-3 border border-[#e8e8e8]">
                    {selectedQuote.description}
                  </p>
                </div>
              </div>

              {/* Attached Files */}
              {selectedQuote.designFiles.length > 1 && (
                <div className="border border-[#e8e8e8] bg-[#fafaf8] p-3 space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a8a8a]">
                    Attached Files ({selectedQuote.designFiles.length})
                  </p>
                  <div className="space-y-1">
                    {selectedQuote.designFiles.map((file, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveFileIndex(idx)}
                        className={`flex w-full items-center justify-between p-2 text-xs transition ${
                          activeFileIndex === idx
                            ? 'bg-[#0a0a0a] text-white font-semibold'
                            : 'bg-white text-[#6b6b6b] border border-[#e8e8e8] hover:bg-[#f5f5f3]'
                        }`}
                      >
                        <span className="truncate">{file.filename}</span>
                        <span className="font-mono text-[10px] opacity-70">{file.mimetype.split('/')[1]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Filestack Viewer */}
            <div className="lg:col-span-7 space-y-4">
              {currentFile ? (
                <FilestackViewer file={currentFile} />
              ) : (
                <div className="flex h-64 items-center justify-center border border-[#e8e8e8] bg-[#fafaf8] text-[#b0b0b0]">
                  No CAD design file attached.
                </div>
              )}

              {/* Response / Estimate Form */}
              {selectedQuote.response ? (
                <div className="border border-emerald-200 bg-emerald-50/60 p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Estimate Response Delivered
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600">
                      {formatDate(selectedQuote.response.respondedAt)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] text-[#8a8a8a] uppercase tracking-wider">Total Estimated Cost</p>
                      <p className="text-lg text-emerald-700 font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {formatCurrency(selectedQuote.response.estimatedCost)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#8a8a8a] uppercase tracking-wider">Estimated Timeline</p>
                      <p className="text-base font-semibold text-[#0a0a0a]">{selectedQuote.response.estimatedTimelineWeeks} Weeks</p>
                    </div>
                  </div>
                  <p className="text-[#6b6b6b] text-xs bg-white p-3 border border-emerald-200">
                    {selectedQuote.response.architectNotes}
                  </p>
                </div>
              ) : (
                <div className="border border-[#e8e8e8] bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="section-title">Generate Structural Estimate</h3>
                    <button
                      type="button"
                      onClick={() => setIsResponding(!isResponding)}
                      className="text-xs font-semibold text-[#c4a77d] hover:text-[#a68a5b] transition"
                    >
                      {isResponding ? 'Cancel' : '+ Create Estimate'}
                    </button>
                  </div>

                  {isResponding && (
                    <div className="space-y-3 pt-2 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="field-label">Estimated Cost ($)</label>
                          <input
                            type="number"
                            value={estimatedCost}
                            onChange={(e) => setEstimatedCost(Number(e.target.value))}
                            className="input"
                          />
                        </div>
                        <div>
                          <label className="field-label">Timeline (Weeks)</label>
                          <input
                            type="number"
                            value={timelineWeeks}
                            onChange={(e) => setTimelineWeeks(Number(e.target.value))}
                            className="input"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="field-label">Architect Notes & Breakdown</label>
                        <textarea
                          rows={2}
                          value={architectNotes}
                          onChange={(e) => setArchitectNotes(e.target.value)}
                          placeholder="Specify PE load validation, steel framing fees, and foundation estimate..."
                          className="input"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleSendEstimate}
                        disabled={respondToQuote.isPending}
                        className="btn-primary w-full py-2.5"
                      >
                        <Send className="h-4 w-4" /> Deliver Estimate to Client
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Helper */
const SpecRow: FC<{ label: string; value: string; valueClass?: string }> = ({ label, value, valueClass = 'font-semibold text-[#0a0a0a]' }) => (
  <div className="flex items-center justify-between">
    <span className="text-[#8a8a8a]">{label}</span>
    <span className={valueClass}>{value}</span>
  </div>
);
