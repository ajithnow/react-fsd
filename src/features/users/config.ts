import type { FeatureConfig } from '@/core/registry'
import userRoutes from './routes'
import usersLocales from './locales'
import { usersHandlers } from './mocks'
import { USER_PERMISSIONS } from './constants/permissions.constants'

const config: FeatureConfig = {
  routes: userRoutes,
  locales: { ns: 'users', resources: usersLocales },
  handlers: usersHandlers,
  permissions: USER_PERMISSIONS,
}

export default config
