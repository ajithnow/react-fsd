import { Users } from 'lucide-react';
import type { SidebarConfig } from '@/core/registry';
import { USER_ROUTES } from './constants';
import { USER_PERMISSIONS } from './constants/permissions.constants';

export const usersSidebar: SidebarConfig = {
  id: 'users',
  group: 'main',
  order: 20,
  items: [
    {
      id: 'users',
      labelKey: 'nav.users',
      ns: 'users',
      link: USER_ROUTES.LIST,
      icon: Users,
      order: 0,
      permission: USER_PERMISSIONS.USER_READ,
    },
  ],
};
