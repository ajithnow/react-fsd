import { SidebarData } from '../components/AppSidebar/appSidebar.models';
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
  // Bell,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/stores/auth.store.ts';
import type { User } from '@/features/auth/models/auth.model.ts';
import { useRBAC } from '@/shared';
import { useTranslation } from 'react-i18next';

// Extended user type with email for sidebar display
type ExtendedUser = User & {
  email?: string;
  status?: string;
  createdAt?: string;
};

// Sidebar item structure
type SidebarItem = {
  labelKey: string; // Translation key instead of hardcoded label
  link: string;
  icon?: React.ComponentType;
  permission?: string; // Base permission key (e.g., 'customers', 'admin', 'dashboard')
  children?: SidebarItem[];
};

/**
 * Default sidebar configuration with translation keys
 */
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
    permission: 'customers',
  },
  {
    labelKey: 'sidebar.admin.userManagement',
    link: '/users',
    icon: Users,
    permission: 'admin',
  },

  {
    labelKey: 'Notifications',
    link: '/notifications',
    icon: Bell,
    permission: 'admin',
  },


  {
    labelKey: 'sidebar.settings.title',
    link: '/settings',
    icon: Settings,
    permission: 'settings',
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
        permission: 'settings',
      },
    ],
  },
];

/**
 * Feature-specific sidebar configurations with translation keys
 */
const FEATURE_SIDEBAR_CONFIGS: Record<string, SidebarItem[]> = {
  customers: [
    {
      labelKey: 'sidebar.customers.all',
      link: '/customers',
      icon: Users,
      permission: 'customers',
    },
    {
      labelKey: 'sidebar.customers.add',
      link: '/customers/create',
      icon: Users,
      permission: 'customers',
    },
    {
      labelKey: 'sidebar.customers.reports',
      link: '/customers/reports',
      icon: BarChart3,
      permission: 'customers',
    },
  ],
  dashboard: [
    {
      labelKey: 'sidebar.dashboard.overview',
      link: '/dashboard',
      icon: BarChart3,
      permission: 'dashboard',
    },
    {
      labelKey: 'sidebar.dashboard.sales',
      link: '/dashboard/sales',
      icon: BarChart3,
      permission: 'dashboard',
    },
    {
      labelKey: 'sidebar.dashboard.traffic',
      link: '/dashboard/traffic',
      icon: BarChart3,
      permission: 'dashboard',
    },
    {
      labelKey: 'sidebar.dashboard.reports',
      link: '/dashboard/reports',
      icon: FileText,
      permission: 'dashboard',
    },
  ],
};

/**
 * Check if user has any permission that starts with the given base key
 */
const hasPermissionForKey = (
  permissions: string[],
  permissionKey: string
): boolean => {
  return permissions.some(permission =>
    permission.startsWith(`${permissionKey}:`)
  );
};

/**
 * Filter sidebar items based on user permissions
 */
const filterSidebarItems = (
  items: SidebarItem[],
  userPermissions: string[]
): SidebarItem[] => {
  return items.filter(item => {
    // If no permission specified, show item
    if (!item.permission) return true;

    // Check if user has any permission for this key
    const hasPermission = hasPermissionForKey(userPermissions, item.permission);

    if (!hasPermission) return false;

    // If item has children, filter them too
    if (item.children) {
      item.children = filterSidebarItems(item.children, userPermissions);
      // Only show parent if it has visible children
      return item.children.length > 0;
    }

    return true;
  });
};

/**
 * Convert sidebar items to the format expected by the sidebar helpers
 */
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
    } else {
      return createNavLink(t(item.labelKey), item.link, item.icon);
    }
  });
};

/**
 * React hook to get sidebar data that automatically updates with auth state
 */
export const useSidebarData = (options?: {
  userRole?: 'admin' | 'user';
  feature?: string;
}): SidebarData => {
  const { user, permissions } = useRBAC();
  const { t } = useTranslation('shared');

  return getSidebarData({
    ...options,
    customUser: user as ExtendedUser | null,
    userPermissions: permissions,
    translate: t,
  });
};

