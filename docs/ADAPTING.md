# Adapting this boilerplate

Turn `admin-dashboard-boilerplate` into your product admin UI.  
Agent hub: [AGENTS.md](../AGENTS.md) · Skill: [`.agents/skills/adapt-project/SKILL.md`](../.agents/skills/adapt-project/SKILL.md)

## 1. Rename and brand

| What | Where |
|------|--------|
| Package name | `package.json` → `"name": "admin-dashboard-boilerplate"` |
| PWA name / short_name / description | `vite.config.ts` → `VitePWA({ manifest: … })` |
| Shell home nav | `src/core/shell/sidebar.ts` |
| Icons / logos | `public/` (`favicon.svg`, `logo.svg`, PWA icons) |
| HTML title | `index.html` (if present) |

## 2. Environment

```bash
cp .env.example .env
```

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Backend API origin/path used by `src/core/api` |
| `VITE_RBAC_ENABLED` | Set `false` while scaffolding UI without real permissions |
| `NODE_ENV` | Node environment |

## 3. Auth and API contract

- Login/logout/profile live in `src/features/auth/`
- Session identity and **permissions** load from `/api/auth/me` (see `SessionBootstrap` / profile service)
- Expect permission strings like `users:read`, `bookings:manage`
- Adjust endpoints in feature `constants` / `services` and API client base URL — do not invent a client-side role map

**Do not remove `auth` without replacing the session path** (store slice, guards, login routes).

## 4. Sample features — keep or drop

| Feature | Role | Guidance |
|---------|------|----------|
| `auth` | Privileged session | Keep; customize UI/copy |
| `users` | Full CRUD reference | Keep as pattern, or delete when you have your own CRUD |
| `bookings` | Minimal scaffold | Safe to delete or replace with a real domain |
| `settings` | Profile/account UI | Keep if you need settings; else remove folder |

Deleting a feature = delete `src/features/<name>/`. Glob registration needs no `main.tsx` change.  
If something in `core`/`shared` imported that feature, fix those imports (prefer not adding new ones).

## 5. Add your domains

1. Scaffold with skill **add-feature** (from `bookings`) or **add-crud-page** (from `users`)
2. Own routes, permissions, locales (en+de), sidebar in the feature
3. Gate with skill **gate-rbac**
4. No edits to `main.tsx` for registration

## 6. Locales

- Product copy: feature `locales/en.json` + `de.json`
- Cross-cutting strings: `src/shared/locales/` (`common` / `shared`)
- Skill: **add-i18n**

## 7. Redux

Only `auth` is wired today. New global slices:

1. Create the slice
2. Register in `src/core/store/index.ts` `combineReducers`
3. Leave persist whitelist empty unless you intentionally persist state (user profile is loaded from `/me`, not persisted)

## 8. RBAC for production

1. Set `VITE_RBAC_ENABLED=true` (or omit bypass)
2. Ensure `/me` returns the permission list your features declare
3. Verify sidebar hide + route deny → `/` + `<Can>` on actions

## 9. Smoke checklist

- [ ] `npm run dev` boots; PWA/name looks correct
- [ ] Login works against your API
- [ ] `/me` populates user + permissions
- [ ] Feature sidebar items show/hide by permission
- [ ] Gated route without permission redirects to `/` (no loop)
- [ ] `npm run lint` and `npm run test:ci` pass
- [ ] Both `en` and `de` strings present for touched features

## Related

- Agent source-of-truth note: [AGENT.md](./AGENT.md)
- Architecture: [AGENTS.md](../AGENTS.md)
