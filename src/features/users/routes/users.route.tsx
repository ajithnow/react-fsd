import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { USER_PERMISSIONS, USER_ROUTES } from '../constants';
import { appLayoutRoute } from '@/core/router/layouts';
import { requirePermission } from '@/core/router/guards';

const usersListRoute = createRoute({
  path: USER_ROUTES.LIST,
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() =>
    import('../pages').then(m => ({ default: m.UsersListPage }))
  ),
  beforeLoad: requirePermission(USER_PERMISSIONS.USER_READ),
});

const userCreateRoute = createRoute({
  path: USER_ROUTES.CREATE,
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() =>
    import('../pages').then(m => ({ default: m.UserCreatePage }))
  ),
  beforeLoad: requirePermission(USER_PERMISSIONS.USER_CREATE),
});

const userDetailRoute = createRoute({
  path: USER_ROUTES.DETAIL,
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() =>
    import('../pages').then(m => ({ default: m.UserDetailPage }))
  ),
  beforeLoad: requirePermission(USER_PERMISSIONS.USER_READ),
});

const userEditRoute = createRoute({
  path: USER_ROUTES.EDIT,
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() =>
    import('../pages').then(m => ({ default: m.UserEditPage }))
  ),
  beforeLoad: requirePermission(USER_PERMISSIONS.USER_UPDATE),
});

export const userRoutes = [
  usersListRoute,
  userCreateRoute,
  userDetailRoute,
  userEditRoute,
];

export default userRoutes;
