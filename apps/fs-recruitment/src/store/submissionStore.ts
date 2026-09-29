import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { IStoredFile } from '@/interfaces/filestack.interface';

export interface ISubmission {
  id: string;
  reference: string;
  submittedBy: string;
  submittedAt: string;
  file: IStoredFile;
  /** Whatever the processing chain worked out about this file. */
  extracted?: Record<string, string | undefined>;
  status: 'new' | 'processed' | 'held';
  note?: string;
}

interface ISubmissionState {
  submissions: ISubmission[];
}

interface ISubmissionActions {
  add: (submission: ISubmission) => void;
  update: (id: string, changes: Partial<ISubmission>) => void;
  remove: (id: string) => void;
  clear: () => void;
}

/**
 * What the public side uploads, so the staff side has something to review.
 * Persisted locally, which is why the two views share state without a server.
 */
export const useSubmissionStore = create<ISubmissionState & ISubmissionActions>()(
  persist(
    (set) => ({
      submissions: [],
      add: (submission) =>
        set((state) => ({ submissions: [submission, ...state.submissions] })),
      update: (id, changes) =>
        set((state) => ({
          submissions: state.submissions.map((item) =>
            item.id === id ? { ...item, ...changes } : item
          ),
        })),
      remove: (id) =>
        set((state) => ({ submissions: state.submissions.filter((i) => i.id !== id) })),
      clear: () => set({ submissions: [] }),
    }),
    { name: 'submissions' }
  )
);

export function newReference(prefix: string): string {
  const n = Math.floor(Math.random() * 90000) + 10000;
  return `${prefix}-${n}`;
}
