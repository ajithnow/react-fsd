import authRoutes from './routes'
import authLocales from './locales'
import authHandlers from './mocks'
import authGuards from './guards'
import { AUTH_CONSTANTS } from './constants/auth.constants'
import type { FeatureConfig } from '@/core/registry'

const config: FeatureConfig = {
  routes: authRoutes,
  locales: { ns: 'auth', resources: authLocales },
  handlers: authHandlers,
  constants: { AUTH: AUTH_CONSTANTS },
  guards: authGuards,
}

export default config
