import type { HttpHandler } from 'msw'
import type { AnyRoute } from '@tanstack/react-router'

export type { HttpHandler }

export interface LocaleConfig {
  ns: string
  resources: Record<string, unknown>
}

export interface PermissionConfig {
  [key: string]: string
}

export interface FeatureConfig {
  routes?: AnyRoute[]
  locales?: LocaleConfig
  handlers?: HttpHandler[]
  permissions?: PermissionConfig
}
