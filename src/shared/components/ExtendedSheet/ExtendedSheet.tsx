import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/lib/shadcn/components/ui/sheet';

interface ExtendedSheetProps {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const ExtendedSheet: React.FC<ExtendedSheetProps> = ({
  trigger,
  title,
  children,
  side = 'right',
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className="sr-only">
            {title} content
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 px-4">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};