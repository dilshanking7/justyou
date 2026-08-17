import React from 'react';
import { cn } from '../../lib/utils';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  label,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className="block text-xs font-medium text-slate-300">{label}</label>}
      <div className="space-y-2">
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <label
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border transition-all duration-150 cursor-pointer select-none',
                isSelected
                  ? 'bg-indigo-600/10 border-indigo-500 text-white'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
              )}
            >
              <div
                className={cn(
                  'w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0',
                  isSelected ? 'border-indigo-500 bg-indigo-600' : 'border-slate-700 bg-slate-900'
                )}
              >
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">{opt.label}</span>
                {opt.description && <span className="text-[11px] text-slate-400 mt-0.5 block">{opt.description}</span>}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};
