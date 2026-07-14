import { Settings, Shield, UserIcon } from 'lucide-react';
import type { SidebarConfig } from '@/core/registry';
import { SETTINGS_ROUTES } from './constants';

export const settingsSidebar: SidebarConfig = {
  id: 'settings',
  group: 'main',
  order: 90,
  items: [
    {
      id: 'settings',
      labelKey: 'nav.settings',
      ns: 'settings',
      link: SETTINGS_ROUTES.ROOT,
      icon: Settings,
      order: 0,
      children: [
        {
          id: 'settings-profile',
          labelKey: 'nav.profile',
          ns: 'settings',
          link: SETTINGS_ROUTES.PROFILE,
          icon: UserIcon,
          order: 0,
        },
        {
          id: 'settings-account',
          labelKey: 'nav.account',
          ns: 'settings',
          link: SETTINGS_ROUTES.ACCOUNT,
          icon: Shield,
          order: 1,
        },
      ],
    },
  ],
};
