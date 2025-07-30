import React from 'react';

import { Outlet } from '@tanstack/react-router';
import { SidebarProvider } from '../../../lib/shadcn/components/ui/sidebar';
import AppSidebar from '../components/Sidebar/Sidebar';
import { cn } from '@/lib/utils';
import Cookies from 'js-cookie';
import { Header } from '../components/Header/Header';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Header />

      <AppSidebar />
      <div
        id="content"
        className={cn(
          'ml-auto w-full max-w-full',
          'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
          'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
          'sm:transition-[width] sm:duration-200 sm:ease-linear',
          'flex h-svh flex-col',
          'group-data-[scroll-locked=1]/body:h-full',
          'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
        )}
      >
        {children ? children : <Outlet />}
      </div>
    </SidebarProvider>
  );
};

export default SidebarLayout;
