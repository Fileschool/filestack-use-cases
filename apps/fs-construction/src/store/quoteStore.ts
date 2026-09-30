import { create } from 'zustand';
import { IQuoteRequest, QuoteStatus, ProjectType } from '@/interfaces/quote.interface';
import { INITIAL_DEMO_QUOTES } from '@/lib/constants';

interface IQuoteStoreState {
  quotes: IQuoteRequest[];
  selectedQuote: IQuoteRequest | null;
  statusFilter: QuoteStatus | 'all';
  typeFilter: ProjectType | 'all';
  searchQuery: string;
}

interface IQuoteStoreActions {
  setQuotes: (quotes: IQuoteRequest[]) => void;
  setSelectedQuote: (quote: IQuoteRequest | null) => void;
  setStatusFilter: (status: QuoteStatus | 'all') => void;
  setTypeFilter: (type: ProjectType | 'all') => void;
  setSearchQuery: (query: string) => void;
  addQuote: (quote: IQuoteRequest) => void;
  updateQuoteInStore: (updatedQuote: IQuoteRequest) => void;
  removeQuoteFromStore: (id: string) => void;
}

export const useQuoteStore = create<IQuoteStoreState & IQuoteStoreActions>((set) => ({
  quotes: INITIAL_DEMO_QUOTES,
  selectedQuote: null,
  statusFilter: 'all',
  typeFilter: 'all',
  searchQuery: '',

  setQuotes: (quotes) => set({ quotes }),
  setSelectedQuote: (selectedQuote) => set({ selectedQuote }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  addQuote: (quote) =>
    set((state) => ({
      quotes: [quote, ...state.quotes],
    })),

  updateQuoteInStore: (updatedQuote) =>
    set((state) => ({
      quotes: state.quotes.map((q) => (q.id === updatedQuote.id ? updatedQuote : q)),
      selectedQuote: state.selectedQuote?.id === updatedQuote.id ? updatedQuote : state.selectedQuote,
    })),

  removeQuoteFromStore: (id) =>
    set((state) => ({
      quotes: state.quotes.filter((q) => q.id !== id),
      selectedQuote: state.selectedQuote?.id === id ? null : state.selectedQuote,
    })),
}));
