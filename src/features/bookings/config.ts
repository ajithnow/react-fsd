import type { FeatureConfig } from '@/core/registry';
import bookingsRoutes from './routes';
import bookingsLocales from './locales';
import { bookingsSidebar } from './sidebar';
import { bookingsRolePermissions } from './rolePermissions';

const config: FeatureConfig = {
  routes: bookingsRoutes,
  locales: { ns: 'bookings', resources: bookingsLocales },
  sidebar: bookingsSidebar,
  rolePermissions: bookingsRolePermissions,
};

export default config;
