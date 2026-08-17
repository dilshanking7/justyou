import React from 'react';
import { CheckCircle2, XCircle, ShieldCheck, Zap, Lock, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const WhyChooseUsSection: React.FC = () => {
  const comparisons = [
    { feature: 'End-to-End Encryption (E2EE)', justyou: true, legacyApps: false },
    { feature: 'Zero Persistent Data Storage Policy', justyou: true, legacyApps: false },
    { feature: 'Sub-20ms P2P Edge Routing', justyou: true, legacyApps: false },
    { feature: 'Apple + Discord Glassmorphism UI', justyou: true, legacyApps: false },
    { feature: '4K 60FPS WebRTC Video Pipeline', justyou: true, legacyApps: false },
    { feature: 'Spatial WebAudio 3D Lounges', justyou: true, legacyApps: false },
  ];

  return (
    <section className="py-20 bg-slate-950/80 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="primary">Why Choose justyou</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built Different. Built For You.
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Compare justyou against legacy platforms that sell user telemetry and deliver pixelated streams.
          </p>
        </div>

        <Card variant="glass" padding="lg" className="max-w-4xl mx-auto overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-mono uppercase text-slate-400">
                  <th className="py-4 px-4">Architecture Metric</th>
                  <th className="py-4 px-4 text-center text-indigo-400 font-bold bg-indigo-500/10 rounded-t-xl">
                    justyou Platform
                  </th>
                  <th className="py-4 px-4 text-center">Legacy Web Chat Apps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {comparisons.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 font-medium text-slate-200">{row.feature}</td>
                    <td className="py-4 px-4 text-center bg-indigo-500/5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <XCircle className="w-5 h-5 text-rose-500/60 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
};
