import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/lib/shadcn/components/ui/var/button-variants';

export interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  /**
   * The content to display inside the button
   */
  children: React.ReactNode;
  
  /**
   * Whether the button is in a loading state
   */
  isLoading?: boolean;
  
  /**
   * Text to display when the button is loading
   */
  loadingText?: string;
  
  /**
   * Icon to display on the left side of the button
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icon to display on the right side of the button
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Whether the button should take the full width of its container
   */
  fullWidth?: boolean;
  
  /**
   * Whether to render the button as a child component (using Radix Slot)
   */
  asChild?: boolean;
}
