# Add a feature module

When adding a new domain feature to this Admin UI, follow Feature-Sliced Design and register through the existing bootstrap — do **not** hardcode routes, sidebar, or role permissions into auth/shared hooks.

## Discovery

`src/main.tsx` loads every `src/features/*/config.ts` via `import.meta.glob`.  
Adding `config.ts` is enough for registration — no edits to `main.tsx`.

## Required layout

```text
src/features/<name>/
  config.ts                 # default export FeatureConfig
  constants/                # routes, permissions (feature-owned)
  routes/                   # TanStack routes → appLayoutRoute
  pages/                    # route components
  locales/en.json + de.json + index.ts
  sidebar.ts                # SidebarConfig (optional permission)
  rolePermissions.ts        # fallback role → perms (optional)
  index.ts                  # public barrel
```

Reference scaffold: `src/features/bookings/`.

## `config.ts` contract

```ts
import type { FeatureConfig } from '@/core/registry'

const config: FeatureConfig = {
  routes: featureRoutes,
  locales: { ns: '<name>', resources: featureLocales },
  sidebar: featureSidebar,           // optional
  rolePermissions: featureRolePerms, // optional — merge via bootstrap
}

export default config
```

## Rules

1. **Own your constants** — routes, permissions, and `rolePermissions` live in the feature. Do not edit auth’s role map for feature perms; use `FeatureConfig.rolePermissions` + `mergeRolePermissions`.
2. **Permissions** — `resource:action` strings. Re-export feature aliases from `shared/lib/rbac` `PERMISSIONS` when adding a new resource, or define literals in the feature if domain-specific.
3. **Sidebar** — export `SidebarConfig` with `order`, `labelKey` + `ns`, and `permission` when gated. Assembly filters with Redux `auth.user.permissions` (honors `VITE_RBAC_ENABLED=false`).
4. **Routes** — parent is `appLayoutRoute`. Gate with `beforeLoad` + `hasPermission(store.getState().auth.user, …)`; on deny redirect to `/` (not a loop-prone route).
5. **Locales** — register via `config.locales` (`ns` = feature name). Sidebar/pages use that `ns`.
6. **Auth identity** — permissions come from `/api/auth/me` when present; `rolePermissions` is fallback only.
7. **No CaptureHire branding** in shared scaffolding; keep feature names generic unless this app is domain-homed.
8. **Do not** put feature nav lists in `useSidebar`, or feature perms in auth constants.

## Checklist

- [ ] `config.ts` default export
- [ ] Routes under `appLayoutRoute` (+ permission `beforeLoad` if needed)
- [ ] Locales en/de + `locales/index.ts`
- [ ] `sidebar.ts` if it should appear in nav
- [ ] `rolePermissions.ts` if role-fallback should include this feature
- [ ] Smoke: sidebar visibility with/without permission; route deny → `/`
