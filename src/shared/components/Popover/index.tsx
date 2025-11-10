import React from 'react';
import { Popover as ShadPopover, PopoverTrigger, PopoverContent } from '@/lib/shadcn/components/ui/popover';

export const SharedPopover: React.FC<React.PropsWithChildren<{ open?: boolean; onOpenChange?: (v: boolean) => void }>> = ({ children }) => {
  return <ShadPopover>{children}</ShadPopover>;
};

export { PopoverTrigger as SharedPopoverTrigger };
export { PopoverContent as SharedPopoverContent };
