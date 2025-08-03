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
  Settings,
  UserIcon,
  FileText,
  Shield,
  Bell,
  CreditCard,
} from 'lucide-react';
import { useAuthStore } from '../../features/auth/stores/auth.store';
import type { User } from '../../features/auth/models/auth.model';
import { useRBAC } from './useRBAC';

// Extended user type with email for sidebar display
type ExtendedUser = User & {
  email?: string;
  status?: string;
  createdAt?: string;
};

// Sidebar item structure
type SidebarItem = {
  label: string;
  link: string;
  icon?: React.ComponentType;
  permission?: string; // Base permission key (e.g., 'customers', 'admin', 'dashboard')
  children?: SidebarItem[];
};

/**
 * Default sidebar configuration
 */
const DEFAULT_SIDEBAR_CONFIG: SidebarItem[] = [
  {
    label: 'Home',
    link: '/',
    icon: Home,
  },
  {
    label: 'Customers',
    link: '/customers',
    icon: Users,
    permission: 'customers',
  },
  {
    label: 'Settings',
    link: '/settings',
    icon: Settings,
    permission: 'settings',
    children: [
      {
        label: 'Profile',
        link: '/settings/profile',
        icon: UserIcon,
      },
      {
        label: 'Security',
        link: '/settings/security',
        icon: Shield,
        permission: 'settings',
      },
      {
        label: 'Notifications',
        link: '/settings/notifications',
        icon: Bell,
      },
      {
        label: 'Billing',
        link: '/settings/billing',
        icon: CreditCard,
        permission: 'settings',
      },
    ],
  },
];

/**
 * Admin-specific sidebar items
 */
const ADMIN_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: 'User Management',
    link: '/admin/users',
    icon: Users,
    permission: 'admin',
  },
  {
    label: 'System Logs',
    link: '/admin/logs',
    icon: FileText,
    permission: 'admin',
  },
  {
    label: 'Security',
    link: '/admin/security',
    icon: Shield,
    permission: 'admin',
  },
];

/**
 * Feature-specific sidebar configurations
 */
const FEATURE_SIDEBAR_CONFIGS: Record<string, SidebarItem[]> = {
  customers: [
    {
      label: 'All Customers',
      link: '/customers',
      icon: Users,
      permission: 'customers',
    },
    {
      label: 'Add Customer',
      link: '/customers/create',
      icon: Users,
      permission: 'customers',
    },
    {
      label: 'Customer Reports',
      link: '/customers/reports',
      icon: BarChart3,
      permission: 'customers',
    },
  ],
  dashboard: [
    {
      label: 'Overview',
      link: '/dashboard',
      icon: BarChart3,
      permission: 'dashboard',
    },
    {
      label: 'Sales',
      link: '/dashboard/sales',
      icon: BarChart3,
      permission: 'dashboard',
    },
    {
      label: 'Traffic',
      link: '/dashboard/traffic',
      icon: BarChart3,
      permission: 'dashboard',
    },
    {
      label: 'Reports',
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
const convertToSidebarFormat = (items: SidebarItem[]) => {
  return items.map(item => {
    if (item.children && item.children.length > 0) {
      return createNavCollapsible(
        item.label,
        item.children.map(child => ({
          title: child.label,
          url: child.link,
          icon: child.icon,
        })),
        item.icon
      );
    } else {
      return createNavLink(item.label, item.link, item.icon);
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

  return getSidebarData({
    ...options,
    customUser: user as ExtendedUser | null,
    userPermissions: permissions,
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
const createUserDataFromAuth = (authUser: ExtendedUser | null) => {
  if (!authUser) {
    return {
      name: 'Guest User',
      email: 'guest@example.com',
      avatar: '/avatars/default.jpg',
    };
  }

  return {
    name: authUser.name || 'Unknown User',
    email: authUser.email || authUser.name || 'user@example.com',
    avatar: '/avatars/user.jpg', // Default avatar, could be extended with authUser.avatar
  };
};

/**
 * Build sidebar data from configuration
 */
const buildSidebarData = (
  items: SidebarItem[],
  authUser: ExtendedUser | null,
  userPermissions: string[] = []
): SidebarData => {
  // Filter items based on permissions
  const filteredItems = filterSidebarItems(items, userPermissions);

  // Convert to sidebar format
  const navItems = convertToSidebarFormat(filteredItems);

  return createSidebarData({
    user: createUserDataFromAuth(authUser),
    navGroups: [createNavGroup('Main', navItems)],
  });
};

/**
 * Default sidebar configuration for the main app
 */
export const getDefaultSidebarData = (
  customUser?: ExtendedUser | null,
  userPermissions: string[] = []
): SidebarData => {
  const authUser = customUser || getCurrentUser();
  return buildSidebarData(DEFAULT_SIDEBAR_CONFIG, authUser, userPermissions);
};

/**
 * Sidebar configuration for admin users with additional permissions
 */
export const getAdminSidebarData = (
  customUser?: ExtendedUser | null,
  userPermissions: string[] = []
): SidebarData => {
  const authUser = customUser || getCurrentUser();
  const allItems = [...DEFAULT_SIDEBAR_CONFIG, ...ADMIN_SIDEBAR_ITEMS];

  const sidebarData = buildSidebarData(allItems, authUser, userPermissions);

  // Add admin navigation as a separate group
  const filteredAdminItems = filterSidebarItems(
    ADMIN_SIDEBAR_ITEMS,
    userPermissions
  );
  if (filteredAdminItems.length > 0) {
    const adminNavItems = convertToSidebarFormat(filteredAdminItems);
    sidebarData.navGroups.push(createNavGroup('Administration', adminNavItems));
  }

  return sidebarData;
};

/**
 * Sidebar configuration for specific features
 */
export const getFeatureSidebarData = (
  feature: string,
  customUser?: ExtendedUser | null,
  userPermissions: string[] = []
): SidebarData => {
  const authUser = customUser || getCurrentUser();

  const featureItems = FEATURE_SIDEBAR_CONFIGS[feature];
  if (!featureItems) {
    return getDefaultSidebarData(authUser, userPermissions);
  }

  // Use feature items as main navigation, keep some default items
  const otherItems = DEFAULT_SIDEBAR_CONFIG.filter(
    item => !item.permission || item.permission !== feature
  );

  const allItems = [...featureItems, ...otherItems];
  return buildSidebarData(allItems, authUser, userPermissions);
};

/**
 * Get sidebar data based on user role and current context
 */
export const getSidebarData = (options?: {
  userRole?: 'admin' | 'user';
  feature?: string;
  customUser?: ExtendedUser | null;
  userPermissions?: string[];
}): SidebarData => {
  const { userRole, feature, customUser, userPermissions = [] } = options || {};

  // Get current authenticated user
  const authUser = customUser || getCurrentUser();

  // Determine user role from auth user if not explicitly provided
  const actualUserRole =
    userRole || (authUser?.role === 'admin' ? 'admin' : 'user');

  let sidebarData: SidebarData;

  // Prioritize feature-specific sidebar over role-based sidebar
  if (feature) {
    sidebarData = getFeatureSidebarData(feature, authUser, userPermissions);
  } else if (actualUserRole === 'admin') {
    sidebarData = getAdminSidebarData(authUser, userPermissions);
  } else {
    sidebarData = getDefaultSidebarData(authUser, userPermissions);
  }

  return sidebarData;
};
