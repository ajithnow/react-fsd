import {
  Home,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  UserIcon,
} from 'lucide-react';
import type { SidebarData } from './appSidebar.models';

export const sidebarData: SidebarData = {
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatars/user.jpg',
  },
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Home',
          url: '/',
          icon: Home,
        },
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: BarChart3,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings/profile',
              icon: UserIcon,
            },
          ],
        },
        {
          title: 'Help & Support',
          icon: HelpCircle,
          items: [
            {
              title: 'Documentation',
              url: '/help/docs',
            },
            {
              title: 'FAQ',
              url: '/help/faq',
            },
          ],
        },
      ],
    },
  ],
};
