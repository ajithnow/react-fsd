import { Home } from 'lucide-react';
import type { SidebarConfig } from '@/core/registry';

/** App-shell nav (home, etc.) — not owned by a feature module. */
export const shellSidebar: SidebarConfig = {
  id: 'shell',
  group: 'main',
  groupLabelKey: 'sidebar.groups.main',
  order: 0,
  items: [
    {
      id: 'home',
      labelKey: 'sidebar.home',
      link: '/',
      icon: Home,
      order: 0,
    },
  ],
};
