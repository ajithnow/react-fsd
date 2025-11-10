import { http, HttpResponse } from 'msw';

// Mock users database
const users = [
  {
    id: 1,
    firstName: 'asw',
    lastName: 's',
    email: 'aswin.sh@pitsolutions.com',
    username: 'admin',
    password: 'admin123',
    role: 'SUPER_ADMIN',
  },
  {
    id: 2,
    firstName: 'John',
    lastName: 'Manager',
    email: 'john.manager@company.com',
    username: 'manager',
    password: 'manager123',
    role: 'MANAGER',
  },
  {
    id: 3,
    firstName: 'Jane',
    lastName: 'User',
    email: 'jane.user@company.com',
    username: 'user',
    password: 'user123',
    role: 'USER',
  },
];

export const authHandler = [
  // Login
  http.post('/api/portal-admin/login', async ({ request }) => {
    let body: { username?: string; password?: string };
    try {
      body = (await request.json()) as { username?: string; password?: string };
    } catch {
      return HttpResponse.json(
        {
          message: 'Invalid request body format',
          data: null,
        },
        { status: 400 }
      );
    }

    if (!body?.username || !body?.password) {
      return HttpResponse.json(
        {
          message: 'Username and password are required',
          data: null,
        },
        { status: 400 }
      );
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user by username
    const user = users.find(u => u.username === body.username);

    if (!user || user.password !== body.password) {
      return HttpResponse.json(
        {
          message: 'Invalid username or password',
          data: null,
        },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      message: 'Success',
      data: {
        tokens: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlvdWJmbFtZSI6I1N0cm9ta2a9udG8uRGty9tYluLkFkWbLu1k1vZGvscy5BZG1pblVzZXJlLCpZRI6Ij1mZjJxM2NkLTk0ZjgtNDY5NC1hMzhkLWI4YTdiMGUyYjQ5MCIsInJvbGUioijTTVBFU1J9BRE1JTiIsIm5p5iZ1t6MTC1NTAv0DUwO5WiZhXy1oXn2U1MTgXMzA5LCJpYXQiOjE3NTUwMDg1MD19.aUDS_s1oSInOiraYGkVRACfzdvkrT5n1Mr8shNqcB6y0',
          accessTokenExpiry: '2025-08-19T14:21:49.3414986Z'
        },
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      }
    });
  }),
];