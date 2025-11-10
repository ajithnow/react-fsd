import {
  createRoute,
  lazyRouteComponent,
  redirect,
} from '@tanstack/react-router';
import { USER_PERMISSIONS, USER_ROUTES } from '../constants';
import { appLayoutRoute } from '../../layout';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { hasPermission } from '@/shared/utils/rbac.utils';
import ROUTE_CONSTANTS from '@/shared/constants/route.constants';

const checkCreatePermission = (permission: string) => {
  const user = useAuthStore.getState().user;
  if (!hasPermission(user, permission)) {
    throw redirect({ to: ROUTE_CONSTANTS.ROOT, replace: true });
  }
};

const usersListRoute = createRoute({
  path: USER_ROUTES.LIST,
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() =>
    import('../pages').then(m => ({ default: m.UsersListPage }))
  ),
  beforeLoad: async () => {
    checkCreatePermission(USER_PERMISSIONS.USER_READ);
  },
});

const userCreateRoute = createRoute({
  path: USER_ROUTES.CREATE,
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() =>
    import('../pages').then(m => ({ default: m.UserCreatePage }))
  ),
  beforeLoad: async () => {
    checkCreatePermission(USER_PERMISSIONS.USER_CREATE);
  },
});

const userDetailRoute = createRoute({
  path: USER_ROUTES.DETAIL,
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() =>
    import('../pages').then(m => ({ default: m.UserDetailPage }))
  ),
  beforeLoad: async () => {
    checkCreatePermission(USER_PERMISSIONS.USER_READ);
  },
});

const userEditRoute = createRoute({
  path: USER_ROUTES.EDIT,
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() =>
    import('../pages').then(m => ({ default: m.UserEditPage }))
  ),
  beforeLoad: async () => {
    checkCreatePermission(USER_PERMISSIONS.USER_UPDATE);
  },
});

export const userRoutes = [
  usersListRoute,
  userCreateRoute,
  userDetailRoute,
  userEditRoute,
];

export default userRoutes;
