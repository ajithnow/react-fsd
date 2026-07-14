import { createRegistry } from './create-registry'
import type { SidebarConfig } from './types'

export const sidebarRegistry = createRegistry<SidebarConfig>('SidebarRegistry')
