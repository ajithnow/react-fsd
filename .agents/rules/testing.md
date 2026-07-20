# Testing

Cursor rule: `.cursor/rules/testing.mdc`

## Stack

- **Vitest** + React Testing Library
- Setup file: `src/test-setup.ts` (jest-dom, ResizeObserver, matchMedia)
- Include globs configured in `vite.config.ts`

## Patterns

- Colocate: `src/**/__tests__/**/*.{test,spec}.{ts,tsx}` or sibling `*.test.tsx`
- Mock at service/query boundary; prefer testing managers/components over pages when coverage excludes pages
- RBAC tests: import `setRbacEnabled` from shared RBAC utils to force on/off

## Commands

```bash
npm test                 # watch
npm run test:ci          # CI + coverage
npm run test:coverage    # coverage only
```

## Anti-patterns

- `jest.fn` / Jest globals / `--testPathPattern`
- Assuming ESLint test runners (project uses Oxlint)
- Expecting full page coverage without checking Vite coverage `exclude`
