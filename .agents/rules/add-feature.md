# Add a feature module

When adding a new domain feature to this Admin UI, follow Feature-Sliced Design and register through the existing bootstrap — do **not** hardcode routes or sidebar into shared hooks.

Skills: `.agents/skills/add-feature/SKILL.md` · CRUD: `.agents/skills/add-crud-page/SKILL.md`

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
  index.ts                  # public barrel
```

Reference scaffold: `src/features/bookings/`.

## `config.ts` contract

```ts
import type { FeatureConfig } from '@/core/registry'

const config: FeatureConfig = {
  routes: featureRoutes,
  locales: { ns: '<name>', resources: featureLocales },
  sidebar: featureSidebar, // optional
}

export default config
```

## Rules

1. **Own your constants** — routes and permission strings live in the feature.
2. **Permissions** — define `resource:action` strings in the feature. Session permissions come from `/api/auth/me` only. Authorization is permission-based. UI: `<Can>` or `useRBAC()`.
3. **Sidebar** — export `SidebarConfig` with `order`, `labelKey` + `ns`, and `permission` when gated. Assembly filters with Redux `auth.user.permissions` (honors `VITE_RBAC_ENABLED=false`).
4. **Routes** — parent is `appLayoutRoute`. Gate with `beforeLoad` + `hasPermission(store.getState().auth.user, …)`; on deny redirect to `/`.
5. **Locales** — register via `config.locales` (`ns` = feature name).
6. **Do not** put feature nav lists in `useSidebar`, or invent client-side role→permission maps.

## Checklist

- [ ] `config.ts` default export
- [ ] Routes under `appLayoutRoute` (+ permission `beforeLoad` if needed)
- [ ] Locales en/de + `locales/index.ts`
- [ ] `sidebar.ts` if it should appear in nav
- [ ] Smoke: sidebar visibility with/without permission; route deny → `/`
