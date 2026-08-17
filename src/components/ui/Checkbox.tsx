import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string | React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}) => {
  return (
    <label className={cn('inline-flex items-center gap-2.5 cursor-pointer select-none', disabled && 'opacity-50 cursor-not-allowed', className)}>
      <div
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-150',
          checked
            ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm shadow-indigo-600/30'
            : 'bg-slate-900 border-slate-700 hover:border-slate-600'
        )}
      >
        {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
      {label && <span className="text-xs font-medium text-slate-300">{label}</span>}
    </label>
  );
};
