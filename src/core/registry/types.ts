import type { AnyRoute } from '@tanstack/react-router'
import type { ComponentType } from 'react'

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

/** Single nav link or collapsible parent contributed by a feature. */
export interface SidebarItemConfig {
  id: string
  labelKey: string
  /** i18n namespace; defaults to `shared`. */
  ns?: string
  link: string
  icon?: ComponentType
  /** Sort order within the section (lower first). */
  order?: number
  children?: SidebarItemConfig[]
  /** Optional metadata for future assembly-time filtering — not applied by the renderer. */
  permission?: string
}

/** Feature (or shell) contribution to the app sidebar. */
export interface SidebarConfig {
  id: string
  /** Logical group id; items with the same group merge. Default: `main`. */
  group?: string
  /** i18n key for the group title. Default: `sidebar.groups.main`. */
  groupLabelKey?: string
  groupNs?: string
  /** Sort order of this contribution (lower first). */
  order?: number
  items: SidebarItemConfig[]
}

export interface FeatureConfig {
  routes?: AnyRoute[]
  locales?: LocaleConfig
  constants?: ConstantsConfig
  guards?: GuardConfig
  sidebar?: SidebarConfig
}
