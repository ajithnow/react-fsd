import { createRegistry } from './create-registry'
import type { LocaleConfig } from './types'

export const localeRegistry = createRegistry<LocaleConfig>('LocaleRegistry')
