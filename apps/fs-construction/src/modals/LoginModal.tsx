'use client';

import { FC } from 'react';
import { IModalProps } from '@/interfaces/modal.interface';
import { LoginForm } from '@/forms/LoginForm';
import { X, ShieldCheck } from 'lucide-react';

export const LoginModal: FC<IModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-brand-200 bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-brand-100 bg-brand-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-accent-500" />
            <h2 className="text-sm font-bold text-brand-950">Simulated Role Login</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-brand-400 hover:bg-brand-100 hover:text-brand-900 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <LoginForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
};
