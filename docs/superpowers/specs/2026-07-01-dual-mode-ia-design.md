# Dual-Mode Information Architecture — Design Spec

**Date:** 2026-07-01  
**Status:** Approved (pending user spec review)  
**Project:** KreatorNest (`kreatorsNest`)

## Problem

KreatorNest feels crowded and overwhelming. Symptoms span navigation (11 flat sidebar items), home page density (hero + recommendations + 6-tile bento + scenarios CTA), overlapping sections (Templates vs Downloads, Starter Kit vs Learning), and resource cards that surface too much metadata at once (~68 resources across 5 hubs).

## Goals

1. **Guided mode** — beginners find a clear starting path and essential resources without noise.
2. **Explore mode** — experienced freelancers discover curator picks and hidden gems they might overlook.
3. **Reversible choice** — users switch modes anytime; no lock-in.
4. **Visual continuity** — keep existing typography (Fraunces + Inter) and color tokens (`organic-*`, `primary-*`, `surface`). Restructure layout and information hierarchy only.

## Non-Goals

- Backend or auth changes
- New color palette or font families
- Removing content from the dataset (consolidate presentation, not delete data)
- Public 21st registry publishing (install-only during implementation if useful)

## Chosen Approach

**Approach 1: Dual-mode shell** — one app, two presentation modes driven by `browseMode: 'guided' | 'explore'`. Same routes and data underneath; nav, home, and card density adapt per mode.

Rejected alternatives:
- **Unified nav + in-page tiers only** — does not fix sidebar clutter for beginners.
- **Separate entry URLs (`/start` vs `/discover`)** — feels like two products; routing duplication.

---

## Information Architecture

### Current → Proposed

| Current (11 nav items) | Proposed |
|---|---|
| Home | Mode-specific home (`/`) |
| Starter Kit | **Start Here** (`/starter-kit`) — Guided primary |
| Learning + Tools + Gigs | **Essentials** (Guided) or **Resources** (Explore) |
| Templates + Downloads | **Documents** (`/documents`) — single hub |
| Communities | Explore nav; Guided under **More** |
| Scenarios | **Scenarios** (both modes, simplified Guided view) |
| Contributors + Feedback | **More** menu / footer links |

### Guided Mode Nav (5 items)

| # | Label | Path | Notes |
|---|---|---|---|
| 1 | Start Here | `/starter-kit` | Role-based path + phased essentials |
| 2 | Essentials | `/essentials` | Learning + Tools merged; `tier: essential` default |
| 3 | Documents | `/documents` | Templates + Downloads merged |
| 4 | Scenarios | `/scenarios` | 3 pinned starters; link to full list |
| 5 | More | drawer/panel | Communities, Gigs, Contributors, Feedback |

### Explore Mode Nav (5 items)

| # | Label | Path | Notes |
|---|---|---|---|
| 1 | Discover | `/` | Curator's Picks + Hidden Gems + recommendations |
| 2 | Resources | `/resources` | Learning + Tools + Gigs as tabs/sub-filters |
| 3 | Documents | `/documents` | Same hub; emphasize lesser-known templates |
| 4 | Scenarios | `/scenarios` | Full article library |
| 5 | Community | `/community` | Communities + Contributors; Feedback in footer |

### Route Map

**New routes**

- `/essentials` — Guided merged hub (Learning + Tools, essential tier)
- `/resources` — Explore merged hub (tabs: Learning | Tools | Gigs)
- `/documents` — merged Templates + Downloads
- `/community` — Communities + Contributors (Explore)
- `/more` — optional route or slide-over for Guided secondary links

**Redirects (preserve bookmarks)**

| Old path | Redirect to |
|---|---|
| `/learning` | `/essentials` (guided) or `/resources?tab=learning` (explore) |
| `/tools` | `/essentials` (guided) or `/resources?tab=tools` (explore) |
| `/templates` | `/documents` |
| `/downloads` | `/documents` |
| `/gigs` | `/resources?tab=gigs` (explore) or `/more` (guided) |
| `/communities` | `/community` (explore) or `/more` (guided) |

Implementation: `<Navigate replace>` wrappers or a small `LegacyRedirect` component that reads `browseMode` from context.

**Unchanged routes**

- `/`, `/starter-kit`, `/scenarios`, `/scenarios/:slug`, `/feedback`, `/contributors`

---

## Browse Mode System

### Storage Schema (`client-localstorage-schema`)

```js
// Key: kn-browse-mode
// Value:
{
  v: 1,
  mode: 'guided' | 'explore',
  forkDismissed: boolean,  // "Decide later" on first-visit fork
  updatedAt: ISO8601 string
}
```

- Read once on app init via lazy `useState` initializer (`rerender-lazy-state-init`).
- Write on every mode change; minimal payload.
- Invalid/missing `v` → treat as unset (show first-visit fork).

### Context + Hook

```
src/hooks/useBrowseMode.js   — read/write mode, fork state
src/context/BrowseModeContext.jsx — provider at App root
```

**API surface**

