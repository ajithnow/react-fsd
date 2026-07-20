# Docs note for agents

**Prefer `src/` and `.agents/` over this `docs/` tree.**

Hub: [AGENTS.md](../AGENTS.md) · Adapting: [ADAPTING.md](./ADAPTING.md)

## Why

Much of `docs/` is TypeDoc markdown (and an older README copy). It can describe APIs or paths that no longer exist.

## Known drift (do not follow blindly)

| Stale doc idea | Current reality |
|----------------|-----------------|
| RBAC under `src/core/rbac/` | `src/shared/lib/rbac/` |
| `RBACProvider` / role helpers as primary API | `hasPermission`, `<Can>`, `useRBAC()` |
| Feature-flag loaders (`loadFeatureFlags`, etc.) | May be absent — verify in `src/` |
| Jest / ESLint test commands | **Vitest** + **Oxlint** |
| Manual feature registration | `config.ts` glob in `src/main.tsx` |

## When to use TypeDoc here

- Exploring generated signatures after a fresh `npx typedoc` run
- Never as the authority for architecture or “how to add a feature”

If TypeDoc and source disagree, **source wins**.
