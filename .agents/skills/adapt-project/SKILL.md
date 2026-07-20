---
name: adapt-project
description: >-
  Adapt this admin-dashboard boilerplate for a new product: rename package/PWA,
  env, branding, keep or remove sample features, wire API/auth. Use when
  forking, customizing, or bootstrapping a new admin app from this repo.
---

# Adapt this project

Follow the full checklist in **[docs/ADAPTING.md](../../../docs/ADAPTING.md)**.

## Quick path

1. Rename `package.json` name; update PWA `manifest` in `vite.config.ts`
2. Copy `.env.example` → `.env` (`VITE_API_BASE_URL`, `VITE_RBAC_ENABLED`)
3. Align API/auth with `/api/auth/me` permission payload (or adjust services)
4. Decide sample features: keep `auth`; trim `bookings` / `users` / `settings` as needed
5. Add product domains via `add-feature` / `add-crud-page` (no `main.tsx` edits)
6. Update shell branding (`src/core/shell/sidebar.ts`, assets under `public/`)
7. Ship en+de copy; smoke login → sidebar → gated deny → `/`

## Do not

- Rip out `auth` without a replacement session path
- Hardcode new nav into `useSidebar`
- Trust stale TypeDoc / README Jest examples while adapting
