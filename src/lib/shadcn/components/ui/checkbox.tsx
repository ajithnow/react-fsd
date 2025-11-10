import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react'; // ✅ import tick icon

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size'
  > {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onCheckedChange,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={!!checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      className={cn(
        'h-4 w-4 rounded border flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        checked
          ? 'bg-primary border-primary text-white'
          : 'bg-white border-gray-300',
        className
      )}
      {...(props as Record<string, unknown>)}
    >
      {checked && <Check className="h-3 w-3" strokeWidth={3} />}
    </button>
  );
};
