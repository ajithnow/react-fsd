import { http, HttpResponse } from 'msw';
import { mockUsers, getUserById } from './users.mock';
import type { AdminUser } from '../models/user.model';

const findUserIndex = (id: string) => mockUsers.findIndex(u => u.UserId === id);

const buildUserResponse = (user: AdminUser) =>
  HttpResponse.json({
    message: 'Success',
    data: user,
  });

export const usersHandlers = [
  // List users — client paginates/filter locally; return full list in API shape
  http.get('/api/portal-admin/users', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');

    let filtered = [...mockUsers];

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        u =>
          u.FirstName.toLowerCase().includes(term) ||
          u.LastName.toLowerCase().includes(term) ||
          u.Email.toLowerCase().includes(term)
      );
    }

    return HttpResponse.json({
      message: 'Success',
      data: {
        count: filtered.length,
        users: filtered,
      },
    });
  }),

  // Get single user by id
  http.get('/api/portal-admin/user/:id', ({ params }) => {
    const { id } = params;
    let user = getUserById(id as string);

    if (!user && id && typeof id === 'string' && id.length > 10) {
      user = {
        UserId: id,
        FirstName: 'Demo',
        LastName: 'User',
        Email: 'demo.user@example.com',
        Role: 'NORMAL_USER',
        Status: true,
      };
    }

    if (!user) {
      return HttpResponse.json(
        { message: 'User not found', data: null },
        { status: 404 }
      );
    }

    return buildUserResponse(user);
  }),

  // Create user
  http.post('/api/portal-admin/user/create', async ({ request }) => {
    const payload = (await request.json()) as Partial<AdminUser> & {
      firstName?: string;
      lastName?: string;
      email?: string;
      role?: AdminUser['Role'];
    };

    const newUser: AdminUser = {
      UserId: `u-${Math.floor(Math.random() * 10000)}`,
      FirstName: payload.firstName || 'New',
      LastName: payload.lastName || 'User',
      Email: payload.email || 'new.user@example.com',
      Role: (payload.role as AdminUser['Role']) || 'NORMAL_USER',
      Status: true,
    };

    mockUsers.push(newUser);

    return HttpResponse.json(
      { message: 'Success', data: newUser },
      { status: 201 }
    );
  }),

  // Update user (matches service endpoint)
  http.put('/api/portal-admin/user/edit', async ({ request }) => {
    const payload = (await request.json()) as Partial<AdminUser> & {
      userId?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      role?: AdminUser['Role'];
      status?: boolean;
    };

    const userId = payload.userId;
    if (!userId) {
      return HttpResponse.json(
        { message: 'User ID is required', data: null },
        { status: 400 }
      );
    }

    const idx = findUserIndex(userId);
    if (idx === -1) {
      return HttpResponse.json(
        { message: 'User not found', data: null },
        { status: 404 }
      );
    }

    const updated: AdminUser = {
      ...mockUsers[idx],
      ...(payload.firstName ? { FirstName: payload.firstName } : {}),
      ...(payload.lastName ? { LastName: payload.lastName } : {}),
      ...(payload.email ? { Email: payload.email } : {}),
      ...(payload.role ? { Role: payload.role } : {}),
      ...(payload.status !== undefined ? { Status: payload.status } : {}),
    };

    mockUsers[idx] = updated;

    return HttpResponse.json({ message: 'Success', data: updated });
  }),

  // Delete user (matches service endpoint)
  http.post('/api/portal-admin/user/delete', async ({ request }) => {
    const payload = (await request.json()) as { userId?: string };
    const userId = payload.userId;

    if (!userId) {
      return HttpResponse.json(
        { message: 'User ID is required', data: null },
        { status: 400 }
      );
    }

    const idx = findUserIndex(userId);
    if (idx === -1) {
      return HttpResponse.json(
        { message: 'User not found', data: null },
        { status: 404 }
      );
    }

    mockUsers.splice(idx, 1);

    return HttpResponse.json({ message: 'Success', data: null });
  }),
];
