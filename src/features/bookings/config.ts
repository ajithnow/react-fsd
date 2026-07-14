import type { FeatureConfig } from '@/core/registry';
import bookingsRoutes from './routes';
import bookingsLocales from './locales';
import { bookingsSidebar } from './sidebar';

const config: FeatureConfig = {
  routes: bookingsRoutes,
  locales: { ns: 'bookings', resources: bookingsLocales },
  sidebar: bookingsSidebar,
};

export default config;
