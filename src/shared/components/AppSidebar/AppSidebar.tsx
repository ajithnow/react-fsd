import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/lib/shadcn/components/ui/sidebar';
import { NavGroup } from './NavGroup';
import { NavUser } from './NavUser';
import { sidebarData as defaultSidebarData } from './data';
import { SidebarData } from './appSidebar.models';
import { useTranslation } from 'react-i18next';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data?: SidebarData;
}

export const AppSidebar = ({ data, ...props }: AppSidebarProps) => {
  const sidebarData = data || defaultSidebarData;
  const { t } = useTranslation('shared');

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-sidebar-primary-foreground">
            <img
              src="/app-logo.png"
              alt="Application Logo"
              className="size-4"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {t('appName', 'Admin Dashboard')}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map(group => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
