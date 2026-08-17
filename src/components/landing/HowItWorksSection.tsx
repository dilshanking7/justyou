import React from 'react';
import { motion } from 'motion/react';
import { MousePointerClick, ShieldCheck, Video } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Select Communication Mode',
      description: 'Choose between Text Chat, 4K WebRTC Video, or Spatial Voice Lounges.',
      icon: <MousePointerClick className="w-6 h-6 text-indigo-400" />,
    },
    {
      step: '02',
      title: 'Instant Peer Matching',
      description: 'Global edge relays negotiate direct peer-to-peer WebRTC DTLS keys in < 18ms.',
      icon: <Video className="w-6 h-6 text-purple-400" />,
    },
    {
      step: '03',
      title: 'Private Conversation',
      description: 'Enjoy encrypted communication with zero tracking. Disconnect whenever you wish.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
    },
  ];

  return (
    <section className="py-20 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="glass">Frictionless Flow</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How It Works in 3 Steps
          </h2>
          <p className="text-sm text-slate-400">
            No mandatory registration required. Zero bloated software downloads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((st, idx) => (
            <motion.div
              key={st.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
            >
              <Card variant="glass" padding="lg" className="h-full relative space-y-4 group">
                <span className="text-4xl font-extrabold font-mono text-indigo-500/20 group-hover:text-indigo-400/40 transition-colors">
                  {st.step}
                </span>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 w-fit">{st.icon}</div>
                <h3 className="text-lg font-bold text-white">{st.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{st.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
