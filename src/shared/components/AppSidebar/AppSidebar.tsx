import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/lib/shadcn/components/ui/sidebar';
import { Command } from 'lucide-react';
import { NavGroup } from './NavGroup';
import { NavUser } from './NavUser';
import { sidebarData as defaultSidebarData } from './data';
import { SidebarData } from './appSidebar.models';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data?: SidebarData;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ data, ...props }) => {
  const sidebarData = data || defaultSidebarData;

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Command className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">React FSD</span>
            <span className="truncate text-xs">Feature Sliced Design</span>
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
