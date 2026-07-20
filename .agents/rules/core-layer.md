# Core layer

Cursor rule: `.cursor/rules/core-layer.mdc`

## Responsibilities

| Area | Path | Notes |
|------|------|-------|
| Registry | `src/core/registry/` | Types, bootstrap, freeze pattern |
| Router | `src/core/router/` | Layouts, assembly, lazy router Proxy |
| Store | `src/core/store/` | Redux + persist; whitelist empty (v2) |
| API | `src/core/api/` | Axios / base URL from env |
| i18n | `src/core/i18n/` | Init after feature locale registration |
| Shell | `src/core/shell/` | Non-feature sidebar (home) |

## Router layouts

- `appLayoutRoute` — authenticated app shell; feature app pages use this parent
- `authLayoutRoute` — login and guest auth flows
- `/` home — ungated; safe deny redirect target

## Store wiring

New slice:

1. Create slice in a feature (or carefully in core if truly global)
2. Import reducer in `src/core/store/index.ts` and add to `combineReducers`
3. Persist whitelist stays empty unless you intentionally persist a slice

## Coupling

`core` already depends on `features/auth` for the auth slice. Avoid new feature imports into core unless bootstrap truly requires them.
