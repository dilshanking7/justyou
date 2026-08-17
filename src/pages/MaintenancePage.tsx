import React from 'react';
import { Wrench, Clock, Activity, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const MaintenancePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
      <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
        <Wrench className="w-10 h-10 animate-spin-slow" />
      </div>

      <div className="space-y-3">
        <Badge variant="warning" icon={<Clock className="w-3.5 h-3.5" />}>
          Scheduled Maintenance
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Upgrading Signaling Nodes
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          We are deploying a low-latency WebRTC SFU cluster upgrade. Core services will resume shortly.
        </p>
      </div>

      <Card variant="glass" padding="lg" className="max-w-md mx-auto text-left space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
          System Cluster Status
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">US-East Signaling:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Operational
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">EU-Frankfurt SFU:</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> Upgrading
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">AP-Tokyo Edge:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Operational
            </span>
          </div>
        </div>
      </Card>

      <Button variant="glass" onClick={() => window.location.reload()}>
        Refresh Status
      </Button>
    </div>
  );
};
