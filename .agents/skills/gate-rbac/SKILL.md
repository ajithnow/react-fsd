---
name: gate-rbac
description: >-
  Gate routes, sidebar items, and UI with permission-based RBAC (hasPermission,
  Can, useRBAC, beforeLoad redirect to /). Use when adding access control,
  hiding nav, or fixing permission checks.
---

# Gate with RBAC

## Model

- Permissions are strings `resource:action` owned by the feature
- Session list comes from `/api/auth/me` → Redux `auth.user.permissions`
- Not role-based on the client; do not invent role→permission maps
- `VITE_RBAC_ENABLED=false` bypasses frontend checks

## Route gate

```ts
import { redirect } from '@tanstack/react-router'
import { store } from '@/core/store'
import { hasPermission } from '@/shared/lib/rbac'
import ROUTE_CONSTANTS from '@/shared/constants/route.constants'

const user = store.getState().auth.user
if (!hasPermission(user, 'bookings:read')) {
  throw redirect({ to: ROUTE_CONSTANTS.ROOT, replace: true })
}
```

Put this in `beforeLoad` on the TanStack route. Always redirect to `/`.

## Sidebar

On `SidebarItemConfig`, set `permission: 'bookings:read'`. Assembly filters items when RBAC is on.

## UI

```tsx
<Can perform="users:create">{/* CTA */}</Can>
// or
const { hasPermission } = useRBAC()
```

## Checklist

- [ ] Permission constants in the feature
- [ ] Route `beforeLoad` for each sensitive path
- [ ] Sidebar `permission` where nav should hide
- [ ] Buttons/actions wrapped or filtered
- [ ] Deny → `/` (no loop)
