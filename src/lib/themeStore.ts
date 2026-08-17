import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeMode } from '../types';

export type AccentColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'purple';
export type VideoLayout = 'split' | 'pip' | 'cinema';
export type FrameStyle = 'rounded' | 'sharp' | 'glow' | 'glass';

interface ThemeState {
  mode: ThemeMode;
  accentColor: AccentColor;
  videoLayout: VideoLayout;
  frameStyle: FrameStyle;
  setMode: (mode: ThemeMode) => void;
  setAccentColor: (accent: AccentColor) => void;
  setVideoLayout: (layout: VideoLayout) => void;
  setFrameStyle: (style: FrameStyle) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      accentColor: 'indigo',
      videoLayout: 'split',
      frameStyle: 'rounded',

      setMode: (mode) => {
        document.documentElement.classList.remove('dark', 'light', 'glass');
        document.documentElement.classList.add(mode);
        set({ mode });
      },

      setAccentColor: (accentColor) => set({ accentColor }),
      setVideoLayout: (videoLayout) => set({ videoLayout }),
      setFrameStyle: (frameStyle) => set({ frameStyle }),

      toggleTheme: () =>
        set((state) => {
          const nextMode: ThemeMode =
            state.mode === 'dark' ? 'light' : state.mode === 'light' ? 'glass' : 'dark';
          document.documentElement.classList.remove('dark', 'light', 'glass');
          document.documentElement.classList.add(nextMode);
          return { mode: nextMode };
        }),
    }),
    {
      name: 'justyou-theme-settings',
    }
  )
);
