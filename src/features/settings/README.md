# Feature: settings

Account/profile/notifications settings under `/settings/*`.

## Registration

[`config.ts`](./config.ts) — routes, `settings` locales, sidebar.

## Routes

```text
/settings
/settings/profile
/settings/account
/settings/notifications
```

See `constants/routes.constants.ts` and `routes/settings.route.tsx`.

## Key paths

| Area               | Path                                                          |
| ------------------ | ------------------------------------------------------------- |
| Layout / pages     | `pages/SettingsLayout.tsx`, `ProfilePage`, `AccountPage`, …   |
| Queries / managers | `queries/settings.queries.ts`, `managers/settings.manager.ts` |
| Schemas            | `schema/`                                                     |
| Sidebar            | `sidebar.ts`                                                  |
| Dev-only API mocks | `mocks/handlers.ts` (profile update, change password)         |

## Notes

- Uses the authenticated app layout; profile data often ties to the same adaptable `/me` surface as auth.
- `mocks/handlers.ts` mutates the same shared demo session as `features/auth/mocks/session.ts`, so a profile edit here is reflected by `GET /api/auth/me`.
- For new domains prefer `bookings`/`users` skills rather than cloning settings layout unless you need a settings-style subnav.
