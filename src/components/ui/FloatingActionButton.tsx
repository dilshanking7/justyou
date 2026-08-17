import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, MessageSquare, Video, Mic, Sparkles } from 'lucide-react';
import { useNavigationStore } from '../../lib/navigationStore';
import { cn } from '../../lib/utils';

export const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setCurrentPage } = useNavigationStore();

  const actions = [
    { id: 'video', label: 'Video Call', icon: <Video className="w-4 h-4 text-emerald-400" />, onClick: () => setCurrentPage('video') },
    { id: 'chat', label: 'Text Chat', icon: <MessageSquare className="w-4 h-4 text-indigo-400" />, onClick: () => setCurrentPage('chat') },
    { id: 'voice', label: 'Voice Lounge', icon: <Mic className="w-4 h-4 text-amber-400" />, onClick: () => setCurrentPage('voice') },
    { id: 'studio', label: 'UI Studio', icon: <Sparkles className="w-4 h-4 text-pink-400" />, onClick: () => setCurrentPage('design-system') },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-end gap-2.5 mb-1">
            {actions.map((act, index) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2.5"
              >
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-200 shadow-lg backdrop-blur-md">
                  {act.label}
                </span>
                <button
                  onClick={() => {
                    act.onClick();
                    setIsOpen(false);
                  }}
                  className="p-3 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-white rounded-2xl shadow-xl transition-transform hover:scale-105 cursor-pointer"
                >
                  {act.icon}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl shadow-2xl shadow-indigo-500/40 border border-white/20 cursor-pointer',
          isOpen && 'rotate-45'
        )}
        aria-label="Quick Actions"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </motion.button>
    </div>
  );
};
