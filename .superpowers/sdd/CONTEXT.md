# Dual-Mode IA — Centralized SDD Context

**Branch:** `feat/dual-mode-ia`  
**Spec:** `docs/superpowers/specs/2026-07-01-dual-mode-ia-design.md`  
**Plan:** `docs/superpowers/plans/2026-07-01-dual-mode-ia.md`  
**Base commit:** `717b6b6d`

## Global Constraints (verbatim — all tasks)

- Typography: Fraunces (display), Inter (body) — do not change `tailwind.config.js` font families
- Colors: `organic-*`, `primary-*`, `surface` only — no new palette
- Browse labels: `Guided` / `Explore` (not beginner/advanced)
- Sidebar: ≤5 primary nav items per mode
- `localStorage` key: `kn-browse-mode`, schema `{ v: 1, mode, forkDismissed, updatedAt }`
- Mode switch: segmented toggle at sidebar bottom
- Mobile responsive on all new/changed pages
- React: lazy `useState` init for storage, `startTransition` on mode switch, derive nav at render

## Architecture

`BrowseModeProvider` at `App.js` root → `useBrowseMode()` → pages + Sidebar read `mode` / `effectiveMode`. Nav from `src/config/navigation.js`. Legacy URLs via `LegacyRedirect`. Data filtered by optional `tier` field.

## Implemented Interfaces (update after each task)

### Task 1 — complete (`4de83688`)

```js
// src/hooks/useBrowseMode.js
export const STORAGE_KEY = 'kn-browse-mode';
export function readBrowseModeState()
export function writeBrowseModeState(partial)

// src/context/BrowseModeContext.jsx
export function BrowseModeProvider({ children })
export function useBrowseMode() → {
  mode, setMode, isModeSet, forkDismissed, dismissFork, effectiveMode
}
// setMode(mode, { onAfterSet?: (mode) => void })
```

### Task 2 — complete (`65868b38`)

```js
// src/config/navigation.js
export const MODE_HOME
export const NAV_BY_MODE
export const MORE_LINKS_GUIDED
export const ROUTE_AVAILABILITY
export function getNavForMode(mode)
export function isRouteAvailable(pathname, mode)
```

### Task 3 — complete

```jsx
// src/components/BrowseModeToggle.jsx
export default function BrowseModeToggle({ isDesktopOpen = true })
// Consumes: useBrowseMode().effectiveMode, setMode
// Expanded: segmented Guided/Explore buttons
// Collapsed: icon-only Map/Compass stack
```

### Task 4 — complete

```jsx
// src/utils/navIcons.js
export const NAV_ICONS // iconKey -> Lucide icon component map (explicit imports only)

// src/App.js
<BrowseModeProvider>
  <Router>{/* app shell */}</Router>
</BrowseModeProvider>

// src/components/Sidebar.jsx
const { effectiveMode } = useBrowseMode();
const navItems = getNavForMode(effectiveMode);
<BrowseModeToggle isDesktopOpen={true} />   // mobile drawer
<BrowseModeToggle isDesktopOpen={isDesktopOpen} /> // desktop sidebar
// Nav icons rendered from NAV_ICONS[item.iconKey]

// src/components/BrowseModeToggle.jsx
setMode(mode, {
  onAfterSet: (nextMode) => {
    if (!isRouteAvailable(location.pathname, nextMode)) {
      navigate(MODE_HOME[nextMode], { replace: true });
    }
  },
});
```

### Task 5+ — not yet implemented

## Test Commands

```bash
npm test -- --watchAll=false <pattern>
npm run build
```

## Existing Patterns

- Tests: Jest + RTL; global stubs in `src/setupTests.js` (matchMedia, IntersectionObserver, scrollTo)
- App tests stub IndexedDB in `src/App.test.js`
- ResourceCard tests in `src/components/ResourceCard.test.jsx`
- Icons: prefer `src/utils/iconMap.js` pattern over `import * from lucide-react`

## Do Not

- Change typography or color tokens
- Commit unrelated WIP files
- Use dropdown for mode switch
- Import entire lucide barrel in new files
