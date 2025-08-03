import authRoute from './auth/routes';
import dashboardRoute from './dashboard/routes';
import customerRoutes from './customers/routes';
import { appLayoutRoute, authLayoutRoute } from './layout';

// App routes with layout
const appRoutes = appLayoutRoute.addChildren([
  ...dashboardRoute,
  ...customerRoutes,
]);

// Auth routes without app layout
const authRoutes = authLayoutRoute.addChildren(authRoute);

export default [appRoutes, authRoutes];
