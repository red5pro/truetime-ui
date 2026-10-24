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
import 'truetime-ui/fonts.css'; // @font-face for ClashDisplay, Inter and JetBrains Mono
import { TrueTimeThemeProvider } from 'truetime-ui';

<TrueTimeThemeProvider theme="black">
  {/* or "blue", "broadcast", …; typeface="interface" sets text in Inter; renders CssBaseline */}
  <App />
</TrueTimeThemeProvider>;
```

```tsx
import { Button, FormField, Input, PasswordInput, Checkbox, Alert, Card, Heading, Text, Spinner } from 'truetime-ui';
import logo from 'truetime-ui/assets/images/red5-truetime-logo.png';

<FormField label="Email" error={!!error} helperText={error} required>
  <Input name="email" type="email" autoComplete="username" />
</FormField>
<Button color="secondary" shape="pill" loading={submitting} type="submit">Sign in</Button>
```

If the app is tested with Vitest, add `server: { deps: { inline: ['truetime-ui'] } }` to the
`test` config. MUI 6 uses directory imports that Node's ESM resolver rejects, so Vite has to
transform the package.

## Exports

| Export                                                                                                                                                                 | What it is                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `palettes`, `blackPalette`, `bluePalette`, `purplePalette`, `emeraldPalette`, `auroraPalette`, `sunsetPalette`, `oceanPalette`, `broadcastPalette`, `semanticColors()` | Color tokens: a lightness scale (`themeColor0…99`), status colors, an optional `backgroundGradient` drawn behind the page (Aurora, Sunset, Ocean), and role-based aliases (`background`, `backgroundImage`, `surface`, `surfaceRaised`, `border`, `text`, `mutedText`, `focus`, …, and the tally colors `program`/`onProgram`, `preview`/`onPreview`, `monitor`). Theme names: `black`, `blue`, `purple`, `emerald`, `aurora`, `sunset`, `ocean`, `broadcast` (cool neutrals for control rooms) |
| `broadcastColors`                                                                                                                                                      | Broadcast tally colors, the same in every palette: `program` (on air, red) and `preview` (green), each with its text color, and `monitor` (black behind video). Not themeable, so on-air state reads the same for every company                                                                                                                                                                                                                                                                 |
| `contrastRatio`, `relativeLuminance`, `readableOn`, `looksLikeTally`                                                                                                   | WCAG contrast helpers for checking palettes and brand colors: the ratio between two hex colors, the better of dark/white text on a color, and whether a color could be mistaken for a tally. Every palette is tested against them                                                                                                                                                                                                                                                               |
| `fontFamily`, `fontWeight`, `typography`, `radii`, `controlPadding`, `borderWidth`, `focusRing`, `shadows`, `motion`, `spacingUnit`, `monoText`, `Typeface`            | Non-color tokens. `fontFamily` has `display` (ClashDisplay), `ui` (Inter) and `mono` (JetBrains Mono); `monoText` is mono with tabular digits for timecodes and measurements                                                                                                                                                                                                                                                                                                                    |
| `createTrueTimeTheme(name, { typeface })`                                                                                                                              | MUI theme. Adds `theme.palette.themeColor[n]`, `palette.iconColor` etc. (types included) and `theme.truetime.colors` (semantic tokens). `typeface: "interface"` sets text in Inter and keeps ClashDisplay for headings (default `"display"`: ClashDisplay throughout)                                                                                                                                                                                                                           |
| `TrueTimeThemeProvider`                                                                                                                                                | `ThemeProvider` + `CssBaseline`, memoised per theme name and `typeface`                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `Button`                                                                                                                                                               | MUI Button; contained by default, `shape="pill"`, `loading` (disabled + `aria-busy`), focus ring; accepts `component` (e.g. a router `Link`). `holdMs` + `onHoldComplete` confirm on press and hold (pointer or Space/Enter) with a fill showing progress, for costly actions such as going live                                                                                                                                                                                                |
| `Input`, `PasswordInput`                                                                                                                                               | Outlined input in the Meetings style; password show/hide toggle (`aria-pressed`)                                                                                                                                                                                                                                                                                                                                                                                                                |
| `Label`, `FormField`, `useFormField`                                                                                                                                   | FormField wires the label `for`, `aria-describedby` and error/required/disabled state into its input                                                                                                                                                                                                                                                                                                                                                                                            |
| `Checkbox`                                                                                                                                                             | Optional clickable `label`                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `Switch`                                                                                                                                                               | On/off toggle (`role="switch"`) for settings that apply immediately; `tone="preview"` turns it the preview green when on                                                                                                                                                                                                                                                                                                                                                                        |
| `Select`                                                                                                                                                               | Dropdown for one of a few `options` (`{value, label, disabled?}`), with the `Input` look; labelled by a `FormField` or `inputProps`                                                                                                                                                                                                                                                                                                                                                             |
| `RailButton`                                                                                                                                                           | Icon-over-label toggle for a side rail of tools (`selected`, `badge` count)                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `VolumeControl`                                                                                                                                                        | Mute button and volume slider (0–1) for one audio source; unmuting restores the previous volume                                                                                                                                                                                                                                                                                                                                                                                                 |
| `OptionTile`                                                                                                                                                           | Choice in a grid of visual options: 16:9 `preview` swatch + label, outlined when `selected`                                                                                                                                                                                                                                                                                                                                                                                                     |
| `Card`                                                                                                                                                                 | Dialog-style surface; `padding` sm/md/lg, `variant` outlined/plain                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `Heading`, `Text`                                                                                                                                                      | Semantic heading level separate from its visual variant; text `tone` muted/error/success, `mono` for timecodes and numbers                                                                                                                                                                                                                                                                                                                                                                      |
| `Spinner`                                                                                                                                                              | `circle` / `dots` / `ring` / `bars` (from the Meetings CustomSpinner), `role="progressbar"`                                                                                                                                                                                                                                                                                                                                                                                                     |
| `Alert`                                                                                                                                                                | Status message; `role="alert"` for error/warning, `status` otherwise; `floating` puts it on a solid surface with a shadow for toasts over other content                                                                                                                                                                                                                                                                                                                                         |
| `StatusBadge`                                                                                                                                                          | Compact status label (`live`, `preview`, `success`, `warning`, `error`, `neutral`): `live` is the solid on-air red and `preview` the solid preview green in every theme; `error` is tinted and carries an icon so it isn't read as on air                                                                                                                                                                                                                                                       |
| `TruncatedText`                                                                                                                                                        | One line of text cut short with "…" when it doesn't fit, with a tooltip showing all of it only while it's cut short                                                                                                                                                                                                                                                                                                                                                                             |
| `VideoTile`                                                                                                                                                            | One participant's video: name label, mic-off indicator, initials or custom `avatar` without video (`avatarFill` fills the whole tile with it, e.g. a round tile), hover/focus `actions` (always visible on touch), `mirrored`, `videoId` for SDKs that look up the element. Muted unless `playAudio`. `tally="program"`/`"preview"` draws an inset tally border and a PGM/PVW chip                                                                                                              |
| `ChatPanel`                                                                                                                                                            | Message log (`role="log"`) and composer; Enter sends, Shift+Enter adds a line, `unavailable` replaces the composer with a reason; `onSend` may return a promise (the draft is kept until it resolves); `header` sits above the log, `renderMessageActions` adds controls beside each message, `renderAuthorBadge` adds e.g. a role icon after the author's name, and `flagged` messages are outlined                                                                                            |
| `DeviceSelector`                                                                                                                                                       | Camera/mic/speaker pickers with a mic level meter (moved from the Meetings lobby); pass `isMobile` for front/back camera choices; `orientation="vertical"` stacks them at full width (settings popups)                                                                                                                                                                                                                                                                                          |
| `ControlButton`, `roundControlStyle`, `rectangularControlStyle`                                                                                                        | Meetings media control button (`glass`, `overlay`), moved from Meetings `CustomizedBtn`                                                                                                                                                                                                                                                                                                                                                                                                         |
| `AudioMeter`, `meterPosition`, `streamLevelReader`                                                                                                                     | Compact audio level meter (vertical or horizontal) for a `stream` or a `getLevel()` callback: green to -18 dBFS, amber to -6, red above, peak held 1.5s; redrawn on animation frames without re-rendering, one shared AudioContext                                                                                                                                                                                                                                                              |
| `Keycap`                                                                                                                                                               | A keyboard shortcut hint (`<kbd>`), e.g. `T` on a button                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `focusRingStyle(theme)`, `themeColors(theme)`, `visuallyHidden`                                                                                                        | Style helpers so app-level interactive elements match the components; `visuallyHidden` keeps text for screen readers only                                                                                                                                                                                                                                                                                                                                                                       |
| `truetime-ui/fonts.css`, `truetime-ui/assets/*`                                                                                                                        | Fonts (ClashDisplay, and Inter and JetBrains Mono under the SIL Open Font License, licences next to the files) and images: `images/red5-truetime-logo.png` (Red5 mark and wordmark, white lettering for the dark themes), `images/red5-truetime-solutions-logo.png` (the same with "TrueTime Solutions" underneath), `images/red5-cloud-logo.svg`                                                                                                                                               |

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

Add it to `src/tokens/` (colors go in **every** palette, plus a `semanticColors` alias if components
need it by role) and export it from `src/index.ts`. Change values here, not in the apps.

### Adding a component

Add `src/components/<Name>/<Name>.tsx` with a test next to it. Wrap the MUI component, style it from
`themeColors(theme)` / tokens rather than hex values, keep business logic out, and export the
component and its props type from `src/index.ts`. Avoid global theme overrides unless every app
should change.
