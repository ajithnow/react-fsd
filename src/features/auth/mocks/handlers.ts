import { http, HttpResponse } from 'msw';
import type { LoginCredentials, LoginResponse } from '../types';
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  demoCredentials,
  demoProfile,
  isAuthorized,
} from './session';

const loginResponse: LoginResponse = {
  accessToken: ACCESS_TOKEN,
  refreshToken: REFRESH_TOKEN,
  expiresIn: 3600,
  tokenType: 'Bearer',
};

export const handlers = [
  http.post('*/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginCredentials;

    if (email !== demoCredentials.email || password !== demoCredentials.password) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return HttpResponse.json(loginResponse);
  }),

  http.get('*/api/auth/me', ({ request }) => {
    if (!isAuthorized(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({ data: demoProfile });
  }),

  http.post('*/api/auth/refresh', async ({ request }) => {
    const { refreshToken } = (await request.json()) as { refreshToken?: string };
    if (refreshToken !== REFRESH_TOKEN) {
      return HttpResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
    }

    return HttpResponse.json(loginResponse);
  }),

  http.post('*/api/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),
];
