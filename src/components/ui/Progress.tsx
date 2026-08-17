import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'indigo' | 'gradient' | 'emerald';
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  showValue = false,
  size = 'md',
  variant = 'gradient',
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variants = {
    indigo: 'bg-indigo-600',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
    emerald: 'bg-emerald-500',
  };

  return (
    <div className="w-full space-y-1">
      {showValue && (
        <div className="flex justify-between text-xs font-medium text-slate-400">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50 p-0.5', heights[size], className)}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn('h-full rounded-full shadow-sm', variants[variant])}
        />
      </div>
    </div>
  );
};
