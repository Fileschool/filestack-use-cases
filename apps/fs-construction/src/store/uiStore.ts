import { create } from 'zustand';

interface IUIStoreState {
  isQuoteModalOpen: boolean;
  isLoginModalOpen: boolean;
  isDetailModalOpen: boolean;
  activeTab: 'landing' | 'admin' | 'projects';
}

interface IUIStoreActions {
  setQuoteModalOpen: (open: boolean) => void;
  setLoginModalOpen: (open: boolean) => void;
  setDetailModalOpen: (open: boolean) => void;
  setActiveTab: (tab: 'landing' | 'admin' | 'projects') => void;
}

export const useUIStore = create<IUIStoreState & IUIStoreActions>((set) => ({
  isQuoteModalOpen: false,
  isLoginModalOpen: false,
  isDetailModalOpen: false,
  activeTab: 'landing',

  setQuoteModalOpen: (isQuoteModalOpen) => set({ isQuoteModalOpen }),
  setLoginModalOpen: (isLoginModalOpen) => set({ isLoginModalOpen }),
  setDetailModalOpen: (isDetailModalOpen) => set({ isDetailModalOpen }),
  setActiveTab: (activeTab) => set({ activeTab }),
}));
