import type { FeatureConfig } from '@/core/registry'
import userRoutes from './routes'
import usersLocales from './locales'
import { usersSidebar } from './sidebar'
import { usersRolePermissions } from './rolePermissions'

const config: FeatureConfig = {
  routes: userRoutes,
  locales: { ns: 'users', resources: usersLocales },
  sidebar: usersSidebar,
  rolePermissions: usersRolePermissions,
}

export default config
