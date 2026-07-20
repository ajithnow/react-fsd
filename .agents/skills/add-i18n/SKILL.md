---
name: add-i18n
description: >-
  Add or update i18n keys for features or shared namespaces (en + de), register
  via FeatureConfig.locales or shared bootstrap. Use when adding translations,
  locale files, or useTranslation namespaces.
---

# Add i18n keys

## Feature locales

1. Edit `src/features/<name>/locales/en.json` and `de.json` (both required)
2. Export from `locales/index.ts` as `{ en, de }`
3. Register in `config.ts`:

```ts
locales: { ns: '<name>', resources: featureLocales }
```

4. In components: `useTranslation('<name>')` with keys matching JSON

## Shared / common

- Shared strings live under `src/shared/locales/`
- Registered in `main.tsx` as namespaces `common` and `shared`
- Shell sidebar keys use `shared` (see `src/core/shell/sidebar.ts`)

## Sidebar labels

`SidebarItemConfig`: `labelKey` + optional `ns` (defaults to `shared`). Feature items should set `ns` to the feature namespace.

## Rules

- Never ship English-only feature keys
- Keep `ns` equal to the feature folder name unless intentional
- Do not load feature JSON via ad-hoc imports outside the registry path