```js
const {
  mode,           // 'guided' | 'explore' | null (unset)
  setMode,        // (mode) => void, persists + optional redirect
  isModeSet,      // boolean
  forkDismissed,
  dismissFork,
} = useBrowseMode();
```

`setMode` behavior:
1. Persist to `localStorage`.
2. Re-render nav from `config/navigation.js`.
3. If current route is unavailable in new mode, `startTransition` + soft redirect to mode home (`rerender-transitions`).
4. Do not remount entire app tree.

### Navigation Config

```
src/config/navigation.js
```

Pure data export — no JSX. Sidebar maps icons/labels at render time.

```js
export const NAV_BY_MODE = {
  guided: [ /* { path, label, iconKey } */ ],
  explore: [ /* ... */ ],
};

export const MORE_LINKS_GUIDED = [ /* gigs, communities, contributors, feedback */ ];
export const MODE_HOME = { guided: '/starter-kit', explore: '/' };
export const ROUTE_AVAILABILITY = { /* path → modes[] */ };
```

---

## Mode Switch UI (Sidebar Bottom)

**Control type:** Segmented toggle (not dropdown) — binary choice, one tap, always visible.

**Placement:** Below nav list, above Install App button. Border-top separator matches existing sidebar footer pattern (`border-organic-stone`).

**Labels:** `Guided` | `Explore` — frame as browse preference, not skill level.

**Expanded sidebar**

```
Browse as
┌─────────────┬─────────────┐
│   Guided    │   Explore   │
└─────────────┴─────────────┘
```

- Active segment: `bg-white text-primary-700 shadow-sm border border-organic-stone`
- Inactive: `text-organic-clay hover:bg-organic-stone/50`
- `role="group"` + `aria-label="Browse mode"`; each segment `aria-pressed`

**Collapsed sidebar**

- Two stacked icon buttons: `Map` (Guided), `Compass` (Explore)
- Active icon gets `primary-700` background
- `title` tooltip: "Browse as: Guided" / "Browse as: Explore"

**Mobile drawer**

- Same toggle above Install App, full width.

**Component:** `src/components/BrowseModeToggle.jsx` — shared by mobile + desktop sidebar.

21st registry: search team library for segmented control during implementation (`npx @21st-dev/registry search "toggle"`). Fall back to custom toggle using existing tokens if no fit.

---

## First-Visit Fork

**When:** `kn-browse-mode` unset and `forkDismissed !== true`.

**Where:** Inline under hero on `/` — not a modal.

**Layout:** Two cards, existing `rounded-3xl`, `noise-bg`, organic palette:

| Card | Headline | Subcopy | Action |
|---|---|---|---|
| Guided | Show me the path | Role-based starter kit and essentials | `setMode('guided')` → `/starter-kit` |
| Explore | I know my way around | Curated picks and tools you might have missed | `setMode('explore')` → stay `/` |

**Skip:** "Decide later" link → `dismissFork()`, default `explore` for nav until explicit pick, fork hidden on return visits.

**After pick:** Fork hidden; sidebar toggle reflects choice. Toggle always overrides.

---

## Home Page Layouts

Shared: same hero copy and typography. Remove 6-tile bento `curatedSections` grid from both modes.

### Guided Home (`/` when mode unset shows fork; when set, redirect to `/starter-kit` is optional — recommend redirect so Start Here is canonical)

If Guided user lands on `/`:
- Short hero (existing h1 + one line)
- Horizontal role strip (8 roles, scroll on mobile) — links to `/starter-kit?role=…`
- **Start with these** — max 4 cards where `tier === 'essential'`
- Single CTA row → Documents (contract + invoice highlights)
- No recommendations block, no bento grid

### Explore Home (`/`)

- Same hero
- **Curator's Picks** — 3 hand-picked `tier === 'pro'` resources
- **Hidden Gems** — 4–6 `tier === 'hidden-gem'` resources
- **For you** — existing `useRecommendations` block (unchanged hook)
- No bento grid

---

## Hub Pages

### Documents (`/documents`)

Merge `Downloads.jsx` + Templates `ResourceHub` into one page.

- Data: `downloadsData` + `resourceData.filter(type === 'Templates')`
- Category pills: Contracts · Invoices · Templates · Checklists · All
- Reuse `DownloadCard` + `ResourceCard` in unified grid or normalized card wrapper
- Explore: surface `tier: hidden-gem` docs with subtle badge

### Essentials (`/essentials`) — Guided only

- Merged Learning + Tools
- Filter: `tier === 'essential'` OR unset tier (show in All only — editorial pass assigns tiers)
- No tier tabs; compact cards only
- Category filter bar retained (`CategoryFilter`)

### Resources (`/resources`) — Explore only

- Tabs: Learning | Tools | Gigs
- Tier tabs within each: Essentials | Pro Picks | All
- Full `ResourceCard` variant

### Scenarios

**Guided:** Hero + 3 pinned scenario slugs (config in `scenarioPosts` or navigation config) + "See all scenarios" link.

**Explore:** Current `ScenariosHub` with scroll panel — evaluate removal in Phase 2 if still noisy; lazy-load scroll panel (`bundle-conditional`).

