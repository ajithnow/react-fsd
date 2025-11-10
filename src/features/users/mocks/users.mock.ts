import type { AdminUser } from '../models/user.model';

export const mockUsers: AdminUser[] = [
  {
    UserId: 'u-1',
    FirstName: 'Alice',
    LastName: 'Anderson',
    Email: 'alice.anderson@example.com',
    Role: 'POWER_ADMIN',
    Status: true,
  },
  {
    UserId: 'u-2',
    FirstName: 'Bob',
    LastName: 'Baker',
    Email: 'bob.baker@example.com',
    Role: 'NORMAL_USER',
    Status: false,
  },
  {
    UserId: 'u-3',
    FirstName: 'Carol',
    LastName: 'Carter',
    Email: 'carol.carter@example.com',
    Role: 'SUPER_ADMIN',
    Status: true,
  },
];

export const getUserById = (id: string) =>
  mockUsers.find(u => u.UserId === id) || null;
