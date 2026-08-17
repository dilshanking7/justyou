import React from 'react';
import { Lock, Shield, EyeOff, KeyRound, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const SecuritySection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-950/90 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="success" icon={<Shield className="w-3.5 h-3.5" />}>
              Security Architecture
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Privacy by Design. Zero Data Retention.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              We believe privacy is a fundamental human right. justyou relies on direct WebRTC DTLS-SRTP encryption streams that bypass centralized cloud recording servers.
            </p>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Peer-to-peer media transport with zero server-side storage</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ephemeral in-memory signaling buffers purged immediately upon call end</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated real-time AI privacy safety moderation</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card variant="glass" padding="md" className="space-y-3">
              <Lock className="w-6 h-6 text-indigo-400" />
              <h4 className="text-sm font-bold text-white">DTLS 1.2 / SRTP</h4>
              <p className="text-xs text-slate-400">Industry military grade encryption standard</p>
            </Card>
            <Card variant="glass" padding="md" className="space-y-3">
              <EyeOff className="w-6 h-6 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">No Tracking Cookies</h4>
              <p className="text-xs text-slate-400">Zero ad pixels or third-party behavioral trackers</p>
            </Card>
            <Card variant="glass" padding="md" className="space-y-3">
              <KeyRound className="w-6 h-6 text-amber-400" />
              <h4 className="text-sm font-bold text-white">Ephemeral Keys</h4>
              <p className="text-xs text-slate-400">Fresh cryptographic keys generated for every session</p>
            </Card>
            <Card variant="glass" padding="md" className="space-y-3">
              <Shield className="w-6 h-6 text-rose-400" />
              <h4 className="text-sm font-bold text-white">Instant Ban Guard</h4>
              <p className="text-xs text-slate-400">Peer reporting blocks malicious actors instantly</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
