import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button as ShadcnButton } from '@/lib/shadcn/components/ui/button';
import type { ButtonProps } from './Button.model';

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  asChild,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <ShadcnButton
      className={`${fullWidth ? 'w-full' : ''} ${className || ''}`}
      disabled={isDisabled}
      asChild={asChild}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && leftIcon}
      <span className={isLoading || leftIcon || rightIcon ? 'mx-2' : ''}>
        {isLoading && loadingText ? loadingText : children}
      </span>
      {!isLoading && rightIcon && rightIcon}
    </ShadcnButton>
  );
};

export default Button;
