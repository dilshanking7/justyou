import React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AlertProps {
  title: string;
  description?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  description,
  type = 'info',
  onClose,
  className,
}) => {
  const styles = {
    info: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    error: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
  };

  const icons = {
    info: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
  };

  return (
    <div
      className={cn(
        'flex items-start justify-between p-4 rounded-2xl border text-sm',
        styles[type],
        className
      )}
    >
      <div className="flex items-start gap-3">
        {icons[type]}
        <div>
          <h5 className="font-semibold text-white">{title}</h5>
          {description && <p className="text-xs text-slate-300 mt-1 leading-relaxed">{description}</p>}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/20 rounded-lg transition-colors text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
