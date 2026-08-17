import React from 'react';
import { AlertTriangle, Wrench, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

export const MaintenanceBanner: React.FC = () => {
  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-500/20 text-amber-200 px-4 py-2.5 text-xs flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 max-w-2xl">
        <Wrench className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
        <span>
          <strong>Scheduled System Upgrade:</strong> Global WebRTC relay node clusters are undergoing routine maintenance. Core calls remain unaffected.
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-amber-300">
          <Clock className="w-3 h-3" /> ETA: 12 mins
        </span>
      </div>
    </div>
  );
};
