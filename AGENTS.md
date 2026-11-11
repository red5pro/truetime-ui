# AGENTS.md — truetime-ui

Shared UI library for the TrueTime frontend apps: design tokens, the MUI theme, the brand font and
accessible React components. Repository: https://github.com/red5pro/truetime-ui

It is consumed by sibling checkouts:

- `../truetime-studio-web`
- `../red5-truetime-meetings`

Both install it from GitHub at the current epic's branch
(`"truetime-ui": "github:red5pro/truetime-ui#epic/BOSTON"`), so library changes for an epic go on
its `epic/<NAME>` branch. npm runs `prepare` to build `dist/` on install, since `dist/` isn't
committed.
See [README.md](README.md) for the full export table.

## This repo is the single source of UI

UI that more than one app needs, or that is generic (no app business logic), belongs **here**, not
in an app. When an app needs a component, token or style helper that doesn't exist yet, add it to
this library and consume it from the app rather than building a local copy.

Before adding something new, check whether an existing export covers it or can be extended with a
prop. Prefer extending over adding a near-duplicate.

## Stack and layout

- React 19, MUI 6 (≥ 6.4), `@mui/icons-material` and Emotion are **peer dependencies**. Never add
  them to `dependencies`.
- Plain ESM built by `tsc` into `dist/` with `.d.ts` files. Relative imports in `src/` use the
  `.js` extension (`from './Button.js'`).
- `src/tokens/` — `palettes.ts` (color palettes + `semanticColors`) and `tokens.ts` (typography,
  radii, shadows, motion, …)
- `src/theme/` — `createTrueTimeTheme`, `TrueTimeThemeProvider`
- `src/components/<Name>/<Name>.tsx` with `<Name>.test.tsx` next to it
- `src/components/styleUtils.ts` — `themeColors(theme)`, `focusRingStyle(theme)`
- `src/assets/` (fonts, images) and `src/styles/fonts.css`, copied to `dist/` by
  `scripts/copy-assets.mjs`
- `src/index.ts` — the public API. Anything not exported here is private.

## Adding or changing a component

1. Create `src/components/<Name>/<Name>.tsx`, wrapping the relevant MUI component where one exists.
2. Style from `themeColors(theme)` and the tokens. No hex values or one-off colors in components.
3. Keep business logic, data fetching, SDK calls (Red5, conference) and app routing out. Take data
   and callbacks through props.
4. Make it accessible: correct roles/ARIA, keyboard support, visible focus via `focusRingStyle`.
5. Add a Vitest + Testing Library test next to it (use `src/test/render.tsx` for the themed render).
6. Export the component **and** its props type from `src/index.ts`.
7. Add a row to the Exports table in `README.md`, and update "Used by" if an app starts using it.

Avoid global theme overrides in `createTrueTimeTheme` unless every app should change. Treat
existing props as a public API: both apps depend on them, so rename or remove only with a matching
change in each app.

## Adding a token

Add it to `src/tokens/`. Colors go in **every** palette (`black`, `blue`, `purple`, `emerald`, `aurora`,
`sunset`, `ocean`), plus a
`semanticColors` alias if components need it by role. Export it from `src/index.ts`. Values change
here, not in the apps.

## Moving a component out of an app

When migrating an app's local component here (as was done for `DeviceSelector`, `Spinner`,
`ControlButton`): strip app-specific logic into props, add tests, export it, then replace the app's
copy with an import from `truetime-ui` (a thin re-export under the old name is fine to avoid a large
rename).

## Commands

```bash
npm run build        # dist/ (also runs on `prepare`)
npm run dev          # tsc --watch
npm test             # vitest
npm run typecheck && npm run lint && npm run format:check
```

Run build, tests, typecheck and lint before finishing a change. To try a change in an app before
pushing, rebuild here, then run `npm run ui:sync` in the app (installs this checkout without saving)
and restart its dev server. After pushing, run `npm update truetime-ui` in each app so its lockfile
picks up the new commit.
