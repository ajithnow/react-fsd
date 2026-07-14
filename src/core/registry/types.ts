import type { AnyRoute } from '@tanstack/react-router'

export interface LocaleConfig {
  ns: string
  resources: Record<string, unknown>
}

export interface ConstantsConfig {
  [key: string]: unknown
}

export interface GuardConfig {
  [key: string]: unknown
}

export interface FeatureConfig {
  routes?: AnyRoute[]
  locales?: LocaleConfig
  constants?: ConstantsConfig
  guards?: GuardConfig
}