---

## ResourceCard Variants

Single component, `variant` prop:

| Field | `compact` (Guided) | `full` (Explore, default) |
|---|---|---|
| Icon | yes | yes |
| Title | yes | yes |
| Description | 1 line (`line-clamp-1`) | full |
| Type badge | hidden | shown |
| Category line | hidden | shown |
| Tags | hidden | shown (max 2) |
| Link | yes | yes |

Extract static JSX wrappers where possible (`rendering-hoist-jsx`).

---

## Data Model Changes

### `resources.js`

Add optional field per entry:

```js
tier: 'essential' | 'pro' | 'hidden-gem'  // optional; omit = All only
```

Editorial task: tag ~15–20 items across tiers before launch. Ung tagged items appear in "All" only.

### `downloads.js`

Same optional `tier` field for document entries.

### `scenarioPosts.js`

Add optional `pinned: true` for Guided starter articles (exactly 3).

---

## File Plan

| File | Action |
|---|---|
| `src/context/BrowseModeContext.jsx` | **New** — provider |
| `src/hooks/useBrowseMode.js` | **New** — storage + redirect logic |
| `src/config/navigation.js` | **New** — mode nav config |
| `src/components/BrowseModeToggle.jsx` | **New** — sidebar toggle |
| `src/components/Sidebar.jsx` | **Edit** — consume nav config + toggle; remove inline `navItems` |
| `src/pages/Home.jsx` | **Edit** — mode branches; remove bento |
| `src/pages/Documents.jsx` | **New** — merged hub |
| `src/pages/Essentials.jsx` | **New** — guided hub |
| `src/pages/Resources.jsx` | **New** — explore hub |
| `src/pages/Community.jsx` | **New** — explore community hub |
| `src/pages/More.jsx` | **New** (optional) — guided secondary links |
| `src/components/ResourceCard.jsx` | **Edit** — `variant` prop |
| `src/App.js` | **Edit** — provider, new routes, legacy redirects |
| `src/data/resources.js` | **Edit** — add `tier` tags |
| `src/data/downloads.js` | **Edit** — add `tier` tags |
| `README.md` | **Edit** — routes table |

### Impact (from lean-ctx `ctx_graph impact`)

`Sidebar.jsx` changes affect: `App.js`, `App.test.js`, `index.js` (indirect). Plan test updates for mode toggle and redirects.

SymDex was unavailable in the authoring environment; route and symbol evidence gathered via lean-ctx (`ctx_search`, `ctx_graph`, `ctx_read`).

---

## Performance Notes (React Best Practices)

| Rule | Application |
|---|---|
| `client-localstorage-schema` | Versioned `kn-browse-mode` object |
| `rerender-lazy-state-init` | Lazy read localStorage in `useState` initializer |
| `rerender-transitions` | `startTransition` on mode switch nav swap |
| `rerender-derived-state` | Derive `navItems` from `mode` during render |
| `bundle-conditional` | Lazy-load Scenarios scroll panel (Explore only) |
| `js-cache-storage` | Cache mode in context after first read |
| `rendering-content-visibility` | Consider on long resource grids |

---

## Accessibility

- Mode toggle: `role="group"`, `aria-label`, `aria-pressed` per segment
- Focus order: toggle reachable via keyboard; visible focus ring (existing pattern)
- `prefers-reduced-motion`: respect for fork card animations (Framer `useReducedMotion`)
- Mobile drawer: toggle inside focus trap when open

---

## Testing

| Area | Test |
|---|---|
| `useBrowseMode` | localStorage read/write, v1 migration, fork dismiss |
| `BrowseModeToggle` | click switches mode, `aria-pressed` state |
| Legacy redirects | `/templates` → `/documents`, mode-aware `/learning` |
| `ResourceCard` | compact vs full renders correct fields |
| `App.test.js` | smoke with `BrowseModeProvider` wrapper |

---

## Phased Delivery

### Phase 1 (MVP)

- Browse mode context + toggle
- First-visit fork
- Navigation config + Sidebar refactor
- Documents merge + redirects
- Home mode branches
- ResourceCard `compact` variant
- Essential tier tags (minimum viable set)

### Phase 2

- Essentials + Resources hub pages
- Community + More pages
- Scenarios Guided simplification
- Full tier editorial pass
- 21st component install if search finds fit

---

## Open Questions (resolved)

| Question | Decision |
|---|---|
| Self-selection vs unified | Self-selection with sidebar toggle |
| Dropdown vs toggle | Segmented toggle at sidebar bottom |
| Typography/colors | Unchanged |
| Templates + Downloads | Merge to Documents |
| Approach | Dual-mode shell (Approach 1) |

---

## Success Criteria

- Guided sidebar shows ≤5 primary items
- User switches mode in ≤1 click from any page
- First-time visitor sees fork once, can change mind later
- Explore home surfaces tier-curated picks without bento clutter
- No broken old URLs (redirects work)
- Fraunces/Inter and organic/primary palette unchanged
