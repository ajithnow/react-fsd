import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { appLayoutRoute } from '../../layout';
import { SETTINGS_ROUTES } from '../constants';
import { SettingsLayout } from '../pages/SettingsLayout';

// Parent settings layout route
const settingsLayoutRoute = createRoute({
  path: SETTINGS_ROUTES.ROOT,
  getParentRoute: () => appLayoutRoute,
  component: SettingsLayout,
});

const settingsProfileRoute = createRoute({
  path: '/profile',
  getParentRoute: () => settingsLayoutRoute,
  component: lazyRouteComponent(() => import('../pages/ProfilePage').then(m => ({ default: m.ProfilePage }))),
});

const settingsAccountRoute = createRoute({
  path: '/account',
  getParentRoute: () => settingsLayoutRoute,
  component: lazyRouteComponent(() => import('../pages/AccountPage').then(m => ({ default: m.AccountPage }))),
});

const settingsRoutes = [
  settingsLayoutRoute.addChildren([settingsProfileRoute, settingsAccountRoute]),
];

export default settingsRoutes;
