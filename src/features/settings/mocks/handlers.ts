import { http, HttpResponse } from 'msw';
import {
  demoCredentials,
  demoProfile,
  isAuthorized,
} from '@/features/auth/mocks/session';
import type { UpdateProfileRequest } from '../types';

export const handlers = [
  http.put('*/api/auth/me', async ({ request }) => {
    if (!isAuthorized(request)) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as UpdateProfileRequest;

    if (body.firstName !== undefined) demoProfile.firstName = body.firstName;
    if (body.lastName !== undefined) demoProfile.lastName = body.lastName;
    if (body.email !== undefined) demoProfile.email = body.email;

    return HttpResponse.json({
      data: {
        firstName: demoProfile.firstName,
        lastName: demoProfile.lastName,
        email: demoProfile.email,
        role: demoProfile.role,
      },
    });
  }),

  http.post('*/api/auth/change-password', async ({ request }) => {
    if (!isAuthorized(request)) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as {
      OldPassword?: string;
      NewPassword?: string;
    };

    if (body.OldPassword !== demoCredentials.password) {
      return HttpResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    demoCredentials.password = body.NewPassword ?? demoCredentials.password;
    return HttpResponse.json({ success: true });
  }),
];
