import { redirect } from '@tanstack/react-router';
import { store } from '@/core/store';
import { isAuthenticated } from '@/features/auth/utils/auth.utils';
import {
  AUTH_ROUTES,
  ROUTE_PREFIX,
} from '@/features/auth/constants/routes.constants';
import ROUTE_CONSTANTS from '@/shared/constants/route.constants';
import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from '@/shared/lib/rbac';
import type { Permission } from '@/shared/lib/rbac';

type RouteLocation = { pathname: string };

/**
 * Authenticated app routes only. Attach to `appLayoutRoute` or specific routes.
 * Redirects guests to login and preserves return URL when appropriate.
 */
export function requireAuth({ location }: { location: RouteLocation }) {
  if (isAuthenticated()) return;

  const path = location.pathname;
  const isAuthPage = path.startsWith(ROUTE_PREFIX);
  const isRootPage = path === ROUTE_CONSTANTS.ROOT;
  const shouldStoreReturnUrl = !isAuthPage && !isRootPage;

  throw redirect({
    to: AUTH_ROUTES.LOGIN,
    replace: true,
    search: shouldStoreReturnUrl ? { returnUrl: path } : undefined,
  });
}

/**
 * Guest-only routes (login, register). Redirects signed-in users away.
 */
export function requireGuest({
  search,
}: {
  search: Record<string, unknown>;
}) {
  if (!isAuthenticated()) return;

  const returnUrl = search.returnUrl as string | undefined;
  const isAuthReturnUrl = returnUrl?.startsWith('/auth/');
  const destination =
    returnUrl && !isAuthReturnUrl ? returnUrl : ROUTE_CONSTANTS.ROOT;

  throw redirect({ to: destination, replace: true });
}

/**
 * Permission gate for feature routes. Denied users redirect to ungated `/`.
 */
export function requirePermission(
  permission: Permission | Permission[],
  mode: 'any' | 'all' = 'any'
) {
  return () => {
    const user = store.getState().auth.user;
    const allowed = Array.isArray(permission)
      ? mode === 'all'
        ? hasAllPermissions(user, permission)
        : hasAnyPermission(user, permission)
      : hasPermission(user, permission);

    if (!allowed) {
      throw redirect({ to: ROUTE_CONSTANTS.ROOT, replace: true });
    }
  };
}
