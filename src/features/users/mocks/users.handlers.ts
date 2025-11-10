import { http, HttpResponse } from 'msw';
import { mockUsers, getUserById } from './users.mock';
import type { AdminUser } from '../models/user.model';

export const usersHandlers = [
  // Get users list - basic pagination/filtering optional
  (http.get('/api/portal-admin/users', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
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

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const pageData = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      data: pageData,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  }),
  // Get single user by id

  // Absolute-origin fallback: some requests use full origin in axios baseURL
  http.get('http://localhost:3001/api/portal-admin/user/:id', ({ params }) => {
    const { id } = params;
    let user = getUserById(id as string);

    // If user not found but ID looks like a UUID, return a fallback user
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
      return HttpResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return HttpResponse.json(user);
  }),
  // Also handle port 3000 in case baseURL is configured for that
  http.get('http://localhost:3000/api/portal-admin/user/:id', ({ params }) => {
    const { id } = params;
    let user = getUserById(id as string);

    // If user not found but ID looks like a UUID, return a fallback user
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
      return HttpResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return HttpResponse.json(user);
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

    // push to mock list for session lifetime
    mockUsers.push(newUser);

    // Return created user (matching CreateUserRequest -> AdminUser conversion in service)
    return HttpResponse.json(newUser, { status: 201 });
  }),
  // Update user
  http.put('/api/portal-admin/user/:id', async ({ params, request }) => {
    const { id } = params as { id: string };
    const updates = (await request.json()) as Partial<AdminUser>;

    const idx = mockUsers.findIndex(u => u.UserId === id);
    if (idx === -1) {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updated = { ...mockUsers[idx], ...updates };
    mockUsers[idx] = updated;

    return HttpResponse.json(updated);
  }),
  // Delete user
  http.delete('/api/portal-admin/user/:id', ({ params }) => {
    const { id } = params as { id: string };
    const idx = mockUsers.findIndex(u => u.UserId === id);
    if (idx === -1) {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 });
    }

    mockUsers.splice(idx, 1);
    return HttpResponse.json(null, { status: 204 });
  })),
];


