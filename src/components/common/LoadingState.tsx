import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
  fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading environment data...',
  subtext = 'Connecting to real-time presence node',
  fullScreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
      <div className="relative flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <div className="absolute inset-0 blur-lg bg-indigo-500/30 rounded-full" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white tracking-tight">{message}</h4>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-950/50 rounded-3xl border border-slate-900">
        {content}
      </div>
    );
  }

  return content;
};
