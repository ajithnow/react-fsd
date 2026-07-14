import {
  createRoute,
  lazyRouteComponent,
  redirect,
} from '@tanstack/react-router';
import { BOOKING_PERMISSIONS, BOOKING_ROUTES } from '../constants';
import { appLayoutRoute } from '@/core/router/layouts';
import { store } from '@/core/store';
import { hasPermission } from '@/shared/lib/rbac';
import ROUTE_CONSTANTS from '@/shared/constants/route.constants';

const requirePermission = (permission: string) => {
  const user = store.getState().auth.user;
  if (!hasPermission(user, permission)) {
    throw redirect({ to: ROUTE_CONSTANTS.ROOT, replace: true });
  }
};

const bookingsListRoute = createRoute({
  path: BOOKING_ROUTES.LIST,
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() =>
    import('../pages').then(m => ({ default: m.BookingsListPage }))
  ),
  beforeLoad: async () => {
    requirePermission(BOOKING_PERMISSIONS.READ);
  },
});

const bookingsRoutes = [bookingsListRoute];

export default bookingsRoutes;
