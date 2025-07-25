# 🚩 Feature Flags System

## Overview

The feature flags system provides a flexible way to control feature availability in your application without code deployments. It supports environment-based configuration, runtime toggling, and nested flag structures.

## Table of Contents

- [Architecture](#architecture)
- [Configuration](#configuration)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)
- [Examples](#examples)

## Architecture

The feature flags system is built with these core components:

```text
src/core/featureFlags/
├── features.ts           # React hooks and main API
├── index.ts             # Public exports
├── types.ts             # TypeScript definitions
└── __tests__/           # Unit tests

src/core/utils/
└── featureFlags.utils.ts # Core utilities and parsers

src/config/
└── featureFlags.json    # Default configuration
```

### Core Components

- **`loadFeatureFlags()`**: Loads and parses feature flags from environment variables
- **`getFlag()`**: Retrieves individual flag values with nested path support
- **`useFeatureFlag()`**: React hook for accessing flags in components
- **`FeatureToggle`**: Component for conditional rendering

## Configuration

### Default Configuration

Default feature flags are defined in `src/config/featureFlags.json`:

```json
{
  "auth": {
    "enabled": true,
    "features": {
      "login": true,
      "register": true,
      "passwordReset": true,
      "socialLogin": false
    }
  },
  "home": {
    "enabled": true,
    "features": {
      "dashboard": true,
      "analytics": false
    }
  }
}
```

### Environment Overrides

Override defaults using the `VITE_FEATURE_FLAGS` environment variable:

```bash
# .env.local
VITE_FEATURE_FLAGS='{"auth":{"enabled":false,"features":{"login":false,"register":true}}}'
```

## Usage

### React Components

```typescript
import { useFeatureFlag } from '@/core/featureFlags';

export const LoginComponent = () => {
  const isAuthEnabled = useFeatureFlag('auth.enabled');
  const isLoginEnabled = useFeatureFlag('auth.features.login');

  if (!isAuthEnabled || !isLoginEnabled) {
    return <div>Login is currently disabled</div>;
  }

  return <LoginForm />;
};
```

### Feature Toggle Component

```typescript
import { FeatureToggle } from '@/shared/components';

export const HomePage = () => {
  return (
    <div>
      <h1>Welcome</h1>

      <FeatureToggle flagPath="home.features.dashboard">
        <Dashboard />
      </FeatureToggle>

      <FeatureToggle
        flagPath="home.features.analytics"
        fallback={<div>Analytics coming soon!</div>}
      >
        <Analytics />
      </FeatureToggle>
    </div>
  );
};
```

### Programmatic Access

```typescript
import { getFeatureFlag } from '@/core/featureFlags';

// In utilities or services
export const shouldShowFeature = (featurePath: string): boolean => {
  return getFeatureFlag(featurePath);
};

// In route guards
export const authGuard = () => {
  const isAuthEnabled = getFeatureFlag('auth.enabled');
  if (!isAuthEnabled) {
    throw new Error('Authentication is disabled');
  }
};
```

## Environment Variables

### Production Environment

```bash
# Production - Conservative defaults
VITE_FEATURE_FLAGS='{"auth":{"enabled":true,"features":{"login":true,"register":false}}}'
```

### Development Environment

```bash
# Development - Enable all features
VITE_FEATURE_FLAGS='{"auth":{"enabled":true,"features":{"login":true,"register":true,"passwordReset":true,"socialLogin":true}}}'
```

### Testing Environment

```bash
# Testing - Controlled feature set
VITE_FEATURE_FLAGS='{"auth":{"enabled":true,"features":{"login":true,"register":false}}}'
```

## Testing

### Unit Tests

```typescript
import { loadFeatureFlags, getFlag } from '@/core/utils/featureFlags.utils';

describe('Feature Flags', () => {
  beforeEach(() => {
    // Reset environment
    delete process.env.VITE_FEATURE_FLAGS;
  });

  it('should load default flags when no environment override', () => {
    const flags = loadFeatureFlags();
    expect(flags.auth.enabled).toBe(true);
  });

  it('should override with environment variables', () => {
    process.env.VITE_FEATURE_FLAGS = '{"auth":{"enabled":false}}';
    const flags = loadFeatureFlags();
    expect(flags.auth.enabled).toBe(false);
  });

  it('should return false for non-existent flags', () => {
    const flags = loadFeatureFlags();
    const result = getFlag(flags, 'nonexistent.flag');
    expect(result).toBe(false);
  });
});
```

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import { FeatureToggle } from '@/shared/components';

// Mock feature flags for testing
jest.mock('@/core/featureFlags', () => ({
  useFeatureFlag: jest.fn(),
}));

describe('FeatureToggle', () => {
  it('should render children when flag is enabled', () => {
    (useFeatureFlag as jest.Mock).mockReturnValue(true);

    render(
      <FeatureToggle flagPath="test.feature">
        <div>Feature Content</div>
      </FeatureToggle>
    );

    expect(screen.getByText('Feature Content')).toBeInTheDocument();
  });

  it('should render fallback when flag is disabled', () => {
    (useFeatureFlag as jest.Mock).mockReturnValue(false);

    render(
      <FeatureToggle
        flagPath="test.feature"
        fallback={<div>Feature Disabled</div>}
      >
        <div>Feature Content</div>
      </FeatureToggle>
    );

    expect(screen.getByText('Feature Disabled')).toBeInTheDocument();
  });
});
```

## Best Practices

### 1. Naming Conventions

Use descriptive, hierarchical names:

```typescript
// ✅ Good
'auth.features.socialLogin';
'dashboard.widgets.analytics';
'user.profile.editEmail';

// ❌ Avoid
'flag1';
'newFeature';
'temp';
```

### 2. Flag Lifecycle

1. **Development**: Create flag with default `false`
2. **Testing**: Enable in test environments
3. **Staging**: Gradual rollout testing
4. **Production**: Full rollout
5. **Cleanup**: Remove flag and conditional code

### 3. Documentation

Always document flags:

```typescript
// featureFlags.json
{
  "dashboard": {
    "enabled": true,
    "features": {
      // Enable new analytics dashboard (JIRA-123)
      // Remove after Q2 2024 rollout
      "analyticsV2": false
    }
  }
}
```

### 4. Avoid Deep Nesting

Limit nesting to 3 levels:

```typescript
// ✅ Good
auth.features.socialLogin;

// ❌ Too deep
auth.features.social.providers.google.login;
```

### 5. Fallback Behavior

Always provide sensible defaults:

```typescript
const isFeatureEnabled = useFeatureFlag('new.feature', false); // Default to false
```

## API Reference

### Core Functions

#### `loadFeatureFlags(): FeatureFlags`

Loads feature flags from environment variables or defaults.

**Returns**: Complete feature flags object

**Example**:

```typescript
const flags = loadFeatureFlags();
console.log(flags.auth.enabled); // true
```

#### `getFlag<T>(flags: FeatureFlags, path: string): T`

Retrieves a specific flag value using dot notation.

**Parameters**:

- `flags`: Feature flags object
- `path`: Dot-separated path to flag

**Returns**: Flag value or `false` if not found

**Example**:

```typescript
const flags = loadFeatureFlags();
const isEnabled = getFlag(flags, 'auth.enabled'); // boolean
```

### React Hooks

#### `useFeatureFlag(path: string, defaultValue?: boolean): boolean`

React hook for accessing feature flags in components.

**Parameters**:

- `path`: Dot-separated path to flag
- `defaultValue`: Fallback value (default: `false`)

**Returns**: Flag value

**Example**:

```typescript
const isLoginEnabled = useFeatureFlag('auth.features.login', false);
```

#### `getFeatureFlag(path: string): boolean`

Direct function to get feature flag values outside of React components.

**Parameters**:

- `path`: Dot-separated path to flag

**Returns**: Flag value or `false` if not found

**Example**:

```typescript
const canAccess = getFeatureFlag('dashboard.admin');
```

### Components

#### `<FeatureToggle>`

Component for conditional rendering based on feature flags.

**Props**:

- `flagPath: string` - Path to feature flag
- `fallback?: ReactNode` - Content when flag is disabled
- `children: ReactNode` - Content when flag is enabled

**Example**:

```typescript
<FeatureToggle flagPath="features.newUI" fallback={<OldUI />}>
  <NewUI />
</FeatureToggle>
```

## Examples

### Complex Feature Configuration

```json
{
  "payment": {
    "enabled": true,
    "providers": {
      "stripe": true,
      "paypal": false,
      "applePay": true
    },
    "features": {
      "subscriptions": true,
      "oneClick": false,
      "internationalCards": true
    },
    "limits": {
      "maxAmount": 10000,
      "dailyTransactions": 50
    }
  }
}
```

### Environment-Specific Overrides

```bash
# Development
VITE_FEATURE_FLAGS='{"payment":{"providers":{"paypal":true},"features":{"oneClick":true}}}'

# Production
VITE_FEATURE_FLAGS='{"payment":{"features":{"oneClick":false},"limits":{"maxAmount":5000}}}'
```

### Advanced Component Usage

```typescript
import { useFeatureFlag } from '@/core/featureFlags';

export const PaymentPage = () => {
  const isPaymentEnabled = useFeatureFlag('payment.enabled');
  const isStripeEnabled = useFeatureFlag('payment.providers.stripe');
  const isOneClickEnabled = useFeatureFlag('payment.features.oneClick');

  if (!isPaymentEnabled) {
    return <ComingSoon feature="payments" />;
  }

  return (
    <div>
      <PaymentForm>
        {isStripeEnabled && <StripeProvider />}
        {isOneClickEnabled && <OneClickPayment />}
      </PaymentForm>
    </div>
  );
};
```

### Route Guards with Feature Flags

```typescript
import { getFeatureFlag } from '@/core/featureFlags';

export const createAuthGuard = () => {
  return () => {
    const isAuthEnabled = getFeatureFlag('auth.enabled');

    if (!isAuthEnabled) {
      throw redirect('/maintenance');
    }

    return null;
  };
};

// In routes configuration
{
  path: '/login',
  element: <LoginPage />,
  loader: createAuthGuard(),
}
```

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure variables start with `VITE_`
   - Restart development server after changes
   - Check for JSON syntax errors

2. **Flags Not Updating**
   - Clear browser cache
   - Verify environment variable format
   - Check for typos in flag paths

3. **TypeScript Errors**
   - Update `FeatureFlags` interface
   - Run type checking: `npm run type-check`

### Debug Mode

Enable debug logging:

```typescript
// Set in environment or localStorage
localStorage.setItem('DEBUG_FEATURE_FLAGS', 'true');

// Logs will show flag resolution
console.log('Feature flag auth.enabled:', getFeatureFlag('auth.enabled'));
```

---

For more information, see the [Development Guide](./DEVELOPMENT.md) and [Testing Documentation](./TESTING.md).
