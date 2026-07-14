import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '@/core/store';
import { store } from '@/core/store';
import {
  sidebarRegistry,
  type SidebarConfig,
  type SidebarItemConfig,
} from '@/core/registry';
import type { User } from '@/features/auth/types';
import { isRbacEnabled } from '@/shared/lib/rbac';
import { SidebarData } from '../components/AppSidebar/appSidebar.types';
import {
  createSidebarData,
  createNavGroup,
  createNavLink,
  createNavCollapsible,
} from '../components/AppLayout/sidebarHelpers';

type ExtendedUser = User & {
  email?: string;
  status?: string;
  createdAt?: string;
};

type TranslateFn = (key: string, options?: { ns?: string }) => string;

const sortByOrder = <T extends { order?: number }>(items: T[]): T[] =>
  [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

/**
 * One pass over a tiny nav tree. `allowed` is built once per assemble (O(1) checks).
 * Items without `permission` stay visible; empty parents are dropped.
 */
const filterItemsByPermission = (
  items: SidebarItemConfig[],
  allowed: Set<string> | null
): SidebarItemConfig[] => {
  if (!allowed) return items;

  const result: SidebarItemConfig[] = [];

  for (const item of items) {
    if (item.permission && !allowed.has(item.permission)) continue;

    if (item.children?.length) {
      const children = filterItemsByPermission(item.children, allowed);
      if (children.length === 0) continue;
      result.push({ ...item, children });
      continue;
    }

    result.push(item);
  }

  return result;
};

const convertItem = (item: SidebarItemConfig, t: TranslateFn) => {
  const title = t(item.labelKey, { ns: item.ns ?? 'shared' });

  if (item.children && item.children.length > 0) {
    return createNavCollapsible(
      title,
      sortByOrder(item.children).map(child => ({
        title: t(child.labelKey, { ns: child.ns ?? item.ns ?? 'shared' }),
        url: child.link,
        icon: child.icon,
      })),
      item.icon
    );
  }

  return createNavLink(title, item.link, item.icon);
};

/**
 * Merge registered sidebar contributions into nav groups (sorted by order).
 */
export const assembleSidebarItems = (
  contributions: SidebarConfig[] = sidebarRegistry.getAll()
): Array<{
  groupId: string;
  groupLabelKey: string;
  groupNs: string;
  items: SidebarItemConfig[];
}> => {
  const sorted = sortByOrder(contributions);
  const groups = new Map<
    string,
    {
      groupId: string;
      groupLabelKey: string;
      groupNs: string;
      items: SidebarItemConfig[];
    }
  >();

  for (const contribution of sorted) {
    const groupId = contribution.group ?? 'main';
    const existing = groups.get(groupId);

    if (!existing) {
      groups.set(groupId, {
        groupId,
        groupLabelKey:
          contribution.groupLabelKey ?? 'sidebar.groups.main',
        groupNs: contribution.groupNs ?? 'shared',
        items: [...contribution.items],
      });
    } else {
      existing.items.push(...contribution.items);
    }
  }

  return Array.from(groups.values()).map(group => ({
    ...group,
    items: sortByOrder(group.items),
  }));
};

const createUserDataFromAuth = (
  authUser: ExtendedUser | null,
  t: TranslateFn
) => {
  if (!authUser) {
    return {
      name: t('sidebar.user.guest', { ns: 'shared' }),
      email: 'guest@example.com',
      avatar: '/avatars/default.jpg',
    };
  }

  return {
    name: authUser.name || t('sidebar.user.unknown', { ns: 'shared' }),
    email: authUser.email || authUser.name || 'user@example.com',
    avatar: '/avatars/user.jpg',
  };
};

const getCurrentUser = (): ExtendedUser | null => {
  try {
    return store.getState().auth.user as ExtendedUser | null;
  } catch {
    return null;
  }
};

/**
 * Build sidebar data from the sidebar registry (+ optional overrides for tests).
 * Items with `permission` are filtered using the session user.
 */
export const getSidebarData = (options?: {
  customUser?: ExtendedUser | null;
  translate?: TranslateFn;
  contributions?: SidebarConfig[];
}): SidebarData => {
  const t = options?.translate ?? ((key: string) => key);
  const authUser = options?.customUser ?? getCurrentUser();
  const groups = assembleSidebarItems(options?.contributions);
  const allowed = isRbacEnabled()
    ? new Set(authUser?.permissions ?? [])
    : null;

  const navGroups = groups
    .map(group => {
      const visibleItems = filterItemsByPermission(group.items, allowed);
      if (visibleItems.length === 0) return null;

      return createNavGroup(
        t(group.groupLabelKey, { ns: group.groupNs }),
        visibleItems.map(item => convertItem(item, t))
      );
    })
    .filter((group): group is NonNullable<typeof group> => group !== null);

  return createSidebarData({
    user: createUserDataFromAuth(authUser, t),
    navGroups,
  });
};

/**
 * React hook: sidebar from feature registry + auth user.
 * Gated items use `permission` on feature sidebar configs + Redux user.
 */
export const useSidebarData = (): SidebarData => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { t } = useTranslation();

  return getSidebarData({
    customUser: user as ExtendedUser | null,
    translate: (key, options) => t(key, options),
  });
};
