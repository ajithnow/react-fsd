# Shared layer

Cursor rule: `.cursor/rules/shared-layer.mdc`

## What belongs here

- Cross-feature UI (`DataTable`, `Button`, layout chrome)
- Cross-feature hooks (`useSidebar`, alert dialogs)
- RBAC helpers under `src/shared/lib/rbac/`
- Shared locale JSON (`common` / `shared`)

## What does not

- Domain API services or feature-specific route tables
- Hardcoded feature nav items in `useSidebar` (features export `sidebar.ts`; assembly merges)
- Client-side role→permission maps

## RBAC usage

```tsx
import { Can, useRBAC, hasPermission } from '@/shared/lib/rbac'

<Can perform="users:create">{/* … */}</Can>

const { hasPermission } = useRBAC()
```

Route-level checks use `hasPermission(user, permission)` with Redux user from `store.getState().auth.user`.

## Sidebar

Features contribute `SidebarConfig` with optional `permission` on items. Assembly filters when RBAC is enabled. Shell home item has no permission gate.
