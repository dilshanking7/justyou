import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'Nothing to display.',
  message = 'There is currently no data recorded for this section.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3 rounded-3xl border border-slate-800/80 bg-slate-900/30">
      <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-xs text-slate-400 max-w-sm">{message}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="glass" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
