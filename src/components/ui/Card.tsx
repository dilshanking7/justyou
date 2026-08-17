import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';

export interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'outline' | 'gradient';
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  hoverEffect = true,
  padding = 'md',
  className,
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variants = {
    default: 'bg-slate-900/90 border border-slate-800 text-slate-100 shadow-xl',
    glass: 'glass-card text-slate-100 rounded-2xl shadow-xl',
    outline: 'bg-transparent border border-slate-800 text-slate-100 hover:border-slate-700',
    gradient: 'bg-gradient-to-br from-slate-900/90 via-indigo-950/20 to-slate-900/90 border border-indigo-500/20 text-slate-100 shadow-2xl',
  };

  return (
    <motion.div
      whileHover={
        hoverEffect
          ? { y: -3, transition: { type: 'spring', stiffness: 300, damping: 20 } }
          : undefined
      }
      className={cn('rounded-2xl transition-all duration-200 overflow-hidden', variants[variant], paddings[padding], className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};
