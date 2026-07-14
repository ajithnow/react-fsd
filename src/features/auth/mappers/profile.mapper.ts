import type { User } from '../models/auth.model';
import { resolvePermissions } from '../constants/rolePermissions.constants';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const pick = <T>(source: UnknownRecord, ...keys: string[]): T | undefined => {
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== '') {
      return value as T;
    }
  }
  return undefined;
};

/**
 * Unwrap common API envelopes:
 * `{ data: T }`, `{ data: { user: T } }`, or a bare profile object.
 */
export const unwrapProfilePayload = (raw: unknown): UnknownRecord => {
  if (!isRecord(raw)) {
    return {};
  }

  const nested = pick<unknown>(raw, 'data', 'Data');
  if (isRecord(nested)) {
    const nestedUser = pick<unknown>(nested, 'user', 'User', 'profile', 'Profile');
    if (isRecord(nestedUser)) {
      return nestedUser;
    }
    return nested;
  }

  const directUser = pick<unknown>(raw, 'user', 'User', 'profile', 'Profile');
  if (isRecord(directUser)) {
    return directUser;
  }

  return raw;
};

const asStringArray = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  return value.filter((item): item is string => typeof item === 'string');
};

/**
 * Default mapper: normalizes PascalCase / camelCase me-profile payloads into the
 * session `User` shape used by Redux + RBAC.
 *
 * Swap with `setProfileMapper` for project-specific APIs (e.g. CaptureHire
 * `ProfileResponse` → Admin session user).
 */
export const defaultMapProfileToUser = (raw: unknown): User => {
  const source = unwrapProfilePayload(raw);

  const firstName = pick<string>(source, 'FirstName', 'firstName', 'givenName') ?? '';
  const lastName = pick<string>(source, 'LastName', 'lastName', 'familyName') ?? '';
  const fullName =
    pick<string>(source, 'Name', 'name', 'FullName', 'fullName') ??
    [firstName, lastName].filter(Boolean).join(' ').trim();

  const role = String(
    pick<string>(source, 'Role', 'role', 'userRole', 'UserRole') ?? ''
  );

  const fromApi = asStringArray(
    pick<unknown>(source, 'permissions', 'Permissions')
  );

  const email = pick<string>(source, 'Email', 'email');
  const status = pick<string>(source, 'Status', 'status') ?? 'active';

  return {
    Role: role,
    permissions: resolvePermissions(role, fromApi),
    Name: fullName || email || 'User',
    FirstName: firstName || undefined,
    LastName: lastName || undefined,
    Email: email,
    Status: status,
    Id: pick<string>(source, 'Id', 'id', 'UserId', 'userId'),
  };
};

export type ProfileMapper = (raw: unknown) => User;

let profileMapper: ProfileMapper = defaultMapProfileToUser;

/** Override the profile mapper for a host project without forking auth services. */
export const setProfileMapper = (mapper: ProfileMapper): void => {
  profileMapper = mapper;
};

export const resetProfileMapper = (): void => {
  profileMapper = defaultMapProfileToUser;
};

export const mapProfileToUser = (raw: unknown): User => profileMapper(raw);
