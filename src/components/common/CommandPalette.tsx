import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight, Sparkles, X } from 'lucide-react';
import { useNavigationStore } from '../../lib/navigationStore';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import { PUBLIC_NAV_ROUTES, MODULE_ROUTES } from '../../constants/routes';
import { PageKey } from '../../types';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, setCurrentPage } = useNavigationStore();
  const [query, setQuery] = useState('');

  // Register Cmd+K / Ctrl+K keyboard shortcut
  useKeyboardShortcut('k', () => setCommandPaletteOpen(true), true);

  if (!isCommandPaletteOpen) return null;

  const allRoutes = [...PUBLIC_NAV_ROUTES, ...MODULE_ROUTES];
  const filteredRoutes = allRoutes.filter(
    (r) =>
      r.label.toLowerCase().includes(query.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(query.toLowerCase()))
  );

  const handleSelectRoute = (key: PageKey) => {
    setCurrentPage(key);
    setCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCommandPaletteOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Search Palette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative w-full max-w-xl glass-panel bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl z-10 overflow-hidden"
        >
          {/* Input Header */}
          <div className="flex items-center px-4 border-b border-slate-800">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a page name or feature module... (e.g. Video, Chat, Safety)"
              className="w-full bg-transparent text-white placeholder-slate-500 text-sm py-4 px-3 focus:outline-none"
            />
            <button
              onClick={() => setCommandPaletteOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="p-2 max-h-80 overflow-y-auto space-y-1 scrollbar-none">
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map((route) => (
                <button
                  key={route.key}
                  onClick={() => handleSelectRoute(route.key)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">{route.label}</span>
                      {route.description && (
                        <span className="text-xs text-slate-400 block">{route.description}</span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                No matching pages or modules found for &quot;{query}&quot;.
              </div>
            )}
          </div>

          {/* Command Footer */}
          <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Use <kbd className="px-1 bg-slate-800 text-slate-300 rounded font-mono">↑</kbd>{' '}
              <kbd className="px-1 bg-slate-800 text-slate-300 rounded font-mono">↓</kbd> to navigate
            </span>
            <span>ESC to dismiss</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
