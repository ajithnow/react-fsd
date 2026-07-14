import type { FeatureConfig } from '@/core/registry'
import userRoutes from './routes'
import usersLocales from './locales'

const config: FeatureConfig = {
  routes: userRoutes,
  locales: { ns: 'users', resources: usersLocales },
}

export default config
