# Guards System - Feature-Based Architecture

This guard system follows Feature-Sliced Design (FSD) principles, keeping guards within their respective features while providing aggregation for cross-feature usage.

## Architecture Overview

Guards are organized following FSD principles:

- **Features own their guards** - Each feature contains its own guard logic
- **No core pollution** - Core layer remains free of business logic
- **Shared types** - Common guard interfaces in shared/models
- **Optional aggregation** - Cross-feature access through features/guards.tsx

## How to implement guards

### 1. Create feature-specific guards

```typescript
// features/auth/guards/AuthGuard.tsx
import type { AuthGuardProps } from '../../../shared/models/common.model';

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback, redirectTo }) => {
  // Auth-specific guard logic
  if (!isAuthenticated()) {
    // Redirect to login
    return <>{fallback}</>;
  }
  return <>{children}</>;
};

// features/auth/guards/index.ts
export { AuthGuard } from './AuthGuard';
export { GuestGuard } from './GuestGuard';

// Default export for aggregation
export default { AuthGuard, GuestGuard };
```

### 2. Add types to shared models

```typescript
// shared/models/common.model.ts
export interface GuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export interface AuthGuardProps extends GuardProps {
  redirectTo?: string;
}
```

### 3. Optional: Aggregate in features/guards.tsx

```typescript
// features/guards.tsx (only if cross-feature access needed)
import { generateGuards } from '../shared/utils/common.utils';
import authGuards from './auth/guards';
import adminGuards from './admin/guards'; // When added

const modules = {
  auth: authGuards,
  admin: adminGuards, // Automatically discovered via config
};

const { features } = moduleConfig;
const guardsConfig = generateGuards({ features, modules });
export default guardsConfig.guards;
```

### 4. Usage patterns

#### Direct feature imports (Recommended)

```typescript
// In feature routes - import directly
import { AuthGuard } from '../guards';
import { GuestGuard } from '../guards';

// Cross-feature usage - import from specific feature
import { AuthGuard } from '@/features/auth/guards';
```

#### Aggregated access (When needed)

```typescript
// When you need guards from multiple features
import guards from '@/features/guards';
const AuthGuard = guards.auth?.AuthGuard;
const AdminGuard = guards.admin?.AdminGuard;
```

## Current Implementation

### Structure

```text
src/
├── features/
│   ├── auth/
│   │   └── guards/           # Auth-specific guards
│   │       ├── AuthGuard.tsx
│   │       ├── GuestGuard.tsx
│   │       └── index.ts
│   └── guards.tsx           # Optional aggregation layer
├── shared/
│   └── models/
│       └── common.model.ts  # Guard type definitions
└── core/                    # No guards - follows FSD principles
```

### Example Usage

```typescript
// features/home/routes/home.route.tsx
import { AuthGuard } from '@/features/auth/guards';

const homeRoute = createRoute({
  component: () => (
    <AuthGuard>
      <HomePage />
    </AuthGuard>
  ),
});

// features/auth/routes/auth.route.tsx
import { GuestGuard } from '../guards';

const loginRoute = createRoute({
  component: () => (
    <GuestGuard>
      <LoginPage />
    </GuestGuard>
  ),
});
```

## Benefits

- ✅ **FSD Compliance** - Guards stay in features, core remains clean
- ✅ **Feature Ownership** - Each feature manages its own guard logic
- ✅ **Type Safety** - Shared interfaces ensure consistency
- ✅ **Flexible Access** - Direct imports or aggregated access
- ✅ **Scalable** - Easy to add new features without core changes
- ✅ **Testable** - Guards can be tested in isolation within features
