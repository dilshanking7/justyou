import React from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const ReportsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" /> Reports & Cases
        </h1>
        <p className="text-xs text-slate-400">Submitted safety tickets and device action status.</p>
      </div>

      <Card variant="glass" padding="md" className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white">Case #8402 - Inappropriate Language</h4>
            <Badge variant="success" size="sm">Resolved</Badge>
          </div>
          <p className="text-xs text-slate-400">Automated safety filter reviewed and issued temporary block.</p>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">2h ago</span>
      </Card>
    </div>
  );
};
