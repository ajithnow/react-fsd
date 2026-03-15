import type { FeatureConfig } from '@/core/registry'
import customersLocales from './locales'

const config: FeatureConfig = {
  locales: { ns: 'customers', resources: customersLocales },
}

export default config
