# 🧪 Testing Strategy

## Overview

This document outlines the comprehensive testing strategy for the Feature-Sliced Design architecture, ensuring high-quality, maintainable code across all layers.

## Testing Philosophy

### Core Principles

1. **Test Pyramid**: Unit tests (70%) → Integration tests (20%) → E2E tests (10%)
2. **Test Isolation**: Each test should be independent and not rely on others
3. **Test Clarity**: Tests should serve as documentation for expected behavior
4. **Maintainable Tests**: Tests should be easy to update when requirements change

### Coverage Goals

- **Overall Coverage**: 80% minimum across all metrics
- **Critical Paths**: 95% coverage for business logic
- **UI Components**: Focus on user interactions and accessibility
- **Services**: 100% coverage for API communication

## Testing Stack

### Core Testing Tools

```typescript
// Jest Configuration
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Libraries Used

- **Jest 30.0.5**: Testing framework with excellent TypeScript support
- **React Testing Library**: Component testing with user-centric approach
- **MSW (Mock Service Worker)**: API mocking for realistic testing
- **@testing-library/jest-dom**: Additional DOM testing utilities
- **@testing-library/user-event**: Realistic user interaction simulation

## Layer-Specific Testing

### 🎯 Features Layer Testing

#### Component Testing

```typescript
// features/auth/components/LoginForm/__tests__/LoginForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginForm } from '../LoginForm';
import type { LoginFormProps } from '../../models/auth.model';

// Test wrapper with necessary providers
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('LoginForm', () => {
  const defaultProps: LoginFormProps = {
    onSubmit: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form fields correctly', () => {
    render(<LoginForm {...defaultProps} />, { wrapper: createTestWrapper() });

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should handle form submission with valid data', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn();

    render(
      <LoginForm {...defaultProps} onSubmit={mockOnSubmit} />,
      { wrapper: createTestWrapper() }
    );

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });
  });

  it('should display validation errors', async () => {
    const user = userEvent.setup();

    render(<LoginForm {...defaultProps} />, { wrapper: createTestWrapper() });

    // Submit empty form
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should show loading state', () => {
    render(
      <LoginForm {...defaultProps} isLoading={true} />,
      { wrapper: createTestWrapper() }
    );

    expect(screen.getByText(/logging in/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

#### Service Testing

```typescript
// features/auth/services/__tests__/login.service.test.ts
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { loginService } from '../login.service';
import type { LoginRequest, AuthResponse } from '../../models/auth.model';

// Mock server setup
const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { username, password } = req.body as LoginRequest;

    if (username === 'testuser' && password === 'password123') {
      return res(
        ctx.json({
          success: true,
          data: {
            user: { id: 1, name: 'Test User', email: 'test@example.com' },
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
            expiresIn: 3600,
          },
        })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({
        success: false,
        message: 'Invalid credentials',
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('loginService', () => {
  it('should successfully login with valid credentials', async () => {
    const credentials: LoginRequest = {
      username: 'testuser',
      password: 'password123',
    };

    const result = await loginService.login(credentials);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.user.name).toBe('Test User');
      expect(result.data.accessToken).toBe('mock-access-token');
    }
  });

  it('should handle login failure with invalid credentials', async () => {
    const credentials: LoginRequest = {
      username: 'invaliduser',
      password: 'wrongpassword',
    };

    const result = await loginService.login(credentials);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toContain('Invalid credentials');
    }
  });

  it('should handle network errors', async () => {
    server.use(
      rest.post('/api/auth/login', (req, res) => {
        return res.networkError('Network connection failed');
      })
    );

    const credentials: LoginRequest = {
      username: 'testuser',
      password: 'password123',
    };

    const result = await loginService.login(credentials);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toContain('Network connection failed');
    }
  });
});
```

#### Store Testing

```typescript
// features/auth/stores/__tests__/auth.store.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../auth.store';
import type { User } from '../../models/auth.model';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.getState().reset();
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should set user and mark as authenticated', () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser: User = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    };

    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should logout and clear user data', () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser: User = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    };

    // First login
    act(() => {
      result.current.setUser(mockUser);
    });

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

#### Query Testing

```typescript
// features/auth/queries/__tests__/login.query.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useLogin } from '../login.query';
import type { LoginRequest } from '../../models/auth.model';

const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          user: { id: 1, name: 'Test User', email: 'test@example.com' },
          accessToken: 'mock-token',
        },
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useLogin', () => {
  it('should successfully login', async () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    const credentials: LoginRequest = {
      username: 'testuser',
      password: 'password123',
    };

    result.current.mutate(credentials);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.data.user.name).toBe('Test User');
    });
  });

  it('should handle login errors', async () => {
    server.use(
      rest.post('/api/auth/login', (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ success: false, message: 'Invalid credentials' })
        );
      })
    );

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    const credentials: LoginRequest = {
      username: 'invalid',
      password: 'wrong',
    };

    result.current.mutate(credentials);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toContain('Invalid credentials');
    });
  });
});
```

### 🤝 Shared Layer Testing

#### Utility Function Testing

```typescript
// shared/utils/__tests__/common.utils.test.ts
import { generateResources } from '../common.utils';
import type { GenerateResourcesOptions } from '../../models/common.model';

