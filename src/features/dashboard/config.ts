import type { FeatureConfig } from '@/core/registry'
import dashboardRoutes from './routes'
import dashboardLocales from './locales'
import { DASHBOARD_PERMISSIONS } from './constants/permissions.constants'

const config: FeatureConfig = {
  routes: dashboardRoutes,
  locales: { ns: 'dashboard', resources: dashboardLocales },
  permissions: DASHBOARD_PERMISSIONS,
}

export default config
