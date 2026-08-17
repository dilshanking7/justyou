import { create } from 'zustand';
import { LanguageCode, PageKey } from '../types';

interface NavigationState {
  currentPage: PageKey;
  previousPage: PageKey | null;
  language: LanguageCode;
  isCommandPaletteOpen: boolean;
  isMobileMenuOpen: boolean;
  isSidebarCollapsed: boolean;
  setCurrentPage: (page: PageKey) => void;
  setLanguage: (lang: LanguageCode) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPage: 'landing',
  previousPage: null,
  language: 'en',
  isCommandPaletteOpen: false,
  isMobileMenuOpen: false,
  isSidebarCollapsed: false,
  setCurrentPage: (page) =>
    set((state) => {
      if (state.currentPage === page) return state;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return {
        previousPage: state.currentPage,
        currentPage: page,
        isMobileMenuOpen: false,
      };
    }),
  setLanguage: (language) => set({ language }),
  setCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),
  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
