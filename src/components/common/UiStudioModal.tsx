import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Monitor, Layout, Sparkles, X, Check, Eye } from 'lucide-react';
import { useThemeStore, AccentColor, VideoLayout, FrameStyle } from '../../lib/themeStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface UiStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCENT_COLORS: { id: AccentColor; name: string; bg: string; border: string }[] = [
  { id: 'indigo', name: 'Indigo Cyber', bg: 'bg-indigo-500', border: 'border-indigo-400' },
  { id: 'emerald', name: 'Emerald Matrix', bg: 'bg-emerald-500', border: 'border-emerald-400' },
  { id: 'rose', name: 'Neon Rose', bg: 'bg-rose-500', border: 'border-rose-400' },
  { id: 'amber', name: 'Amber Gold', bg: 'bg-amber-500', border: 'border-amber-400' },
  { id: 'cyan', name: 'Cyan Tech', bg: 'bg-cyan-500', border: 'border-cyan-400' },
  { id: 'purple', name: 'Royal Purple', bg: 'bg-purple-500', border: 'border-purple-400' },
];

const LAYOUT_OPTIONS: { id: VideoLayout; label: string; desc: string }[] = [
  { id: 'split', label: '50/50 OmeTV Split', desc: 'Equal size side-by-side video feeds' },
  { id: 'pip', label: 'Picture-in-Picture', desc: 'Main video stream with overlay corner feed' },
  { id: 'cinema', label: 'Cinema Wide View', desc: 'Wide-screen immersive focus mode' },
];

const FRAME_STYLES: { id: FrameStyle; label: string; desc: string }[] = [
  { id: 'rounded', label: 'Curved Glass', desc: 'Smooth rounded edges with subtle border' },
  { id: 'sharp', label: 'Futuristic Sharp', desc: 'Clean angular border lines' },
  { id: 'glow', label: 'Neon Glow Effect', desc: 'High contrast outer glow border' },
  { id: 'glass', label: 'Ultra Glassmorphism', desc: 'Translucent backdrop filter overlay' },
];

export const UiStudioModal: React.FC<UiStudioModalProps> = ({ isOpen, onClose }) => {
  const {
    mode,
    accentColor,
    videoLayout,
    frameStyle,
    setMode,
    setAccentColor,
    setVideoLayout,
    setFrameStyle,
  } = useThemeStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  UI Customization Studio
                  <Badge variant="primary" size="sm">
                    Real-time
                  </Badge>
                </h3>
                <p className="text-xs text-slate-400">Customize theme, accent colors, camera layouts & frame styles</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Options */}
          <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
            {/* 1. Theme Atmosphere */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Monitor className="w-4 h-4 text-indigo-400" /> Theme Atmosphere
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'dark', label: 'Dark Obsidian 🖤' },
                  { id: 'light', label: 'Clean Light ☀️' },
                  { id: 'glass', label: 'Glassmorphism ✨' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setMode(item.id as any)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                      mode === item.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    {mode === item.id && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Brand Accent Colors */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" /> Brand Accent Palette
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {ACCENT_COLORS.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setAccentColor(col.id)}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                      accentColor === col.id
                        ? `bg-slate-800 ${col.border} shadow-lg ring-2 ring-indigo-500/50`
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full ${col.bg} border border-white/20 shadow-inner`} />
                    <span className="text-[10px] font-semibold text-slate-300">{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Video Call Layout Style */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Layout className="w-4 h-4 text-emerald-400" /> Video Screen Layout
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LAYOUT_OPTIONS.map((lay) => (
                  <button
                    key={lay.id}
                    onClick={() => setVideoLayout(lay.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      videoLayout === lay.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{lay.label}</h4>
                      {videoLayout === lay.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">{lay.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Frame Borders & FX */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-cyan-400" /> Video Frame FX & Borders
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {FRAME_STYLES.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => setFrameStyle(frame.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      frameStyle === frame.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <h4 className="text-xs font-bold text-white">{frame.label}</h4>
                    <p className="text-[9px] text-slate-400 mt-1">{frame.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Settings save automatically to local preferences</span>
            <Button variant="gradient" onClick={onClose}>
              Apply & Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
