import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { DASHBOARD_ROUTES } from '../constants/routes.constants';
import { appLayoutRoute } from '../../layout';

const dashboardRoute = createRoute({
  path: DASHBOARD_ROUTES.DASHBOARD,
  getParentRoute: () => appLayoutRoute,
  component: lazyRouteComponent(() =>
    import('../pages').then(m => ({ default: m.DashboardPage }))
  ),
});

const dashboardRoutes = [dashboardRoute];

export default dashboardRoutes;
