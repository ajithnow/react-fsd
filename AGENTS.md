# AGENTS.md — Agent entrypoint

Admin dashboard boilerplate (React 19, Vite 7, TypeScript, Feature-Sliced Design).  
**Prefer source code over README/TypeDoc.** See [docs/AGENT.md](docs/AGENT.md).

## Source of truth (highest first)

1. `src/`
2. `.agents/rules/` + `.agents/skills/`
3. This file (`AGENTS.md`)
4. Root `README.md` / generated `docs/` (may be stale)

## Stack & layers

```text
src/
├── features/   # Domain modules (auth, users, bookings, settings)
├── core/       # Bootstrap: api, i18n, registry, router, store, shell
├── shared/     # Reusable UI, hooks, RBAC, locales
├── lib/shadcn/ # UI primitives
└── styles/
```

Dependency intent: features → shared/core → lib.  
Reality: `core`/`shared` already import privileged `features/auth` (and sometimes `users`). Do not “fix” that by adding more feature imports into shared without intent.

## Bootstrap

[`src/main.tsx`](src/main.tsx):

1. Register shared locales (`common`, `shared`) + `shellSidebar`
2. Eager-load every `src/features/*/config.ts` via `import.meta.glob`
3. `bootstrapFeatures` → registries (routes, locales, sidebar, …)
4. `assembleRoutes`
5. `initializeI18n()` → render `<App />`

Adding a feature = add `config.ts`. **Do not** edit `main.tsx` for registration.

Session: tokens in storage; user/permissions from `/api/auth/me` via `SessionBootstrap` (not persisted).

## Commands

```bash
npm run dev          # Vite dev server
npm run build        # tsc + vite build
npm run test         # Vitest watch
npm run test:ci      # Vitest + coverage
npm run lint         # Oxlint (type-aware)
```

## Env

Copy [`.env.example`](.env.example):

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | API base |
| `VITE_RBAC_ENABLED` | `false` bypasses frontend RBAC |
| `NODE_ENV` | Node environment |

## Adapting this boilerplate

Forking into a real product: **[docs/ADAPTING.md](docs/ADAPTING.md)**  
Skill: [`.agents/skills/adapt-project/SKILL.md`](.agents/skills/adapt-project/SKILL.md)

## Rules by context

| Context | Cursor rule | Long-form |
|---------|-------------|-----------|
| Always | [`.cursor/rules/architecture.mdc`](.cursor/rules/architecture.mdc) | [`.agents/rules/architecture.md`](.agents/rules/architecture.md) |
| Features | [`.cursor/rules/add-feature.mdc`](.cursor/rules/add-feature.mdc) | [`.agents/rules/add-feature.md`](.agents/rules/add-feature.md) |
| Core | [`.cursor/rules/core-layer.mdc`](.cursor/rules/core-layer.mdc) | [`.agents/rules/core-layer.md`](.agents/rules/core-layer.md) |
| Shared | [`.cursor/rules/shared-layer.mdc`](.cursor/rules/shared-layer.mdc) | [`.agents/rules/shared-layer.md`](.agents/rules/shared-layer.md) |
| Tests | [`.cursor/rules/testing.mdc`](.cursor/rules/testing.mdc) | [`.agents/rules/testing.md`](.agents/rules/testing.md) |
| UI | [`.cursor/rules/ui-shadcn.mdc`](.cursor/rules/ui-shadcn.mdc) | — |

## Skills (workflows)

| Skill | When |
|-------|------|
| [add-feature](.agents/skills/add-feature/SKILL.md) | New domain module (`bookings` scaffold) |
| [add-crud-page](.agents/skills/add-crud-page/SKILL.md) | Full CRUD (`users` reference) |
| [gate-rbac](.agents/skills/gate-rbac/SKILL.md) | Route + sidebar + `<Can>` |
| [add-i18n](.agents/skills/add-i18n/SKILL.md) | en/de keys + namespace |
| [adapt-project](.agents/skills/adapt-project/SKILL.md) | Rename/brand/env/sample features |

## Conventions (short)

- Imports: `@/…` → `src/…`
- Permissions: `resource:action` in the feature; gate with `hasPermission` / `<Can>` / `useRBAC()`
- Denied routes: redirect to `/` (ungated), not another gated path
- Queries = TanStack Query only; managers = navigate/toast/Redux side-effects
- Locales: always `en.json` + `de.json`; register via `config.locales`
- New Redux slice → wire in [`src/core/store/index.ts`](src/core/store/index.ts)
- UI: `@/lib/shadcn/...` or `@/shared/components` (not `@/components` from `components.json`)

## Pitfalls (do not)

1. Manual route/locale registration in `main.tsx` or shared hooks
2. Role-based checks or client role→permission maps (permissions come from `/me`)
3. Redirect deny → gated route (loops)
4. Missing `de.json` or wrong i18n `ns`
5. Business nav lists inside `useSidebar`
6. Jest / ESLint / `--testPathPattern` (stack is Vitest + Oxlint)
7. Trusting TypeDoc paths like `core/rbac` or feature-flag APIs that are gone
8. ShadCN aliases from `components.json` that do not match the tree
9. Assuming pure FSD — auth is cross-cutting
10. Forgetting store wiring for a new slice

## Reference features

- Scaffold: [`src/features/bookings/`](src/features/bookings/)
- Full CRUD: [`src/features/users/`](src/features/users/)
- Privileged session: [`src/features/auth/`](src/features/auth/)
