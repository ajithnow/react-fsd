import type { MeResponse, User } from './types';
import { resolvePermissions } from './constants';

/** Build session user from `/me`. */
export function toUser(me: MeResponse): User {
  const roles = me.roles?.length ? me.roles : me.role ? [me.role] : [];
  const role = me.role ?? roles[0] ?? '';
  const name =
    me.name ||
    me.fullName ||
    [me.firstName, me.lastName].filter(Boolean).join(' ').trim() ||
    me.email;

  return {
    id: String(me.id),
    email: me.email,
    name,
    firstName: me.firstName,
    lastName: me.lastName,
    role,
    roles,
    permissions: resolvePermissions(role, me.permissions),
    status: me.status ?? 'active',
  };
}
