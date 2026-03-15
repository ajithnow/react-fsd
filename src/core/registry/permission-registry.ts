import { createRegistry } from './create-registry'
import type { PermissionConfig } from './types'

const registry = createRegistry<PermissionConfig>('PermissionRegistry')

export const permissionRegistry = {
  ...registry,
  /**
   * Overridden getAll to return a single merged object of all permissions.
   */
  getAll(): PermissionConfig {
    return Object.assign({}, ...registry.getAll())
  }
}
