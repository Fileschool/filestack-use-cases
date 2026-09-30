'use client';

import { FC } from 'react';
import { IModalProps } from '@/interfaces/modal.interface';
import { QuoteRequestForm } from '@/forms/QuoteRequestForm';
import { X, Building2 } from 'lucide-react';

export const QuoteRequestModal: FC<IModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-[#e8e8e8] shadow-2xl overflow-hidden my-8 animate-scale-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e8e8e8] bg-[#fafaf8] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-[#0a0a0a] text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0a0a0a]" style={{ fontFamily: 'var(--font-playfair)' }}>
                Submit Design for Quote
              </h2>
              <p className="text-[11px] text-[#8a8a8a] font-light">Powered by Filestack Blueprint Engine</p>
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
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <QuoteRequestForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
};
