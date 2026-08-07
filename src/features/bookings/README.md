# Feature: bookings

Minimal scaffold for a gated list page — use as the template for new domains.

## Registration

[`config.ts`](./config.ts) — routes, `bookings` locales, sidebar.

## Permissions

```text
bookings:read | bookings:manage
```

## Routes

`/bookings` — list page only (`pages/BookingsListPage.tsx`).

## Key paths

| Area      | Path                                                        |
| --------- | ----------------------------------------------------------- |
| Routes    | `routes/bookings.route.tsx`                                 |
| Constants | `constants/routes.constants.ts`, `permissions.constants.ts` |
| Sidebar   | `sidebar.ts`                                                |
| Locales   | `locales/en.json`, `de.json`                                |

## Notes

- Pure UI scaffold — no service/query layer or API calls yet, so there's nothing to add a `mocks/handlers.ts` for. Add one (see `users`/`settings` for the pattern) once this feature gets a real endpoint.

## Skills

- Scaffold next feature: `.agents/skills/add-feature/SKILL.md`
- Grow into CRUD: copy `users` via `.agents/skills/add-crud-page/SKILL.md`
