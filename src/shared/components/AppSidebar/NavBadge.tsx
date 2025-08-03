import React from 'react';
import { cn } from '@/lib/utils';

interface NavBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const NavBadge: React.FC<NavBadgeProps> = ({ children, className }) => {
  return (
    <span
      className={cn(
        'ml-auto flex h-5 min-w-5 items-center justify-center rounded-md bg-sidebar-accent px-1 text-xs font-medium text-sidebar-accent-foreground',
        className
      )}
    >
      {children}
    </span>
  );
};
