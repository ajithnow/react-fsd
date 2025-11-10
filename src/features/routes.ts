import authRoute from './auth/routes';
import dashboardRoute from './dashboard/routes';
import userRoutes from './users/routes';
import settingsRoutes from './settings/routes/settings.route';
import { appLayoutRoute, authLayoutRoute } from './layout';

// App routes with layout
const appRoutes = appLayoutRoute.addChildren([
  ...dashboardRoute,
  ...userRoutes,
  ...settingsRoutes
]);

// Auth routes without app layout
const authRoutes = authLayoutRoute.addChildren(authRoute);

export default [appRoutes, authRoutes];
