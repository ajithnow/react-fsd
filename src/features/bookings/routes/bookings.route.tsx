import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { BOOKING_PERMISSIONS, BOOKING_ROUTES } from '../constants';
import { appLayoutRoute } from '@/core/router/layouts';
import { requirePermission } from '@/core/router/guards';

const bookingsListRoute = createRoute({
  path: BOOKING_ROUTES.LIST,
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() =>
    import('../pages').then(m => ({ default: m.BookingsListPage }))
  ),
  beforeLoad: requirePermission(BOOKING_PERMISSIONS.READ),
});

const bookingsRoutes = [bookingsListRoute];

export default bookingsRoutes;
