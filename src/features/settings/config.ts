import type { FeatureConfig } from '@/core/registry'
import settingsRoutes from './routes/settings.route'
import settingsLocales from './locales'
import { settingsSidebar } from './sidebar'

const config: FeatureConfig = {
  routes: settingsRoutes,
  locales: { ns: 'settings', resources: settingsLocales },
  sidebar: settingsSidebar,
}

export default config
