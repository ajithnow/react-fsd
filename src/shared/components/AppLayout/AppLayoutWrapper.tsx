import { Outlet } from '@tanstack/react-router';
import { AppLayout } from '..';
import { useSidebarData } from '../../hooks/useSidebar';

/**
 * App Layout Wrapper component that uses the sidebar hook
 * This wrapper is needed because the sidebar data depends on user context
 * which is only available inside React components
 */
export const AppLayoutWrapper = () => {
  const sidebarData = useSidebarData();

  return (
    <AppLayout sidebarData={sidebarData}>
      <Outlet />
    </AppLayout>
  );
};
