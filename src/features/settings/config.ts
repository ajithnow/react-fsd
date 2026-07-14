import type { FeatureConfig } from '@/core/registry'
import settingsRoutes from './routes/settings.route'
import settingsLocales from './locales'

const config: FeatureConfig = {
  routes: settingsRoutes,
  locales: { ns: 'settings', resources: settingsLocales },
}

export default config
