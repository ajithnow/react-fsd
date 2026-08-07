import { http, HttpResponse } from 'msw';
import { isAuthorized } from '@/features/auth/mocks/session';
import type { AdminUser, CreateUserRequest, UpdateUserRequest } from '../types';

let nextId = 6;

/** Dev-only seed data — mutated in place by the create/update/delete handlers below. */
const users: AdminUser[] = [
  { UserId: 'usr_1', FirstName: 'Admin', LastName: 'User', Email: 'admin@example.com', Role: 'admin', Status: true },
  { UserId: 'usr_2', FirstName: 'Riya', LastName: 'Sharma', Email: 'riya.sharma@example.com', Role: 'editor', Status: true },
  { UserId: 'usr_3', FirstName: 'Marcus', LastName: 'Lee', Email: 'marcus.lee@example.com', Role: 'editor', Status: true },
  { UserId: 'usr_4', FirstName: 'Sofia', LastName: 'Garcia', Email: 'sofia.garcia@example.com', Role: 'viewer', Status: true },
  { UserId: 'usr_5', FirstName: 'Tom', LastName: 'Becker', Email: 'tom.becker@example.com', Role: 'viewer', Status: false },
];

export const handlers = [
  http.get('*/api/portal-admin/users', ({ request }) => {
    if (!isAuthorized(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');

    let filtered = users;
    if (search) {
      filtered = filtered.filter(
        u =>
          `${u.FirstName} ${u.LastName}`.toLowerCase().includes(search) ||
          u.Email.toLowerCase().includes(search)
      );
    }
    if (type) {
      filtered = filtered.filter(u => u.Role === type);
    }
    if (status) {
      const wantActive = status === 'active';
      filtered = filtered.filter(u => u.Status === wantActive);
    }

    return HttpResponse.json({
      message: 'OK',
      data: { count: filtered.length, users: filtered },
    });
  }),

  http.get('*/api/portal-admin/user/:id', ({ request, params }) => {
    if (!isAuthorized(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = users.find(u => u.UserId === params.id);
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return HttpResponse.json({ data: user });
  }),

  http.post('*/api/portal-admin/user/create', async ({ request }) => {
    if (!isAuthorized(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as CreateUserRequest;
    const user: AdminUser = {
      UserId: `usr_${nextId++}`,
      FirstName: body.firstName,
      LastName: body.lastName,
      Email: body.email,
      Role: body.role,
      Status: true,
    };
    users.push(user);

    return HttpResponse.json(user, { status: 201 });
  }),

  http.put('*/api/portal-admin/user/edit', async ({ request }) => {
    if (!isAuthorized(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as UpdateUserRequest;
    const user = users.find(u => u.UserId === body.userId);
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (body.firstName !== undefined) user.FirstName = body.firstName;
    if (body.lastName !== undefined) user.LastName = body.lastName;
    if (body.email !== undefined) user.Email = body.email;
    if (body.role !== undefined) user.Role = body.role;
    if (body.status !== undefined) user.Status = body.status;

    return HttpResponse.json(user);
  }),

  http.post('*/api/portal-admin/user/delete', async ({ request }) => {
    if (!isAuthorized(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = (await request.json()) as { userId: string };
    const index = users.findIndex(u => u.UserId === userId);
    if (index === -1) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }
    users.splice(index, 1);

    return HttpResponse.json({ success: true });
  }),

  // Called via raw `fetch` (not apiClient) so no Authorization header is
  // attached — matches the real service, hence no isAuthorized() check here.
  http.post('*/api/admin/users/:id/reset-password', ({ params }) => {
    const user = users.find(u => u.UserId === params.id);
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return HttpResponse.json({
      temporaryPassword: `Temp-${Math.random().toString(36).slice(2, 10)}`,
    });
  }),
];
