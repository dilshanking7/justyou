import React from 'react';
import { ShieldAlert, Activity, Server, AlertTriangle, Users } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const AdminPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" /> Admin Command Center
          </h1>
          <p className="text-xs text-slate-400">System health metrics and real-time moderation queue.</p>
        </div>
        <Badge variant="danger" icon={<Server className="w-3.5 h-3.5" />}>
          Staff Access Only
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card variant="glass" padding="md" className="space-y-1">
          <span className="text-xs text-slate-400">Active Peer Connections</span>
          <h3 className="text-2xl font-bold font-mono text-white">148,920</h3>
        </Card>
        <Card variant="glass" padding="md" className="space-y-1">
          <span className="text-xs text-slate-400">Moderation Tickets</span>
          <h3 className="text-2xl font-bold font-mono text-amber-400">4 Open</h3>
        </Card>
        <Card variant="glass" padding="md" className="space-y-1">
          <span className="text-xs text-slate-400">Global Cluster Load</span>
          <h3 className="text-2xl font-bold font-mono text-emerald-400">14.2%</h3>
        </Card>
        <Card variant="glass" padding="md" className="space-y-1">
          <span className="text-xs text-slate-400">P2P Relay Latency</span>
          <h3 className="text-2xl font-bold font-mono text-indigo-400">18ms</h3>
        </Card>
      </div>
    </div>
  );
};
