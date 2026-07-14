import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/lib/shadcn/components/ui/sidebar';
import { NavGroup } from './NavGroup';
import { NavUser } from './NavUser';
import { SidebarData } from './appSidebar.types';
import { useTranslation } from 'react-i18next';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data: SidebarData;
}

export const AppSidebar = ({ data, ...props }: AppSidebarProps) => {
  const { t } = useTranslation('shared');

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg">
            <img
              src="/logo.svg"
              alt=""
              className="size-8"
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
        {data.navGroups.map(group => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
