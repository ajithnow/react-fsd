import {
  SidebarData,
  NavGroup,
  NavItem,
} from '../AppSidebar/appSidebar.models';

/**
 * Helper function to create sidebar data
 */
export const createSidebarData = (options: {
  user: SidebarData['user'];
  navGroups: NavGroup[];
  teams?: SidebarData['teams'];
}): SidebarData => {
  return {
    user: options.user,
    navGroups: options.navGroups,
    teams: options.teams,
  };
};

/**
 * Helper function to create a navigation group
 */
export const createNavGroup = (title: string, items: NavItem[]): NavGroup => {
  return {
    title,
    items,
  };
};

/**
 * Helper function to create a navigation link item
 */
export const createNavLink = (
  title: string,
  url: string,
  icon?: React.ElementType,
  badge?: string
): NavItem => {
  return {
    title,
    url,
    icon,
    badge,
  };
};

/**
 * Helper function to create a collapsible navigation item
 */
export const createNavCollapsible = (
  title: string,
  items: Array<{ title: string; url: string; icon?: React.ElementType }>,
  icon?: React.ElementType,
  badge?: string
): NavItem => {
  return {
    title,
    items,
    icon,
    badge,
  };
};
