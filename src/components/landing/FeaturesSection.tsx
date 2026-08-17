import React from 'react';
import { motion } from 'motion/react';
import { Zap, Lock, Palette, Video, Volume2, Shield } from 'lucide-react';
import { FEATURES } from '../../constants/features';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const FeaturesSection: React.FC = () => {
  const iconMap: Record<string, React.ReactNode> = {
    Zap: <Zap className="w-6 h-6 text-amber-400" />,
    Lock: <Lock className="w-6 h-6 text-indigo-400" />,
    Palette: <Palette className="w-6 h-6 text-cyan-400" />,
    Video: <Video className="w-6 h-6 text-emerald-400" />,
    Volume2: <Volume2 className="w-6 h-6 text-fuchsia-400" />,
    Shield: <Shield className="w-6 h-6 text-rose-400" />,
  };

  return (
    <section className="py-20 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="gradient" size="md">
            Architectural Excellence
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered for Pure Speed & Frictionless Design
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Every component, route, and layout token in justyou is crafted to give you the performance of Linear and the aesthetic warmth of Apple.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, index) => {
            const icon = iconMap[feat.iconName] || <Zap className="w-6 h-6 text-indigo-400" />;

            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card variant="glass" padding="lg" className="h-full flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform">
                        {icon}
                      </div>
                      {feat.tag && <Badge variant="glass">{feat.tag}</Badge>}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">{feat.title}</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{feat.description}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>STATUS: OPERATIONAL</span>
                    <span className="text-indigo-400">0.02ms</span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
