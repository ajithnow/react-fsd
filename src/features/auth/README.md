# Feature: auth

Privileged session feature — login, logout, profile/`/me`, Redux `auth` slice, guest/auth guards.

## Registration

[`config.ts`](./config.ts) — routes, `auth` locales, constants, guards.  
Wired into the store via [`src/core/store/index.ts`](../../core/store/index.ts).

## Key paths

| Area                  | Path                                                      |
| --------------------- | --------------------------------------------------------- |
| Routes                | `routes/auth.route.tsx`                                   |
| Slice                 | `stores/auth.slice.ts`                                    |
| Profile /me           | `services/profile.service.ts`, `queries/profile.query.ts` |
| Login/logout managers | `managers/`                                               |
| Guards                | `guards/AuthGuard.tsx`, `GuestGuard.tsx`                  |
| Dev-only API mocks    | `mocks/handlers.ts`                                       |

## Notes

- `mocks/handlers.ts` exports a `handlers` array picked up automatically by `src/core/mocks/browser.ts` (glob-scans `features/*/mocks/handlers.ts`). Only loaded in dev when `VITE_MSW_ENABLED=true` — never bundled into production. Any feature can add its own `mocks/handlers.ts` the same way.
- Permissions for the whole app come from `/api/auth/me`, not from this feature’s sidebar (auth has no app sidebar entry).
- Do not remove this module without replacing session bootstrap.
- Patterns: queries vs managers — see `AGENTS.md`.
