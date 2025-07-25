# Architecture Changes Summary

This document summarizes the key architectural changes and updates made to the React FSD project.

## 🔄 Recent Updates (2025)

### Node.js Version Upgrade

**Updated**: Node.js requirement from 18+ to **20+**

- ✅ Added `engines` field in `package.json`
- ✅ Created `.nvmrc` file for version consistency
- ✅ Updated all documentation references
- ✅ Updated CI/CD configurations (GitHub Actions, Docker, Netlify, Vercel)

**Breaking Change**: Projects now require Node.js 20+ and npm 10+

### Technology Stack Updates

**Current Stack (2025)**:

- **Node.js** 20+ (LTS)
- **React** 19+ with modern features
- **TypeScript** 5.8+ with strict configuration
- **Vite** 7+ for ultra-fast builds
- **TailwindCSS** 4+ with native CSS support
- **Jest** 30+ for testing
- **ESLint** 9+ with flat config

### Build Configuration Improvements

**Enhanced Vite Configuration**:

- Modern ES2022 target
- Optimized path aliasing
- TailwindCSS 4+ integration
- Fast Refresh with React

**TypeScript Strict Mode**:

- `strict: true` enabled
- `noUnusedLocals` and `noUnusedParameters` enforced
- Modern `bundler` module resolution

## 🔄 Key Changes Made

### 1. Guards Moved to Features

**Before**: `core/guards/`  
**After**: `features/auth/guards/`

**Rationale**: Guards contain business logic and should live in their respective features, not in core.

### 2. GlobalLayout Simplified

**Before**:

```typescript
// Mixed visual layout + global concerns
<div className="min-h-screen">
  <header>My App</header>
  <main>{children}</main>
  <footer>© 2025 My App</footer>
</div>
```

**After**:

```typescript
// Pure global concerns only
<>
  {/* Ready for: Analytics, Error Boundaries, Providers */}
  {children}
</>
```

**Rationale**: GlobalLayout should handle app-level concerns, not visual layout decisions.

### 3. Types Moved to Shared

**Before**: `core/guards/types.ts`  
**After**: `shared/models/common.model.ts`

**Rationale**: Type definitions are shared resources, not core infrastructure.

### 4. Import Patterns Updated

**Before**: `import { AuthGuard } from '@/core/guards'`  
**After**: `import { AuthGuard } from '@/features/auth/guards'`

**Rationale**: Direct feature imports provide better dependency tracking and follow FSD principles.

## 📁 Current Structure

```text
src/
├── core/                    # Framework infrastructure only
│   ├── auth/auth.utils.ts   # Token utilities
│   ├── layouts/
│   │   ├── GlobalLayout.tsx # Global concerns (simplified)
│   │   └── AuthLayout.tsx   # Auth visual layout
│   └── router/
├── features/                # Business logic features
│   ├── auth/
│   │   ├── guards/         # Auth guards here
│   │   ├── routes/
│   │   └── ...
│   └── guards.tsx          # Optional aggregation
├── shared/                  # Common resources
│   ├── models/
│   │   └── common.model.ts # Guard interfaces
│   └── utils/
└── ...
```

## ✅ Benefits Achieved

- **FSD Compliance**: Clear separation between core, shared, and features
- **Feature Ownership**: Auth feature owns its guards and business logic
- **Maintainability**: Easier to test and modify feature-specific code
- **Scalability**: Adding new features doesn't require core changes
- **Type Safety**: Centralized interfaces with feature-specific implementations

## 🚀 Ready for Future Enhancements

The simplified GlobalLayout is now ready for:

- Analytics integration
- Error boundary implementation
- Global state providers
- Performance monitoring
- Theme management
