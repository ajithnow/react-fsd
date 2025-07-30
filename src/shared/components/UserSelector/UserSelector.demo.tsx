import React from 'react';
import { useAuthStore } from '../../../features/auth/stores/auth.store';

export const UserSelector: React.FC = () => {
  const { user, setUser, logout } = useAuthStore();

  const demoUsers = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin' as const,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Manager User',
      email: 'manager@example.com',
      role: 'manager' as const,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'Regular User',
      email: 'user@example.com',
      role: 'user' as const,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    },
  ];

  const handleUserSwitch = (selectedUser: typeof demoUsers[0]) => {
    setUser(selectedUser);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium">Switch User:</span>
      
      {demoUsers.map((demoUser) => (
        <button
          key={demoUser.id}
          onClick={() => handleUserSwitch(demoUser)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            user?.id === demoUser.id
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          {demoUser.role.charAt(0).toUpperCase() + demoUser.role.slice(1)}
        </button>
      ))}
      
      {user && (
        <button
          onClick={logout}
          className="px-3 py-1 rounded text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      )}
      
      {user && (
        <div className="ml-auto text-sm text-gray-600">
          Current: <span className="font-medium">{user.name}</span> ({user.role})
        </div>
      )}
    </div>
  );
};
