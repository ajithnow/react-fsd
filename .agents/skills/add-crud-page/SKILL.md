---
name: add-crud-page
description: >-
  Add a full CRUD feature (list/create/detail/edit) mirroring users: routes,
  permissions, queries, managers, DataTable, forms, en/de locales. Use when
  building admin CRUD screens or copying the users feature pattern.
---

# Add a CRUD feature

## Reference

Mirror `src/features/users/` end-to-end. Start from `bookings` only if you need a thin scaffold first (`add-feature`).

## Layers to create

| Piece | Path pattern | Notes |
|-------|--------------|-------|
| Permissions | `constants/permissions.constants.ts` | `resource:read\|create\|update\|delete` |
| Routes | `constants/routes.constants.ts` + `routes/*.route.tsx` | Parent `appLayoutRoute`; each action gated |
| Service | `services/` | API calls only |
| Queries | `queries/` | TanStack Query; no navigate/dispatch |
| Managers | `managers/` | toasts, navigation, orchestration |
| Schema | `schema/` | Zod (+ RHF resolvers) |
| Components | `components/` | DataTable, forms, dialogs |
| Pages | `pages/` | List / Create / Detail / Edit |
| Locales | `locales/{en,de}.json` | Feature `ns` |
| Sidebar | `sidebar.ts` | `permission` on list item |
| Config | `config.ts` | routes + locales + sidebar |

## Patterns from users

- List page: `DataTable` + `<Can perform={…CREATE}>` for create CTA
- Row actions: filter by `hasPermission`
- Deny redirect: `ROUTE_CONSTANTS.ROOT` (`/`) — never bounce to another gated list
- Export barrel from `index.ts` for cross-imports used by shared tables if needed

## After scaffolding

1. Confirm `config.ts` default export
2. Both locale files present
3. No `main.tsx` edits
4. Manual smoke with `VITE_RBAC_ENABLED=true` and without permission
