import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pills' | 'underline' | 'glass';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-1 overflow-x-auto scrollbar-none p-1 rounded-2xl select-none',
        variant === 'pills' && 'bg-slate-900/80 border border-slate-800',
        variant === 'glass' && 'glass-panel',
        variant === 'underline' && 'border-b border-slate-800 rounded-none p-0 gap-6',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-colors shrink-0 cursor-pointer',
              variant === 'underline' && 'rounded-none px-1 py-3',
              isActive
                ? 'text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            )}
          >
            {isActive && variant !== 'underline' && (
              <motion.div
                layoutId="active-tab-pill"
                className="absolute inset-0 bg-indigo-600 rounded-xl shadow-md shadow-indigo-600/30 -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            {isActive && variant === 'underline' && (
              <motion.div
                layoutId="active-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-sm shadow-indigo-500"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 text-[10px] rounded-full font-bold',
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
