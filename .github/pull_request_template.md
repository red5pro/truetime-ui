## What changed

<!-- What this PR does and why. Link the ticket. -->

## Epic

- [ ] Targets the epic branch (`epic/<NAME>`) that Studio and Meetings depend on
- Related Studio / Meetings PRs: <!-- links, or "none" -->

## Impact on the apps

- [ ] No breaking change to existing props or exports, or both apps are updated in the linked PRs
- [ ] Tried in Studio and Meetings with `npm run ui:sync` (if it changes how something looks or behaves)

## Checklist

- [ ] Styled from `themeColors(theme)` and the tokens; new tokens are in every palette
- [ ] Accessible: roles/ARIA, keyboard support, visible focus
- [ ] Test next to the component; new exports are in `src/index.ts` and the README table
- [ ] `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check` and `npm run build` pass