/**
 * Get current user from auth store
 */
const getCurrentUser = (): ExtendedUser | null => {
  try {
    const authUser = useAuthStore.getState().user;
    return authUser as ExtendedUser | null;
  } catch {
    return null;
  }
};

/**
 * Create user data for sidebar from authenticated user
 */
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
    name: authUser.Name || t('sidebar.user.unknown'),
    email: authUser.Email || authUser.Name || 'user@example.com',
    avatar: '/avatars/user.jpg', // Default avatar, could be extended with authUser.avatar
  };
};

/**
 * Build sidebar data from configuration
 */
const buildSidebarData = (
  items: SidebarItem[],
  authUser: ExtendedUser | null,
  userPermissions: string[] = [],
  t: (key: string) => string
): SidebarData => {
  // Filter items based on permissions
  const filteredItems = filterSidebarItems(items, userPermissions);

  // Convert to sidebar format
  const navItems = convertToSidebarFormat(filteredItems, t);

  return createSidebarData({
    user: createUserDataFromAuth(authUser, t),
    navGroups: [createNavGroup(t('sidebar.groups.main'), navItems)],
  });
};

/**
 * Default sidebar configuration for the main app
 */
export const getDefaultSidebarData = (
  customUser?: ExtendedUser | null,
  userPermissions: string[] = [],
  translate?: (key: string) => string
): SidebarData => {
  const t = translate || ((key: string) => key); // Fallback if no translate function provided
  const authUser = customUser || getCurrentUser();
  return buildSidebarData(
    [...DEFAULT_SIDEBAR_CONFIG],
    authUser,
    userPermissions,
    t
  );
};

/**
 * Sidebar configuration for admin users with additional permissions
 */
export const getAdminSidebarData = (
  customUser?: ExtendedUser | null,
  userPermissions: string[] = [],
  translate?: (key: string) => string
): SidebarData => {
  const t = translate || ((key: string) => key);
  const authUser = customUser || getCurrentUser();
  const allItems = [...DEFAULT_SIDEBAR_CONFIG];

  const sidebarData = buildSidebarData(allItems, authUser, userPermissions, t);

  return sidebarData;
};

/**
 * Sidebar configuration for specific features
 */
export const getFeatureSidebarData = (
  feature: string,
  customUser?: ExtendedUser | null,
  userPermissions: string[] = [],
  translate?: (key: string) => string
): SidebarData => {
  const t = translate || ((key: string) => key);
  const authUser = customUser || getCurrentUser();

  const featureItems = FEATURE_SIDEBAR_CONFIGS[feature];
  if (!featureItems) {
    return getDefaultSidebarData(authUser, userPermissions, t);
  }

  // Use feature items as main navigation, keep some default items
  const otherItems = DEFAULT_SIDEBAR_CONFIG.filter(
    item => !item.permission || item.permission !== feature
  );

  const allItems = [...featureItems, ...otherItems];
  return buildSidebarData(allItems, authUser, userPermissions, t);
};

/**
 * Get sidebar data based on user role and current context
 */
export const getSidebarData = (options?: {
  userRole?: 'admin' | 'user';
  feature?: string;
  customUser?: ExtendedUser | null;
  userPermissions?: string[];
  translate?: (key: string) => string;
}): SidebarData => {
  const {
    userRole,
    feature,
    customUser,
    userPermissions = [],
    translate,
  } = options || {};
  const t = translate || ((key: string) => key);

  // Get current authenticated user
  const authUser = customUser || getCurrentUser();

  // Determine user role from auth user if not explicitly provided
  const actualUserRole =
    userRole || (authUser?.Role === 'admin' ? 'admin' : 'user');

  let sidebarData: SidebarData;

  // Prioritize feature-specific sidebar over role-based sidebar
  if (feature) {
    sidebarData = getFeatureSidebarData(feature, authUser, userPermissions, t);
  } else if (actualUserRole === 'admin') {
    sidebarData = getAdminSidebarData(authUser, userPermissions, t);
  } else {
    sidebarData = getDefaultSidebarData(authUser, userPermissions, t);
  }

  return sidebarData;
};