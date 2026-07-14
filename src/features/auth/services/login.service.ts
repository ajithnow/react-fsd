import apiClient from '@/core/api';
import { ENDPOINTS } from '@/features/auth/constants';
import type { LoginTokens } from '../models/auth.model';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const pick = (source: UnknownRecord, ...keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }
  return undefined;
};

/**
 * Extract access/refresh tokens from common login envelopes.
 * Identity (role/permissions) is intentionally not taken from login —
 * call getProfile after storing the access token.
 */
export const extractLoginTokens = (raw: unknown): LoginTokens => {
  const root = isRecord(raw) ? raw : {};
  const data = isRecord(root.data) ? root.data : root;
  const tokens = isRecord(data.tokens)
    ? data.tokens
    : isRecord(data.Tokens)
      ? data.Tokens
      : data;

  const token =
    pick(tokens, 'accessToken', 'AccessToken', 'token', 'Token') ??
    pick(data, 'accessToken', 'AccessToken', 'token', 'Token');

  const refreshToken =
    pick(tokens, 'refreshToken', 'RefreshToken') ??
    pick(data, 'refreshToken', 'RefreshToken') ??
    '';

  const expiresIn =
    pick(tokens, 'accessTokenExpiry', 'AccessTokenExpiry', 'expiresIn', 'ExpiresIn') ??
    pick(data, 'accessTokenExpiry', 'AccessTokenExpiry', 'expiresIn', 'ExpiresIn');

  if (!token) {
    throw new Error('Login response did not include an access token');
  }

  return { token, refreshToken, expiresIn };
};

const useLoginService = () => {
  const loginApi = async (credentials: {
    username: string;
    password: string;
  }): Promise<LoginTokens> => {
    const { data } = await apiClient.post(ENDPOINTS.LOGIN, credentials);
    return extractLoginTokens(data);
  };

  return {
    login: async (credentials: { username: string; password: string }) =>
      loginApi(credentials),
  };
};

export default useLoginService;
