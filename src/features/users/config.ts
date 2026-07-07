import type { FeatureConfig } from '@/core/registry'
import userRoutes from './routes'
import usersLocales from './locales'
import { usersHandlers } from './mocks'
const config: FeatureConfig = {
  routes: userRoutes,
  locales: { ns: 'users', resources: usersLocales },
  handlers: usersHandlers,
}

export default config
