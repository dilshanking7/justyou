import React from 'react';
import { cn } from '../../lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'indigo' | 'white' | 'emerald';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'indigo',
  className,
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const variants = {
    indigo: 'border-indigo-500/30 border-t-indigo-500',
    white: 'border-white/30 border-t-white',
    emerald: 'border-emerald-500/30 border-t-emerald-500',
  };

  return (
    <div
      className={cn('rounded-full animate-spin shrink-0', sizes[size], variants[variant], className)}
      role="status"
      aria-label="Loading"
    />
  );
};
