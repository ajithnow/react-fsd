# 🏗️ React FSD Architecture Documentation

This document provides comprehensive documentation for the React Feature-Sliced Design (FSD) architecture implementation in this project.

## 📑 Table of Contents

1. [Overview](#-overview)
2. [Architecture Principles](#️-architecture-principles)
3. [Project Structure](#-project-structure)
4. [Layer Definitions](#-layer-definitions)
5. [Development Guidelines](#️-development-guidelines)
6. [Technology Stack](#-technology-stack)
7. [Best Practices](#-best-practices)
8. [Scaling Guidelines](#-scaling-guidelines)

## 🎯 Overview

This project implements **Feature-Sliced Design (FSD)**, a modern architectural methodology for frontend applications that promotes:

- **Explicit business logic separation**
- **Controlled cross-imports**
- **Predictable project growth**
- **Team scalability**
- **Maintainable codebase**

### Key Benefits

- ✅ **Modular**: Each feature is self-contained
- ✅ **Scalable**: Easy to add new features without breaking existing ones
- ✅ **Maintainable**: Clear separation of concerns
- ✅ **Team-friendly**: Multiple developers can work on different features simultaneously
- ✅ **Type-safe**: Full TypeScript integration throughout

## 🏛️ Architecture Principles

### 1. **Layered Architecture**

```directory
├── features/     # Business logic & user scenarios
├── core/         # Shared application-level logic
├── shared/       # Reusable utilities & components
└── lib/          # External library adaptations
```

### 2. **Import Rules**

- ⬇️ **Downward dependencies only**: Higher layers can import from lower layers
- ❌ **No circular dependencies**: Features cannot import from each other directly
- ✅ **Shared communication**: Use `shared` layer for cross-feature communication

### 3. **Predictable Structure**

Each feature follows the same internal structure for consistency and developer experience.

## 📁 Project Structure

```text
src/
├── features/           # 🎯 Business Features
│   ├── auth/          # Authentication feature (example)
│   │   ├── components/    # UI components
│   │   │   └── LoginForm/
│   │   │       ├── index.tsx
│   │   │       └── __tests__/
│   │   ├── constants/     # Feature-specific constants
│   │   ├── locales/       # Internationalization
│   │   ├── managers/      # Business logic orchestration
│   │   ├── mocks/         # Testing & development mocks
│   │   ├── models/        # TypeScript interfaces & types
│   │   ├── pages/         # Route components
│   │   ├── queries/       # Data fetching logic (TanStack Query)
│   │   ├── routes/        # Routing configuration
│   │   ├── schema/        # Validation schemas (Zod)
│   │   ├── services/      # API communication
│   │   └── stores/        # State management (Zustand)
│   ├── configs.ts         # Feature configuration
│   ├── locales.ts         # Locale aggregation
│   ├── mocks.ts           # Mock aggregation
│   └── routes.ts          # Route aggregation
│
├── core/              # 🔧 Application Core
│   ├── api/              # API configuration & interceptors
│   ├── components/       # App-level components
│   ├── i18n/            # Internationalization setup
│   ├── mock/            # MSW configuration
│   └── router/          # Router configuration
│
├── shared/            # 🤝 Shared Resources
│   ├── components/       # Reusable UI components
│   ├── models/          # Common TypeScript types
│   └── utils/           # Utility functions
│
├── lib/               # 📚 Library Adaptations
│   └── shadcn/          # ShadCN UI customizations
│       ├── components/
│       └── utils/
│
└── styles/            # 🎨 Global Styles
    └── globals.css       # Tailwind + CSS variables
```

## 🔍 Layer Definitions

### 🎯 Features Layer

**Purpose**: Contains all business logic and user-facing functionality.

**Responsibilities**:

- User interfaces and interactions
- Business logic implementation
- Feature-specific state management
- API integrations for the feature
- Routing and navigation within the feature

**Example Structure** (`features/auth/`):

```typescript
// models/auth.model.ts - Type definitions
export interface User {
  id: number;
  name: string;
  email: string;
}

// stores/auth.store.ts - State management
export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  setUser: user => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// services/login.service.ts - API communication
export const loginService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // API call implementation
  },
};
```

### 🔧 Core Layer

**Purpose**: Application-wide configurations and shared infrastructure.

**Responsibilities**:

- Router configuration
- API client setup
- Internationalization setup
- Mock service configuration
- Global error handling

**Example**:

```typescript
// core/router/index.tsx
export const rootRoute = createRootRoute({
  component: () => <div><Outlet /></div>,
});

// core/api/index.ts
export const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  timeout: 10000,
});
```

### 🤝 Shared Layer

**Purpose**: Reusable code that can be used across multiple features.

**Responsibilities**:

- Common utility functions
- Shared TypeScript types
- Reusable UI components
- Common business logic

**Example**:

```typescript
// shared/utils/common.utils.ts
export const generateResources = ({
  modules,
  supportedLanguages,
  features,
}: GenerateResourcesOptions) => {
  // Implementation for i18n resource generation
};

// shared/models/common.model.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
```

### 📚 Lib Layer

**Purpose**: Adapters and configurations for external libraries.

**Responsibilities**:

- Third-party library configurations
- Custom hooks for external libraries
- Theme and styling adaptations

**Example**:

```typescript
// lib/shadcn/utils/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// lib/shadcn/components/ui/button.tsx
export function Button({ className, variant, size, ...props }: ButtonProps) {
  // ShadCN Button implementation
}
```

## 🛠️ Development Guidelines

### Adding a New Feature

1. **Create Feature Directory**:

```bash
mkdir src/features/dashboard
```

2.**Set Up Feature Structure**:

```bash
mkdir -p src/features/dashboard/{components,constants,locales,managers,mocks,models,pages,queries,routes,schema,services,stores}
```

3.**Implement Feature Slices**:

```typescript
// features/dashboard/models/dashboard.model.ts
export interface DashboardData {
  metrics: Metric[];
  charts: ChartData[];
}

// features/dashboard/stores/dashboard.store.ts
export const useDashboardStore = create<DashboardState>(() => ({
  data: null,
  isLoading: false,
  // ... state logic
}));

// features/dashboard/pages/dashboard.page.tsx
export const DashboardPage = () => {
  // Page implementation
};
```

4.**Register Feature**:

```typescript
// features/configs.ts
export const features = ['auth', 'dashboard']; // Add new feature

// features/routes.ts
import dashboardRoutes from './dashboard/routes';
export default [...authRoutes, ...dashboardRoutes];
```

### Cross-Feature Communication

**❌ Wrong** - Direct feature imports:

```typescript
// features/dashboard/components/UserProfile.tsx
import { useAuthStore } from '../../auth/stores/auth.store'; // ❌ Don't do this
```

**✅ Correct** - Through shared layer:

```typescript
// shared/stores/app.store.ts
export const useAppStore = create(() => ({
  user: null,
  setUser: user => set({ user }),
}));

// features/auth/managers/auth.manager.ts
import { useAppStore } from '@/shared/stores/app.store';

export const authManager = {
  login: credentials => {
    // Login logic
    useAppStore.getState().setUser(user);
  },
};

// features/dashboard/components/UserProfile.tsx
import { useAppStore } from '@/shared/stores/app.store';
```

## 🧪 Testing Strategy

### Test Structure

Each feature maintains its own test suite following the same structure:

```text
features/auth/
├── components/
│   └── LoginForm/
│       └── __tests__/
│           └── loginForm.test.tsx
├── managers/
│   └── __tests__/
│       └── login.manager.test.ts
└── services/
    └── __tests__/
        └── login.service.test.ts
```

### Testing Best Practices

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test feature workflows
3. **Mock External Dependencies**: Use MSW for API mocking
4. **High Coverage**: Maintain 80% coverage threshold

```typescript
// Example test structure
describe('LoginForm', () => {
  it('should render login form correctly', () => {
    // Component rendering test
  });

  it('should handle form submission', () => {
    // User interaction test
  });

  it('should display validation errors', () => {
    // Error handling test
  });
});
```

## 📊 Technology Stack

### Core Technologies

- **React 19.1.0** - UI library with latest features
- **TypeScript 5.8.3** - Type safety and developer experience
- **Vite 7.0.4** - Fast build tool and development server

### State Management

- **Zustand 5.0.6** - Lightweight state management
- **TanStack Query** - Server state management
- **React Hook Form 7.60.0** - Form state management

### UI & Styling

- **ShadCN UI** - Modern component library
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives

### Development Tools

- **Jest 30.0.5** - Testing framework
- **React Testing Library** - Component testing utilities
- **ESLint 9.30.1** - Code linting
- **Prettier 3.6.2** - Code formatting
- **Husky** - Git hooks automation

### Build & Deployment

- **Vite** - Build tool with optimizations
- **TypeScript** - Compile-time type checking
- **Path Aliases** - Clean import statements

## ✨ Best Practices

### 1. **Consistent Naming Conventions**

```typescript
// Files: kebab-case
login - form.component.tsx;
auth.service.ts;
user.model.ts;

// Components: PascalCase
export const LoginForm = () => {};

// Functions/Variables: camelCase
const handleSubmit = () => {};
const isAuthenticated = true;

// Constants: SCREAMING_SNAKE_CASE
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
} as const;
```

### 2. **TypeScript Best Practices**

```typescript
// Use interfaces for object shapes
interface User {
  id: number;
  name: string;
  email: string;
}

// Use type for unions and computed types
type AuthRoutes = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
type UserRole = 'admin' | 'user' | 'guest';

// Use generics for reusable types
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
```

### 3. **Component Organization**

```typescript
// Component structure
interface Props {
  // Props interface first
}

export const Component = ({ prop1, prop2 }: Props) => {
  // Hooks at the top
  const [state, setState] = useState();
  const query = useQuery();

  // Event handlers
  const handleClick = () => {};

  // Render logic
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### 4. **Error Handling**

```typescript
// Service layer error handling
export const authService = {
  async login(
    credentials: LoginRequest
  ): Promise<Result<AuthResponse, ApiError>> {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: new ApiError('Login failed', error),
      };
    }
  },
};

// Component error handling
const { data, error, isLoading } = useQuery({
  queryKey: ['auth', 'login'],
  queryFn: () => authService.login(credentials),
  onError: error => {
    toast.error(error.message);
  },
});
```

## 📈 Scaling Guidelines

### Adding New Features

1. **Plan Feature Boundaries**: Define clear responsibilities
2. **Design Data Flow**: Plan state management and API interactions
3. **Create Feature Structure**: Follow established patterns
4. **Implement Incrementally**: Start with core functionality
5. **Add Tests**: Maintain coverage standards
6. **Update Documentation**: Keep docs current

### Team Collaboration

1. **Feature Ownership**: Assign features to team members
2. **Shared Standards**: Follow established conventions
3. **Code Reviews**: Review architectural decisions
4. **Documentation**: Document significant changes

### Performance Considerations

1. **Code Splitting**: Use dynamic imports for features
2. **Bundle Analysis**: Monitor bundle sizes
3. **Lazy Loading**: Load features on demand
4. **Memoization**: Use React.memo and useMemo appropriately

```typescript
// Example: Lazy loading features
const DashboardPage = lazy(() => import('./features/dashboard/pages/dashboard.page'));
const AuthPage = lazy(() => import('./features/auth/pages/login.page'));

// In router configuration
const dashboardRoute = createRoute({
  path: '/dashboard',
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardPage />
    </Suspense>
  ),
});
```

## 🎯 Conclusion

This Feature-Sliced Design architecture provides:

- **Predictable Structure**: Consistent patterns across features
- **Scalable Growth**: Easy to add new features
- **Team Efficiency**: Clear boundaries and responsibilities
- **Maintainable Code**: Separation of concerns and type safety
- **Modern Tooling**: Latest React ecosystem tools

The `auth` feature serves as a reference implementation. Use it as a template when creating new features, following the same structure and patterns for consistency and maintainability.

## 📚 Related Documentation

- **[Development Guide](./DEVELOPMENT.md)** - Step-by-step feature development process
- **[Feature Flags Guide](./FEATURE-FLAGS.md)** - Feature flag system implementation and usage
- **[Testing Guide](./TESTING.md)** - Testing strategies and best practices
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment strategies
- **[Contributing Guidelines](./CONTRIBUTING.md)** - How to contribute to the project

---

For questions or contributions to this architecture, please refer to the [Contributing Guidelines](./CONTRIBUTING.md) or reach out to the development team.
