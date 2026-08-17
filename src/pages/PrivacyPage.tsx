import React from 'react';
import { Shield, Lock, EyeOff } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3">
        <Badge variant="success" icon={<Shield className="w-3.5 h-3.5" />}>
          Privacy Policy
        </Badge>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Zero-Logs Privacy Guarantee
        </h1>
        <p className="text-xs font-mono text-slate-500">Last updated: July 2026 • Version 1.0.0</p>
      </div>

      <Card variant="glass" padding="lg" className="space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" /> 1. Peer-to-Peer Encryption
          </h3>
          <p>
            All media streams (audio, video) and peer-to-peer data channels created on justyou utilize direct DTLS 1.2 / SRTP protocol encryption. Communication happens directly between user clients (P2P) whenever network topography allows.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-emerald-400" /> 2. Zero-Data Logging Policy
          </h3>
          <p>
            We do NOT store, index, sell, or archive chat messages, video frames, audio recordings, or IP address history on disk. Transient signaling metadata is held in-memory purely to negotiate connection handshakes and is wiped immediately upon disconnection.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white">3. Third-Party Analytics</h3>
          <p>
            justyou does NOT use third-party advertising tracking pixels, cross-site cookies, or behavioral trackers.
          </p>
        </section>
      </Card>
    </div>
  );
};
