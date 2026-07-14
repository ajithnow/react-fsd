import { SidebarData } from '../AppSidebar/appSidebar.types';

export interface AppLayoutProps {
  children: React.ReactNode;
  sidebarData?: SidebarData;
}
