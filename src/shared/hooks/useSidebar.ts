import { SidebarData } from '../components/AppSidebar/appSidebar.types';
import {
  createSidebarData,
  createNavGroup,
  createNavLink,
  createNavCollapsible,
} from '../components/AppLayout/sidebarHelpers';
import {
  Home,
  BarChart3,
  Users,
  FileText,
  Settings,
  Shield,
  UserIcon,
  Bell,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { store } from '@/core/store';
import type { RootState } from '@/core/store';
import type { User } from '@/features/auth/types';
import { useTranslation } from 'react-i18next';

type ExtendedUser = User & {
  email?: string;
  status?: string;
  createdAt?: string;
};

type SidebarItem = {
  labelKey: string;
  link: string;
  icon?: React.ComponentType;
  children?: SidebarItem[];
};

const DEFAULT_SIDEBAR_CONFIG: SidebarItem[] = [
  {
    labelKey: 'sidebar.home',
    link: '/',
    icon: Home,
  },
  {
    labelKey: 'sidebar.customers.title',
    link: '/customers',
    icon: Users,
  },
  {
    labelKey: 'sidebar.admin.userManagement',
    link: '/users',
    icon: Users,
  },
  {
    labelKey: 'Notifications',
    link: '/notifications',
    icon: Bell,
  },
  {
    labelKey: 'sidebar.settings.title',
    link: '/settings',
    icon: Settings,
    children: [
      {
        labelKey: 'sidebar.settings.profile',
        link: '/settings/profile',
        icon: UserIcon,
      },
      {
        labelKey: 'sidebar.settings.account',
        link: '/settings/account',
        icon: Shield,
      },
    ],
  },
];

const FEATURE_SIDEBAR_CONFIGS: Record<string, SidebarItem[]> = {
  customers: [
    {
      labelKey: 'sidebar.customers.all',
      link: '/customers',
      icon: Users,
    },
    {
      labelKey: 'sidebar.customers.add',
      link: '/customers/create',
      icon: Users,
    },
    {
      labelKey: 'sidebar.customers.reports',
      link: '/customers/reports',
      icon: BarChart3,
    },
  ],
  dashboard: [
    {
      labelKey: 'sidebar.dashboard.overview',
      link: '/dashboard',
      icon: BarChart3,
    },
    {
      labelKey: 'sidebar.dashboard.sales',
      link: '/dashboard/sales',
      icon: BarChart3,
    },
    {
      labelKey: 'sidebar.dashboard.traffic',
      link: '/dashboard/traffic',
      icon: BarChart3,
    },
    {
      labelKey: 'sidebar.dashboard.reports',
      link: '/dashboard/reports',
      icon: FileText,
    },
  ],
};

const convertToSidebarFormat = (
  items: SidebarItem[],
  t: (key: string) => string
) => {
  return items.map(item => {
    if (item.children && item.children.length > 0) {
      return createNavCollapsible(
        t(item.labelKey),
        item.children.map(child => ({
          title: t(child.labelKey),
          url: child.link,
          icon: child.icon,
        })),
        item.icon
      );
    }

    return createNavLink(t(item.labelKey), item.link, item.icon);
  });
};

/**
 * React hook to get sidebar data that updates with auth state.
 * Nav visibility is not gated here — route guards and action-level checks own access.
 */
export const useSidebarData = (options?: {
  userRole?: 'admin' | 'user';
  feature?: string;
}): SidebarData => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { t } = useTranslation('shared');

  return getSidebarData({
    ...options,
    customUser: user as ExtendedUser | null,
    translate: t,
  });
};

const getCurrentUser = (): ExtendedUser | null => {
  try {
    return store.getState().auth.user as ExtendedUser | null;
  } catch {
    return null;
  }
};

const createUserDataFromAuth = (
  authUser: ExtendedUser | null,
  t: (key: string) => string
) => {
  if (!authUser) {
    return {
      name: t('sidebar.user.guest'),
      email: 'guest@example.com',
      avatar: '/avatars/default.jpg',
    };
  }

  return {
    name: authUser.name || t('sidebar.user.unknown'),
    email: authUser.email || authUser.name || 'user@example.com',
    avatar: '/avatars/user.jpg',
  };
};

const buildSidebarData = (
  items: SidebarItem[],
  authUser: ExtendedUser | null,
  t: (key: string) => string
): SidebarData => {
  const navItems = convertToSidebarFormat(items, t);

  return createSidebarData({
    user: createUserDataFromAuth(authUser, t),
    navGroups: [createNavGroup(t('sidebar.groups.main'), navItems)],
  });
};

export const getDefaultSidebarData = (
  customUser?: ExtendedUser | null,
  translate?: (key: string) => string
): SidebarData => {
  const t = translate || ((key: string) => key);
  const authUser = customUser || getCurrentUser();
  return buildSidebarData([...DEFAULT_SIDEBAR_CONFIG], authUser, t);
};

export const getAdminSidebarData = (
  customUser?: ExtendedUser | null,
  translate?: (key: string) => string
): SidebarData => {
  const t = translate || ((key: string) => key);
  const authUser = customUser || getCurrentUser();
  return buildSidebarData([...DEFAULT_SIDEBAR_CONFIG], authUser, t);
};

export const getFeatureSidebarData = (
  feature: string,
  customUser?: ExtendedUser | null,
  translate?: (key: string) => string
): SidebarData => {
  const t = translate || ((key: string) => key);
  const authUser = customUser || getCurrentUser();

  const featureItems = FEATURE_SIDEBAR_CONFIGS[feature];
  if (!featureItems) {
    return getDefaultSidebarData(authUser, t);
  }

  const otherItems = DEFAULT_SIDEBAR_CONFIG.filter(
    item =>
      !FEATURE_SIDEBAR_CONFIGS[feature]?.some(
        featureItem => featureItem.link === item.link
      )
  );

  return buildSidebarData([...featureItems, ...otherItems], authUser, t);
};

export const getSidebarData = (options?: {
  userRole?: 'admin' | 'user';
  feature?: string;
  customUser?: ExtendedUser | null;
  translate?: (key: string) => string;
}): SidebarData => {
  const { userRole, feature, customUser, translate } = options || {};
  const t = translate || ((key: string) => key);
  const authUser = customUser || getCurrentUser();
  const actualUserRole =
    userRole || (authUser?.role === 'admin' ? 'admin' : 'user');

  if (feature) {
    return getFeatureSidebarData(feature, authUser, t);
  }

  if (actualUserRole === 'admin') {
    return getAdminSidebarData(authUser, t);
  }

  return getDefaultSidebarData(authUser, t);
};
