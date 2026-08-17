import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useNavigationStore } from '../../lib/navigationStore';
import { Button } from '../ui/Button';

export const CallToActionSection: React.FC = () => {
  const { setCurrentPage } = useNavigationStore();

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden border-t border-slate-900">
      <div className="glow-orb-purple bottom-0 left-1/3 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-950 border border-indigo-500/30 rounded-3xl p-10 sm:p-16 space-y-6 shadow-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Ready for Global Connections?
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Experience the Future of Random Communication.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            No endless sign-up forms. No intrusive tracking. Instant WebRTC matching with people across the world in milliseconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              variant="gradient"
              size="xl"
              onClick={() => setCurrentPage('video')}
              leftIcon={<Zap className="w-5 h-5 fill-current" />}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Start Instant Matching
            </Button>
            <Button
              variant="glass"
              size="xl"
              onClick={() => setCurrentPage('design-system')}
            >
              Explore Design System
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
