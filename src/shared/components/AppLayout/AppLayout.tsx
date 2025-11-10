import {
  SidebarProvider,
  SidebarInset,
} from '@/lib/shadcn/components/ui/sidebar';
import { AppSidebar } from '../AppSidebar';
import { TopBar } from '../TopBar';
import { AppLayoutProps } from './appLayout.models';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle';
import { useTranslation } from 'react-i18next';

export const AppLayout = ({
  children,
  sidebarData,
}: AppLayoutProps) => {
  const { t } = useTranslation('shared');
  useDocumentTitle(`${t('titles.dashboard', 'Dashboards')} | ${t('appName', 'Admin Dashboard')}`);
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
