import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while communicating with the backend API.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-3xl border border-rose-500/20 bg-rose-500/5 my-4">
      <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/30 text-rose-400">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-xs text-slate-400 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="glass"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
