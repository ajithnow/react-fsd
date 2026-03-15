import type { FeatureConfig } from '@/core/registry'
import settingsRoutes from './routes/settings.route'
import settingsLocales from './locales'
import { settingsHandlers } from './mocks'

const config: FeatureConfig = {
  routes: settingsRoutes,
  locales: { ns: 'settings', resources: settingsLocales },
  handlers: settingsHandlers,
}

export default config
