import type { FeatureConfig } from '@/core/registry'
import authRoutes from './routes'
import authLocales from './locales'
import authHandlers from './mocks'
import { AUTH_PERMISSIONS } from './constants/permissions.constants'

const config: FeatureConfig = {
  routes: authRoutes,
  locales: { ns: 'auth', resources: authLocales },
  handlers: authHandlers,
  permissions: AUTH_PERMISSIONS,
}

export default config
