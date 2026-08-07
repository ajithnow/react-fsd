# Feature: users

Full CRUD reference (list / create / detail / edit) with DataTable, forms, and RBAC.

## Registration

[`config.ts`](./config.ts) — routes, `users` locales, sidebar.

## Permissions

```text
users:read | users:create | users:update | users:delete | users:export
```

See `constants/permissions.constants.ts`.

## Routes

`/users`, `/users/create`, `/users/$id`, `/users/$id/edit` — parent `appLayoutRoute`; each gated in `beforeLoad`.

## Key paths

| Area               | Path                                                                                |
| ------------------ | ----------------------------------------------------------------------------------- |
| Routes             | `routes/users.route.tsx`                                                            |
| Queries / managers | `queries/`, `managers/`                                                             |
| Table / form       | `components/UserDataTable`, `components/UserForm`                                   |
| Sidebar            | `sidebar.ts` (`users:read`)                                                         |
| Dev-only API mocks | `mocks/handlers.ts` (in-memory seed data, picked up by `src/core/mocks/browser.ts`) |

## Skills

- Copy this feature: `.agents/skills/add-crud-page/SKILL.md`
- Gate checks: `.agents/skills/gate-rbac/SKILL.md`
