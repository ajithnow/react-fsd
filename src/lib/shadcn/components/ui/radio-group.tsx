import * as React from 'react';
import { cn } from '@/lib/utils';

type RadioGroupItemElement = React.ReactElement<RadioGroupItemProps>;

interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  className?: string;
  // Children must be RadioGroupItem or fragments/arrays thereof
  children: React.ReactNode;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ value, defaultValue, onValueChange, className, children }) => {
  const [internal, setInternal] = React.useState(defaultValue || '');
  const current = value !== undefined ? value : internal;
  const handleChange = (val: string) => {
    if (value === undefined) setInternal(val);
    onValueChange?.(val);
  };
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        const element = child as RadioGroupItemElement;
        // Only inject props into RadioGroupItem components
        if (typeof element.type === 'function' || typeof element.type === 'object') {
          return React.cloneElement(element, { selected: current, onSelect: handleChange });
        }
        return element;
      })}
    </div>
  );
};

interface RadioGroupItemProps {
  value: string;
  onSelect?: (val: string) => void;
  selected?: string;
  className?: string;
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({ value, onSelect, selected, className }) => {
  const active = selected === value;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={() => onSelect?.(value)}
      className={cn(
        'h-4 w-4 rounded-full border flex items-center justify-center',
        active && 'border-primary ring-2 ring-primary',
        className
      )}
    >
      {active && <span className="h-2 w-2 rounded-full bg-primary" />}
    </button>
  );
};
