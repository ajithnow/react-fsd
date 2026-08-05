import authRoutes from './routes'
import authLocales from './locales'
import { AUTH_CONSTANTS } from './constants/auth.constants'
import type { FeatureConfig } from '@/core/registry'

const config: FeatureConfig = {
  routes: authRoutes,
  locales: { ns: 'auth', resources: authLocales },
  constants: { AUTH: AUTH_CONSTANTS },
}

export default config
