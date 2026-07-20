---
name: add-feature
description: >-
  Scaffold a new FSD feature module with config.ts, routes, locales (en/de),
  sidebar, and permission constants. Use when adding a domain feature, new
  src/features folder, or registering routes/sidebar via FeatureConfig.
---

# Add a feature module

## When to use

New domain area under `src/features/<name>/` that should auto-register on boot.

## Reference

Copy structure from `src/features/bookings/`. For full CRUD, also use skill `add-crud-page` / `src/features/users/`.

## Steps

1. Create folder `src/features/<name>/` with:
   - `config.ts` (default export `FeatureConfig`)
   - `constants/` — routes + `resource:action` permissions
   - `routes/` — TanStack routes, parent `appLayoutRoute`
   - `pages/` — route components
   - `locales/en.json`, `locales/de.json`, `locales/index.ts`
   - `sidebar.ts` — optional `SidebarConfig` with `permission`
   - `index.ts` — public barrel
2. Do **not** edit `src/main.tsx` — glob picks up `config.ts`.
3. Gate routes: `beforeLoad` + `hasPermission` → redirect to `/`.
4. Register locales via `config.locales` with `ns: '<name>'`.
5. Smoke: item appears in sidebar when permitted; denied route → `/`.

## Checklist

See `.agents/rules/add-feature.md`.
