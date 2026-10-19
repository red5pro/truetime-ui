# TrueTime™ UI

Shared UI library for TrueTime frontend apps:
design tokens, the MUI theme, the brand font and a small set of accessible components.

## Stack

React 19, MUI 6 (≥ 6.4), `@mui/icons-material` and Emotion are **peer dependencies**, so the app supplies them. The package is
plain ESM built by `tsc`, with `.d.ts` files. Fonts and images ship as files that the app's bundler
(Vite) resolves.

## Using it in an app

```jsonc
// package.json
"dependencies": { "truetime-ui": "github:red5pro/truetime-ui" },
// npm 11.x blocks dependency install scripts unless approved; `prepare` builds dist/ on install
"allowScripts": { "truetime-ui": true }
```

```ini
# .npmrc — when installing a local checkout (`npm run ui:sync`), use a packed copy instead of a
# symlink, so react/@mui/@emotion resolve to the app's single copy (a symlink would pull in this
# repo's dev copies and break hooks/theme context).
install-links=true
```

```tsx
// main.tsx
import 'truetime-ui/fonts.css'; // @font-face for ClashDisplay
import { TrueTimeThemeProvider } from 'truetime-ui';

<TrueTimeThemeProvider theme="black">
  {/* or "blue"; renders CssBaseline */}
  <App />
</TrueTimeThemeProvider>;
```

```tsx
import { Button, FormField, Input, PasswordInput, Checkbox, Alert, Card, Heading, Text, Spinner } from 'truetime-ui';
import logo from 'truetime-ui/assets/images/red5-cloud-logo.svg';

<FormField label="Email" error={!!error} helperText={error} required>
  <Input name="email" type="email" autoComplete="username" />
</FormField>
<Button color="secondary" shape="pill" loading={submitting} type="submit">Sign in</Button>
```

If the app is tested with Vitest, add `server: { deps: { inline: ['truetime-ui'] } }` to the
`test` config. MUI 6 uses directory imports that Node's ESM resolver rejects, so Vite has to
transform the package.

## Exports

| Export                                                                                                                              | What it is                                                                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `palettes`, `blackPalette`, `bluePalette`, `semanticColors()`                                                                       | Color tokens: a lightness scale (`themeColor0…99`), status colors, and role-based aliases (`background`, `surface`, `surfaceRaised`, `border`, `text`, `mutedText`, `focus`, …)                                                       |
| `fontFamily`, `fontWeight`, `typography`, `radii`, `controlPadding`, `borderWidth`, `focusRing`, `shadows`, `motion`, `spacingUnit` | Non-color tokens                                                                                                                                                                                                                      |
| `createTrueTimeTheme(name)`                                                                                                         | MUI theme. Adds `theme.palette.themeColor[n]`, `palette.iconColor` etc. (types included) and `theme.truetime.colors` (semantic tokens)                                                                                                |
| `TrueTimeThemeProvider`                                                                                                             | `ThemeProvider` + `CssBaseline`, memoised per theme name                                                                                                                                                                              |
| `Button`                                                                                                                            | MUI Button; contained by default, `shape="pill"`, `loading` (disabled + `aria-busy`), focus ring; accepts `component` (e.g. a router `Link`)                                                                                          |
| `Input`, `PasswordInput`                                                                                                            | Outlined input in the Meetings style; password show/hide toggle (`aria-pressed`)                                                                                                                                                      |
| `Label`, `FormField`, `useFormField`                                                                                                | FormField wires the label `for`, `aria-describedby` and error/required/disabled state into its input                                                                                                                                  |
| `Checkbox`                                                                                                                          | Optional clickable `label`                                                                                                                                                                                                            |
| `Switch`                                                                                                                            | On/off toggle (`role="switch"`) for settings that apply immediately                                                                                                                                                                   |
| `RailButton`                                                                                                                        | Icon-over-label toggle for a side rail of tools (`selected`, `badge` count)                                                                                                                                                           |
| `OptionTile`                                                                                                                        | Choice in a grid of visual options: 16:9 `preview` swatch + label, outlined when `selected`                                                                                                                                           |
| `Card`                                                                                                                              | Dialog-style surface; `padding` sm/md/lg, `variant` outlined/plain                                                                                                                                                                    |
| `Heading`, `Text`                                                                                                                   | Semantic heading level separate from its visual variant; text `tone` muted/error/success                                                                                                                                              |
| `Spinner`                                                                                                                           | `circle` / `dots` / `ring` / `bars` (from the Meetings CustomSpinner), `role="progressbar"`                                                                                                                                           |
| `Alert`                                                                                                                             | Status message; `role="alert"` for error/warning, `status` otherwise                                                                                                                                                                  |
| `StatusBadge`                                                                                                                       | Compact status label (`live`, `success`, `warning`, `neutral`), e.g. LIVE on video                                                                                                                                                    |
| `VideoTile`                                                                                                                         | One participant's video: name label, mic-off indicator, initials or custom `avatar` without video, hover/focus `actions` (always visible on touch), `mirrored`, `videoId` for SDKs that look up the element. Muted unless `playAudio` |
| `ChatPanel`                                                                                                                         | Message log (`role="log"`) and composer; Enter sends, Shift+Enter adds a line, `unavailable` replaces the composer with a reason                                                                                                      |
| `DeviceSelector`                                                                                                                    | Camera/mic/speaker pickers with a mic level meter (moved from the Meetings lobby); pass `isMobile` for front/back camera choices; `orientation="vertical"` stacks them at full width (settings popups)                                |
| `ControlButton`, `roundControlStyle`, `rectangularControlStyle`                                                                     | Meetings media control button (`glass`, `overlay`), moved from Meetings `CustomizedBtn`                                                                                                                                               |
| `focusRingStyle(theme)`, `themeColors(theme)`                                                                                       | Style helpers so app-level interactive elements match the components                                                                                                                                                                  |
| `truetime-ui/fonts.css`, `truetime-ui/assets/*`                                                                                     | Brand font and images                                                                                                                                                                                                                 |

## Used by

- **red5-truetime-meetings**: theme and fonts, `Spinner` (was `CustomSpinner`), `DeviceSelector`,
  `ControlButton` (re-exported from `Components/CustomizedBtn.tsx` under the old names), shadow tokens.
- **truetime-studio-web**: everything above, for login, studios, lobby and studio room.

## Developing

```bash
npm install
npm run build        # dist/ (also runs on `prepare`)
npm run dev          # tsc --watch
npm test             # vitest
npm run typecheck && npm run lint
```

Apps install the library from GitHub, so a change reaches them once it's pushed and they run
`npm update truetime-ui`. To try a change before pushing, run `npm run ui:sync` in the app: it
installs this checkout (without saving) and clears Vite's pre-bundle cache; then restart the dev
server. A plain `npm install` in the app goes back to the GitHub version.

### Adding a token

Add it to `src/tokens/` (colors go in **both** palettes, plus a `semanticColors` alias if components
need it by role) and export it from `src/index.ts`. Change values here, not in the apps.

### Adding a component

Add `src/components/<Name>/<Name>.tsx` with a test next to it. Wrap the MUI component, style it from
`themeColors(theme)` / tokens rather than hex values, keep business logic out, and export the
component and its props type from `src/index.ts`. Avoid global theme overrides unless every app
should change.
