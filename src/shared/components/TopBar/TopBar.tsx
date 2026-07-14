import React from 'react';
import { SidebarTrigger } from '@/lib/shadcn/components/ui/sidebar';
import { Separator } from '@/lib/shadcn/components/ui/separator';
import { LanguageSwitcher } from '../LanguageSwitcher';

export const TopBar: React.FC = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex flex-1 items-center gap-2" />

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
      </div>
    </header>
  );
};
