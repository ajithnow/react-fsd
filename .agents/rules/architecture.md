# Architecture (long-form)

Cursor rule: `.cursor/rules/architecture.mdc` · Hub: `AGENTS.md`

## Bootstrap sequence

1. `localeRegistry` — `common` + `shared` from `@/shared/locales`
2. `sidebarRegistry` — `shellSidebar` from `@/core/shell/sidebar`
3. `import.meta.glob('./features/*/config.ts', { eager: true })`
4. `bootstrapFeatures(modules)` → route/locale/constants/guards/sidebar registries
5. `assembleRoutes(featureRoutes)`
6. `initializeI18n()` then render `<App />`

Session: `SessionBootstrap` loads profile from `/api/auth/me` into Redux `auth.user`. Tokens are not the source of permissions.

## FeatureConfig

```ts
interface FeatureConfig {
  routes?: AnyRoute[]
  locales?: { ns: string; resources: Record<string, unknown> }
  constants?: ConstantsConfig
  guards?: GuardConfig
  sidebar?: SidebarConfig
}
```

Default-export from `src/features/<name>/config.ts`.

## Queries vs managers

| Layer | Owns | Must not |
|-------|------|----------|
| `queries/` | TanStack Query, fetch, cache keys | `navigate`, Redux dispatch, toasts |
| `managers/` | success/error orchestration | raw fetch duplication |
| pages | wire query + manager | bury side-effects in query hooks |

## RBAC

- Permission strings: `resource:action` (e.g. `users:read`)
- Source: `/me` → `auth.user.permissions`
- Route: `beforeLoad` + `hasPermission(store.getState().auth.user, …)` → `redirect` to `/`
- UI: `<Can perform="…">` or `useRBAC()`
- Bypass: `VITE_RBAC_ENABLED=false`

## Imports

Prefer `@/…`. Do not follow `components.json` aliases (`@/components`) for ShadCN — use `@/lib/shadcn/...`.
