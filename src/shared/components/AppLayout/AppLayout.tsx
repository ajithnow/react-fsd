import React from 'react';
import {
  SidebarProvider,
  SidebarInset,
} from '@/lib/shadcn/components/ui/sidebar';
import { AppSidebar } from '../AppSidebar';
import { TopBar } from '../TopBar';
import { AppLayoutProps } from './appLayout.models';

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  sidebarData,
}) => {
  return (
    <SidebarProvider>
      <AppSidebar data={sidebarData} />
      <SidebarInset>
        <TopBar />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <main className="grid auto-rows-max gap-4">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
