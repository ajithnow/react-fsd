/**
 * Standard RBAC roles for the open-source template.
 * Host apps can ignore these and drive permissions entirely from `/me`.
 */
export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;

export type BuiltInRole = (typeof ROLES)[keyof typeof ROLES];

/** Optional hierarchy for UI (e.g. role pickers). Not used for authorization. */
export const ROLE_HIERARCHY: Record<string, number> = {
  [ROLES.ADMIN]: 3,
  [ROLES.EDITOR]: 2,
  [ROLES.VIEWER]: 1,
};
