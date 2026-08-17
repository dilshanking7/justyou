import React from 'react';
import { ShieldCheck, AlertOctagon, HeartHandshake, Eye } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export const SafetyPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4">
        <Badge variant="primary" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
          Safety Center
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Community Safety & Trust Guidelines
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Creating a welcoming, safe environment for random connections worldwide is our top priority.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass" padding="lg" className="space-y-3">
          <AlertOctagon className="w-6 h-6 text-rose-400" />
          <h3 className="text-base font-bold text-white">Instant Peer Block</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Click the report button at any time during a call to instantly disconnect, block the peer, and submit a safety report.
          </p>
        </Card>

        <Card variant="glass" padding="lg" className="space-y-3">
          <Eye className="w-6 h-6 text-amber-400" />
          <h3 className="text-base font-bold text-white">Automated AI Moderation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time privacy-preserving edge models detect inappropriate visual content without saving or recording streams.
          </p>
        </Card>

        <Card variant="glass" padding="lg" className="space-y-3">
          <HeartHandshake className="w-6 h-6 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Zero Tolerance Policy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hate speech, harassment, nudity, and fraudulent behavior incur permanent hardware and network bans.
          </p>
        </Card>
      </div>
    </div>
  );
};
