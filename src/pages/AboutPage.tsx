import React from 'react';
import { Sparkles, Shield, Cpu, Code2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4">
        <Badge variant="gradient">About justyou</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Pioneering Human Connections
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          justyou was created to solve the fundamental flaws of legacy web communications: invasive tracking, clunky interfaces, and sluggish connection latencies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass" padding="lg" className="space-y-3">
          <Cpu className="w-6 h-6 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Edge-First Architecture</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our signaling cluster is distributed across 30+ regional edge relays for sub-18ms WebRTC session establishment.
          </p>
        </Card>
        <Card variant="glass" padding="lg" className="space-y-3">
          <Shield className="w-6 h-6 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Privacy Guarantee</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We adhere to a strict zero-persistent-logs rule. Streams exist in-memory during active sessions and vanish instantly.
          </p>
        </Card>
        <Card variant="glass" padding="lg" className="space-y-3">
          <Code2 className="w-6 h-6 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Design Craftsmanship</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Combining Apple&apos;s tactile warmth with Linear&apos;s crisp efficiency to provide a fluid, accessible UI across desktop and mobile.
          </p>
        </Card>
      </div>
    </div>
  );
};
