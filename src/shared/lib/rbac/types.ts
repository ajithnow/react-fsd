export type Permission = string;

/** Optional identity metadata from `/me` — not used for authorization. */
export type Role = string;

/** Minimal identity shape for permission checks. */
export type User = {
  permissions: Permission[];
  /** Present on session users; ignored by permission helpers. */
  role?: Role;
  roles?: Role[];
};
