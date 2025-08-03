import { SidebarData } from '../AppSidebar/appSidebar.models';

export interface AppLayoutProps {
  children: React.ReactNode;
  sidebarData?: SidebarData;
}