describe('generateResources', () => {
  it('should generate resources correctly with valid input', () => {
    const options: GenerateResourcesOptions = {
      modules: {
        auth: {
          en: {
            login: { title: 'Login', username: 'Username' },
          },
          es: {
            login: { title: 'Iniciar sesión', username: 'Usuario' },
          },
        },
      },
      supportedLanguages: ['en', 'es'],
      features: ['auth'],
    };

    const result = generateResources(options);

    expect(result.resources).toEqual({
      en: {
        auth: {
          login: { title: 'Login', username: 'Username' },
        },
      },
      es: {
        auth: {
          login: { title: 'Iniciar sesión', username: 'Usuario' },
        },
      },
    });
  });

  it('should handle missing translations gracefully', () => {
    const options: GenerateResourcesOptions = {
      modules: {
        auth: {
          en: {
            login: { title: 'Login' },
          },
          // Missing Spanish translations
        },
      },
      supportedLanguages: ['en', 'es'],
      features: ['auth'],
    };

    const result = generateResources(options);

    expect(result.resources.en.auth).toBeDefined();
    expect(result.resources.es.auth).toEqual({});
  });
});
```

### 🔧 Core Layer Testing

#### API Client Testing

```typescript
// core/api/__tests__/index.test.ts
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { apiClient } from '../index';

const server = setupServer(
  rest.get('/api/test', (req, res, ctx) => {
    return res(ctx.json({ message: 'success' }));
  }),

  rest.post('/api/test', (req, res, ctx) => {
    return res(ctx.json({ data: req.body }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('apiClient', () => {
  it('should make GET requests correctly', async () => {
    const response = await apiClient.get('/test');

    expect(response.data).toEqual({ message: 'success' });
    expect(response.status).toBe(200);
  });

  it('should make POST requests correctly', async () => {
    const postData = { name: 'test', value: 123 };
    const response = await apiClient.post('/test', postData);

    expect(response.data).toEqual({ data: postData });
    expect(response.status).toBe(200);
  });

  it('should handle API errors correctly', async () => {
    server.use(
      rest.get('/api/test', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ message: 'Internal server error' })
        );
      })
    );

    await expect(apiClient.get('/test')).rejects.toThrow();
  });
});
```

## Integration Testing

### Feature Integration Tests

```typescript
// features/auth/__tests__/auth.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { LoginPage } from '../pages/login.page';

const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { username, password } = req.body as any;

    if (username === 'testuser' && password === 'password123') {
      return res(
        ctx.json({
          success: true,
          data: {
            user: { id: 1, name: 'Test User', email: 'test@example.com' },
            accessToken: 'mock-token',
          },
        })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({ success: false, message: 'Invalid credentials' })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Auth Integration', () => {
  it('should complete login flow successfully', async () => {
    const user = userEvent.setup();

    render(<LoginPage />, { wrapper: createWrapper() });

    // Fill in form
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    // Submit form
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Should show loading state
    expect(screen.getByText(/logging in/i)).toBeInTheDocument();

    // Should redirect or show success state
    await waitFor(() => {
      expect(screen.queryByText(/logging in/i)).not.toBeInTheDocument();
      // Add your success state assertions here
    });
  });

  it('should handle login failure correctly', async () => {
    const user = userEvent.setup();

    render(<LoginPage />, { wrapper: createWrapper() });

    // Fill in form with invalid credentials
    await user.type(screen.getByLabelText(/username/i), 'invaliduser');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');

    // Submit form
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
```

## Test Organization

### Directory Structure

```text
src/
├── features/
│   └── auth/
│       ├── components/
│       │   └── LoginForm/
│       │       └── __tests__/
│       │           ├── LoginForm.test.tsx
│       │           └── LoginForm.integration.test.tsx
│       ├── services/
│       │   └── __tests__/
│       │       └── login.service.test.ts
│       ├── stores/
│       │   └── __tests__/
│       │       └── auth.store.test.ts
│       └── __tests__/
│           └── auth.integration.test.tsx
├── shared/
│   └── utils/
│       └── __tests__/
│           └── common.utils.test.ts
└── core/
    └── api/
        └── __tests__/
            └── index.test.ts
```

## Testing Commands

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:integration": "jest --testPathPattern=integration",
    "test:unit": "jest --testPathPattern=test --testPathIgnorePatterns=integration"
  }
}
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests for specific feature
npm test -- --testPathPattern=features/auth
```

## Best Practices

### 1. Test Naming

```typescript
// ✅ Good - Descriptive test names
describe('LoginForm', () => {
  it('should display validation error when username is empty', () => {});
  it('should call onSubmit with correct data when form is valid', () => {});
  it('should disable submit button when form is loading', () => {});
});

// ❌ Bad - Vague test names
describe('LoginForm', () => {
  it('should work', () => {});
  it('test validation', () => {});
  it('handles submit', () => {});
});
```

### 2. Test Structure (AAA Pattern)

```typescript
it('should update user data when login is successful', async () => {
  // Arrange
  const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
  const { result } = renderHook(() => useAuthStore());

  // Act
  act(() => {
    result.current.setUser(mockUser);
  });

  // Assert
  expect(result.current.user).toEqual(mockUser);
  expect(result.current.isAuthenticated).toBe(true);
});
```

### 3. Mock Management

```typescript
// Create reusable mock factories
export const createMockUser = (overrides = {}): User => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  ...overrides,
});

export const createMockAuthResponse = (overrides = {}): AuthResponse => ({
  user: createMockUser(),
  accessToken: 'mock-token',
  refreshToken: 'mock-refresh-token',
  expiresIn: 3600,
  ...overrides,
});
```

### 4. Test Data Management

```typescript
// Use descriptive test data
const validCredentials = {
  username: 'validuser',
  password: 'validpassword123',
};

const invalidCredentials = {
  username: 'invaliduser',
  password: 'wrongpassword',
};

// Use test data builders for complex objects
class AuthResponseBuilder {
  private response: Partial<AuthResponse> = {};

  withUser(user: User): this {
    this.response.user = user;
    return this;
  }

  withToken(token: string): this {
    this.response.accessToken = token;
    return this;
  }

  build(): AuthResponse {
    return {
      user: createMockUser(),
      accessToken: 'default-token',
      refreshToken: 'default-refresh-token',
      expiresIn: 3600,
      ...this.response,
    };
  }
}
```

This comprehensive testing strategy ensures that your Feature-Sliced Design architecture maintains high quality and reliability across all layers while providing confidence for future changes and feature additions.
