# Dual-Mode IA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce KreatorNest overwhelm via Guided/Explore browse modes — consolidated nav, tier-tagged resources, mode-aware home/hubs, reversible sidebar toggle — without changing Fraunces/Inter typography or organic/primary colors.

**Architecture:** `BrowseModeProvider` at `App.js` root holds versioned `localStorage` state (`kn-browse-mode` v1). Pure `navigation.js` config drives Sidebar nav per mode. Pages branch on `useBrowseMode().mode`. Legacy routes redirect via `LegacyRedirect`. Same data files; presentation filters by `tier`.

**Tech Stack:** React 18, React Router 6, Tailwind CSS, Framer Motion, Lucide, Jest + React Testing Library (CRA `react-scripts test`).

## Global Constraints

- Typography: Fraunces (display/headings), Inter (body) — do not change `tailwind.config.js` font families
- Colors: `organic-*`, `primary-*`, `surface` tokens only — no new palette
- Browse mode labels: `Guided` / `Explore` (not beginner/advanced)
- Sidebar: ≤5 primary nav items per mode
- `localStorage` key: `kn-browse-mode`, schema `{ v: 1, mode, forkDismissed, updatedAt }`
- Mode switch: segmented toggle at sidebar bottom (not dropdown)
- Mobile responsive on all new/changed pages
- React perf: lazy `useState` init for storage read, `startTransition` on mode switch, derive nav from mode at render time

---

## File Map

| File | Responsibility |
|------|----------------|
| `src/hooks/useBrowseMode.js` | Storage read/write, fork dismiss, route guard helper |
| `src/context/BrowseModeContext.jsx` | Provider + `useBrowseMode` export |
| `src/config/navigation.js` | Nav items, mode homes, route availability, more links |
| `src/components/BrowseModeToggle.jsx` | Segmented Guided/Explore control |
| `src/components/LegacyRedirect.jsx` | Mode-aware redirects for old URLs |
| `src/components/Sidebar.jsx` | Mode nav + toggle (remove inline `navItems`) |
| `src/components/ResourceCard.jsx` | `variant: 'full' \| 'compact'` |
| `src/pages/Home.jsx` | Fork + mode-specific home sections |
| `src/pages/Documents.jsx` | Merged templates + downloads |
| `src/pages/Essentials.jsx` | Guided Learning+Tools hub |
| `src/pages/Resources.jsx` | Explore tabbed hub |
| `src/pages/More.jsx` | Guided secondary links |
| `src/pages/Community.jsx` | Explore communities + contributors entry |
| `src/App.js` | Provider, routes, redirects |

---

### Task 1: Browse mode storage + context

**Files:**
- Create: `src/hooks/useBrowseMode.js`
- Create: `src/context/BrowseModeContext.jsx`
- Create: `src/hooks/useBrowseMode.test.js`

**Interfaces:**
- Produces: `BrowseModeProvider`, `useBrowseMode()` returning `{ mode, setMode, isModeSet, forkDismissed, dismissFork, effectiveMode }`
- `mode`: `'guided' | 'explore' | null`
- `effectiveMode`: `'guided' | 'explore'` — falls back to `'explore'` when unset but fork dismissed
- `setMode(nextMode, { navigate })` — persists + calls optional navigate callback

- [ ] **Step 1: Write failing tests**

```js
// src/hooks/useBrowseMode.test.js
import { renderHook, act } from '@testing-library/react';
import { BrowseModeProvider, useBrowseMode } from '../context/BrowseModeContext';

const STORAGE_KEY = 'kn-browse-mode';

const wrapper = ({ children }) => (
  <BrowseModeProvider>{children}</BrowseModeProvider>
);

beforeEach(() => {
  localStorage.clear();
});

test('starts with null mode when storage empty', () => {
  const { result } = renderHook(() => useBrowseMode(), { wrapper });
  expect(result.current.mode).toBeNull();
  expect(result.current.isModeSet).toBe(false);
});

test('setMode persists guided to localStorage', () => {
  const { result } = renderHook(() => useBrowseMode(), { wrapper });
  act(() => result.current.setMode('guided'));
  expect(result.current.mode).toBe('guided');
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
  expect(stored.v).toBe(1);
  expect(stored.mode).toBe('guided');
});

test('dismissFork sets forkDismissed without setting mode', () => {
  const { result } = renderHook(() => useBrowseMode(), { wrapper });
  act(() => result.current.dismissFork());
  expect(result.current.forkDismissed).toBe(true);
  expect(result.current.mode).toBeNull();
  expect(result.current.effectiveMode).toBe('explore');
});

test('ignores invalid storage version', () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 0, mode: 'guided' }));
  const { result } = renderHook(() => useBrowseMode(), { wrapper });
  expect(result.current.mode).toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --watchAll=false useBrowseMode.test.js`
Expected: FAIL — module not found

- [ ] **Step 3: Implement storage + context**

```js
// src/hooks/useBrowseMode.js
const STORAGE_KEY = 'kn-browse-mode';

export function readBrowseModeState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.v !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeBrowseModeState(partial) {
  const prev = readBrowseModeState() ?? { v: 1, forkDismissed: false };
  const next = {
    v: 1,
    mode: partial.mode ?? prev.mode ?? null,
    forkDismissed: partial.forkDismissed ?? prev.forkDismissed ?? false,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
```

```jsx
// src/context/BrowseModeContext.jsx
import { createContext, useCallback, useContext, useMemo, useState, startTransition } from 'react';
import { readBrowseModeState, writeBrowseModeState } from '../hooks/useBrowseMode';

const BrowseModeContext = createContext(null);

export function BrowseModeProvider({ children }) {
  const [state, setState] = useState(() => readBrowseModeState());

  const setMode = useCallback((mode, options = {}) => {
    const next = writeBrowseModeState({ mode });
    startTransition(() => setState(next));
    options.onAfterSet?.(mode);
  }, []);

  const dismissFork = useCallback(() => {
    const next = writeBrowseModeState({ forkDismissed: true });
    setState(next);
  }, []);

  const value = useMemo(() => {
    const mode = state?.mode ?? null;
    const forkDismissed = state?.forkDismissed ?? false;
    const effectiveMode = mode ?? (forkDismissed ? 'explore' : 'explore');
    return {
      mode,
      isModeSet: mode === 'guided' || mode === 'explore',
      forkDismissed,
      effectiveMode,
      setMode,
      dismissFork,
    };
  }, [state, setMode, dismissFork]);

  return (
    <BrowseModeContext.Provider value={value}>
      {children}
    </BrowseModeContext.Provider>
  );
}

export function useBrowseMode() {
  const ctx = useContext(BrowseModeContext);
  if (!ctx) throw new Error('useBrowseMode must be used within BrowseModeProvider');
  return ctx;
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- --watchAll=false useBrowseMode.test.js`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useBrowseMode.js src/context/BrowseModeContext.jsx src/hooks/useBrowseMode.test.js
git commit -m "feat(browse-mode): add versioned localStorage context"
```

---

### Task 2: Navigation config

**Files:**
- Create: `src/config/navigation.js`

**Interfaces:**
- Produces: `NAV_BY_MODE`, `MORE_LINKS_GUIDED`, `MODE_HOME`, `ROUTE_AVAILABILITY`, `getNavForMode(mode)`, `isRouteAvailable(path, mode)`

- [ ] **Step 1: Create navigation config**

```js
// src/config/navigation.js
export const MODE_HOME = {
  guided: '/starter-kit',
  explore: '/',
};

export const NAV_BY_MODE = {
  guided: [
    { path: '/starter-kit', label: 'Start Here', iconKey: 'Package' },
    { path: '/essentials', label: 'Essentials', iconKey: 'BookOpen' },
    { path: '/documents', label: 'Documents', iconKey: 'FolderDown' },
    { path: '/scenarios', label: 'Scenarios', iconKey: 'LayoutTemplate' },
    { path: '/more', label: 'More', iconKey: 'MoreHorizontal' },
  ],
  explore: [
    { path: '/', label: 'Discover', iconKey: 'Home' },
    { path: '/resources', label: 'Resources', iconKey: 'Wrench' },
    { path: '/documents', label: 'Documents', iconKey: 'FolderDown' },
    { path: '/scenarios', label: 'Scenarios', iconKey: 'LayoutTemplate' },
    { path: '/community', label: 'Community', iconKey: 'Users' },
  ],
};

export const MORE_LINKS_GUIDED = [
  { path: '/resources?tab=gigs', label: 'Gigs Boards', iconKey: 'Briefcase' },
  { path: '/community', label: 'Communities', iconKey: 'Users' },
  { path: '/contributors', label: 'Contributors', iconKey: 'UserCircle' },
  { path: '/feedback', label: 'Feedback', iconKey: 'MessageSquare' },
];

export const ROUTE_AVAILABILITY = {
  '/essentials': ['guided'],
  '/resources': ['explore'],
  '/community': ['explore'],
  '/more': ['guided'],
};

export function getNavForMode(mode) {
  return NAV_BY_MODE[mode] ?? NAV_BY_MODE.explore;
}

export function isRouteAvailable(pathname, mode) {
  const base = pathname.split('?')[0];
  const allowed = ROUTE_AVAILABILITY[base];
  if (!allowed) return true;
  return allowed.includes(mode);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/config/navigation.js
git commit -m "feat(nav): add mode-driven navigation config"
```

---

### Task 3: BrowseModeToggle component

**Files:**
- Create: `src/components/BrowseModeToggle.jsx`
- Create: `src/components/BrowseModeToggle.test.jsx`

**Interfaces:**
- Consumes: `useBrowseMode()`, `isDesktopOpen` prop for collapsed layout

- [ ] **Step 1: Write failing test**

```jsx
// src/components/BrowseModeToggle.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowseModeProvider } from '../context/BrowseModeContext';
import BrowseModeToggle from './BrowseModeToggle';

const renderToggle = (props = {}) =>
  render(
    <BrowseModeProvider>
      <BrowseModeToggle isDesktopOpen={true} {...props} />
    </BrowseModeProvider>
  );

test('renders Guided and Explore segments', () => {
  renderToggle();
  expect(screen.getByRole('button', { name: /guided/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /explore/i })).toBeInTheDocument();
});

test('clicking Guided sets aria-pressed', () => {
  renderToggle();
  fireEvent.click(screen.getByRole('button', { name: /guided/i }));
  expect(screen.getByRole('button', { name: /guided/i })).toHaveAttribute('aria-pressed', 'true');
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `npm test -- --watchAll=false BrowseModeToggle.test.js`

- [ ] **Step 3: Implement toggle**

```jsx
// src/components/BrowseModeToggle.jsx
import { Map, Compass } from 'lucide-react';
import { useBrowseMode } from '../context/BrowseModeContext';

export default function BrowseModeToggle({ isDesktopOpen = true }) {
  const { effectiveMode, setMode } = useBrowseMode();
  const current = effectiveMode;

  const handleSelect = (mode) => {
    if (mode !== current) setMode(mode);
  };

  if (!isDesktopOpen) {
    return (
      <div className="flex flex-col gap-1 px-2" role="group" aria-label="Browse mode">
        {[
          { mode: 'guided', Icon: Map, label: 'Guided' },
          { mode: 'explore', Icon: Compass, label: 'Explore' },
        ].map(({ mode, Icon, label }) => (
          <button
            key={mode}
            type="button"
            title={`Browse as: ${label}`}
            aria-pressed={current === mode}
            onClick={() => handleSelect(mode)}
            className={`w-10 h-10 mx-auto flex items-center justify-center rounded-xl transition-colors ${
              current === mode
                ? 'bg-white text-primary-700 shadow-sm border border-organic-stone'
                : 'text-organic-clay hover:bg-organic-stone/50'
            }`}
          >
            <Icon size={18} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="px-3">
      <p className="text-xs font-semibold text-organic-clay uppercase tracking-wider mb-2 px-1">
        Browse as
      </p>
      <div className="flex rounded-xl border border-organic-stone overflow-hidden" role="group" aria-label="Browse mode">
        {['guided', 'explore'].map((mode) => (
          <button
            key={mode}
            type="button"
            aria-pressed={current === mode}
            onClick={() => handleSelect(mode)}
            className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
              current === mode
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-organic-clay hover:bg-organic-stone/50'
            }`}
          >
            {mode === 'guided' ? 'Guided' : 'Explore'}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add src/components/BrowseModeToggle.jsx src/components/BrowseModeToggle.test.jsx
git commit -m "feat(ui): add sidebar BrowseModeToggle"
```

---

### Task 4: Wire provider + refactor Sidebar

**Files:**
- Modify: `src/App.js`
- Modify: `src/components/Sidebar.jsx`

**Interfaces:**
- Consumes: `getNavForMode(effectiveMode)`, `BrowseModeToggle`, `useBrowseMode`

- [ ] **Step 1: Wrap App with BrowseModeProvider**

In `src/App.js`, import `BrowseModeProvider` and wrap `<Router>` children:

```jsx
import { BrowseModeProvider } from './context/BrowseModeContext';

function App() {
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  return (
    <BrowseModeProvider>
      <Router>
        {/* existing shell */}
      </Router>
    </BrowseModeProvider>
  );
}
```

- [ ] **Step 2: Replace inline navItems in Sidebar**

Remove `const navItems = [...]` (lines 11–23). Import:

```jsx
import { getNavForMode } from '../config/navigation';
import { useBrowseMode } from '../context/BrowseModeContext';
import BrowseModeToggle from './BrowseModeToggle';
import * as LucideIcons from 'lucide-react'; // OR map iconKey via existing pattern
```

Inside `Sidebar`:

```jsx
const { effectiveMode, setMode } = useBrowseMode();
const navItems = getNavForMode(effectiveMode).map((item) => ({
  ...item,
  icon: LucideIcons[item.iconKey]
    ? React.createElement(LucideIcons[item.iconKey], { size: 20 })
    : null,
}));
```

**Prefer:** add `src/utils/navIcons.js` mapping `iconKey → component` (same icons as today) to avoid `import *` barrel (`bundle-barrel-imports`).

Insert `<BrowseModeToggle isDesktopOpen={isDesktopOpen} />` above Install App block in both mobile + desktop sidebars, wrapped in `mt-6 pt-5 border-t border-organic-stone`.

- [ ] **Step 3: Mode switch redirect**

In `BrowseModeToggle`, use `useNavigate` + `useLocation`:

```jsx
const navigate = useNavigate();
const location = useLocation();

const handleSelect = (mode) => {
  setMode(mode, {
    onAfterSet: () => {
      if (!isRouteAvailable(location.pathname, mode)) {
        navigate(MODE_HOME[mode], { replace: true });
      }
    },
  });
};
```

Move redirect logic into `setMode` in context OR keep in toggle — pick one place only.

- [ ] **Step 4: Run existing tests**

Run: `npm test -- --watchAll=false`
Expected: App smoke tests may need nav label updates (Home → Discover in explore default). Update assertions in Task 10.

- [ ] **Step 5: Commit**

```bash
git add src/App.js src/components/Sidebar.jsx src/utils/navIcons.js
git commit -m "feat(sidebar): mode-driven nav and browse toggle"
```

---

### Task 5: ResourceCard compact variant

**Files:**
- Modify: `src/components/ResourceCard.jsx`
- Modify: `src/components/ResourceCard.test.jsx`

- [ ] **Step 1: Add failing compact tests**

```js
it('compact variant hides type badge, category, and tags', () => {
  render(<ResourceCard resource={makeResource()} variant="compact" />);
  expect(screen.queryByText('Tools')).not.toBeInTheDocument();
  expect(screen.queryByText('UX/UI & Web Design')).not.toBeInTheDocument();
  expect(screen.queryByText('Tag A')).not.toBeInTheDocument();
});

it('compact variant still renders title and explore link', () => {
  render(<ResourceCard resource={makeResource()} variant="compact" />);
  expect(screen.getByText('Test Resource')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /explore/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Implement variant prop**

```jsx
const ResourceCard = ({ resource, onInteract, variant = 'full' }) => {
  const isCompact = variant === 'compact';
  // ...
  // Conditionally render type badge, category, tags only when !isCompact
  // Description: isCompact ? 'line-clamp-1' : existing
  // Card padding: isCompact ? 'rounded-2xl p-6 min-h-[200px]' : existing editorial styles
};
```

- [ ] **Step 3: Run tests — PASS**

- [ ] **Step 4: Commit**

```bash
git add src/components/ResourceCard.jsx src/components/ResourceCard.test.jsx
git commit -m "feat(cards): add ResourceCard compact variant for Guided mode"
```

---

### Task 6: Tier tags on data

**Files:**
- Modify: `src/data/resources.js`
- Modify: `src/data/downloads.js`
- Modify: `src/data/scenarioPosts.js`

- [ ] **Step 1: Tag minimum viable set (~18 items)**

Add `tier` to entries:

**essential (8):** one Learning + one Tools per top category used in Starter Kit; include Figma or equivalent, a contracts-related template resource.

**pro (3):** high-authority picks for Curator's Picks on Explore home.

**hidden-gem (6):** lesser-known tools/resources.

**downloads (2):** `freelance-contract` → `essential`, one invoice → `essential`.

**scenarioPosts:** set `pinned: true` on exactly 3 posts for Guided scenarios.

Example:

```js
{
  id: '...',
  title: '...',
  // existing fields
  tier: 'essential',
},
```

- [ ] **Step 2: Add helper**

```js
// src/utils/tierFilters.js
export function filterByTier(items, tier) {
  if (tier === 'all') return items;
  return items.filter((item) => item.tier === tier);
}

export function getTieredHomeSlice(items, tier, limit) {
  return items.filter((i) => i.tier === tier).slice(0, limit);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/data/resources.js src/data/downloads.js src/data/scenarioPosts.js src/utils/tierFilters.js
git commit -m "feat(data): add tier and pinned tags for mode curation"
```

---

### Task 7: Documents hub

**Files:**
- Create: `src/pages/Documents.jsx`
- Reuse: `DownloadCard` logic from `src/pages/Downloads.jsx` (extract to `src/components/DownloadCard.jsx` if needed)

- [ ] **Step 1: Create Documents page**

Merge `downloadsData` + `resourceData.filter(r => r.type === 'Templates')`.

Category pills: `All | Contracts | Invoices | Templates | Checklists` — map from `doc.category` / `resource.category`.

Use `ResourceCard variant="full"` for template resources, `DownloadCard` for downloads.

Explore mode: show subtle `Hidden gem` badge when `tier === 'hidden-gem'`.

- [ ] **Step 2: Manual smoke test**

Run: `npm start` → navigate `/documents` after route added in Task 8.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Documents.jsx src/components/DownloadCard.jsx
git commit -m "feat(pages): add merged Documents hub"
```

---

### Task 8: Routes + legacy redirects

**Files:**
- Create: `src/components/LegacyRedirect.jsx`
- Modify: `src/App.js`

- [ ] **Step 1: LegacyRedirect component**

```jsx
// src/components/LegacyRedirect.jsx
import { Navigate } from 'react-router-dom';
import { useBrowseMode } from '../context/BrowseModeContext';

const REDIRECTS = {
  '/templates': '/documents',
  '/downloads': '/documents',
  '/learning': (mode) => (mode === 'guided' ? '/essentials' : '/resources?tab=learning'),
  '/tools': (mode) => (mode === 'guided' ? '/essentials' : '/resources?tab=tools'),
  '/gigs': (mode) => (mode === 'guided' ? '/more' : '/resources?tab=gigs'),
  '/communities': (mode) => (mode === 'guided' ? '/more' : '/community'),
};

export default function LegacyRedirect({ from }) {
  const { effectiveMode } = useBrowseMode();
  const target = REDIRECTS[from];
  const to = typeof target === 'function' ? target(effectiveMode) : target;
  return <Navigate to={to} replace />;
}
```

- [ ] **Step 2: Register routes in App.js**

```jsx
<Route path="/documents" element={<Documents />} />
<Route path="/essentials" element={<Essentials />} />
<Route path="/resources" element={<Resources />} />
<Route path="/more" element={<More />} />
<Route path="/community" element={<Community />} />
<Route path="/templates" element={<LegacyRedirect from="/templates" />} />
<Route path="/downloads" element={<LegacyRedirect from="/downloads" />} />
<Route path="/learning" element={<LegacyRedirect from="/learning" />} />
<Route path="/tools" element={<LegacyRedirect from="/tools" />} />
<Route path="/gigs" element={<LegacyRedirect from="/gigs" />} />
<Route path="/communities" element={<LegacyRedirect from="/communities" />} />
```

Keep existing `ResourceHub` routes removed or redirected — do not leave duplicate hubs.

- [ ] **Step 3: Commit**

```bash
git add src/App.js src/components/LegacyRedirect.jsx
git commit -m "feat(routes): add new hubs and legacy redirects"
```

---

### Task 9: Home page — fork + mode layouts

**Files:**
- Modify: `src/pages/Home.jsx`
- Create: `src/components/BrowseModeFork.jsx`

- [ ] **Step 1: BrowseModeFork component**

Show when `!isModeSet && !forkDismissed`. Two cards + "Decide later" link calling `dismissFork()`.

Guided card: `setMode('guided')` + `navigate('/starter-kit')`.
Explore card: `setMode('explore')` + stay on `/`.

Use `useReducedMotion` from Framer Motion for animations.

- [ ] **Step 2: Refactor Home.jsx**

Remove `curatedSections` bento grid entirely.

```jsx
const { mode, isModeSet, forkDismissed, effectiveMode } = useBrowseMode();
const showFork = !isModeSet && !forkDismissed;

// Explore home (effectiveMode === 'explore' && isModeSet)
// - Curator's Picks: getTieredHomeSlice(resourceData, 'pro', 3)
// - Hidden Gems: getTieredHomeSlice(resourceData, 'hidden-gem', 6)
// - For you: existing recommendations block

// Guided home (effectiveMode === 'guided' && isModeSet)
// - Role strip linking to /starter-kit?role=...
// - Start with these: getTieredHomeSlice(..., 'essential', 4) with variant="compact"
// - CTA link to /documents

// Always: hero section unchanged
// If showFork: render BrowseModeFork below hero
```

Optional: `useEffect` redirect guided users from `/` to `/starter-kit` when `mode === 'guided'` — matches spec recommendation.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.jsx src/components/BrowseModeFork.jsx
git commit -m "feat(home): mode fork and curated sections replace bento"
```

---

### Task 10: Essentials + Resources hubs

**Files:**
- Create: `src/pages/Essentials.jsx`
- Create: `src/pages/Resources.jsx`

- [ ] **Step 1: Essentials.jsx (Guided)**

Filter `resourceData` where `type` is `Learning` or `Tools` AND `tier === 'essential'`.
`CategoryFilter` for categories within that set.
`ResourceCard variant="compact"`.

- [ ] **Step 2: Resources.jsx (Explore)**

URL search param `tab`: `learning | tools | gigs` (default `learning`).
Secondary tier tabs: `Essentials | Pro Picks | All`.
`ResourceCard variant="full"`.

```jsx
const [searchParams, setSearchParams] = useSearchParams();
const tab = searchParams.get('tab') ?? 'learning';
const [tierTab, setTierTab] = useState('all');
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Essentials.jsx src/pages/Resources.jsx
git commit -m "feat(hubs): add Essentials and Resources pages"
```

---

### Task 11: More + Community pages

**Files:**
- Create: `src/pages/More.jsx`
- Create: `src/pages/Community.jsx`

- [ ] **Step 1: More.jsx**

Render `MORE_LINKS_GUIDED` as link cards. Reuse sidebar link styling.

- [ ] **Step 2: Community.jsx**

Section 1: Communities — `ResourceHub` logic inline or reuse filter `type === 'Communities'`.
Section 2: CTA card linking to `/contributors`.
Footer link to `/feedback`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/More.jsx src/pages/Community.jsx
git commit -m "feat(pages): add More and Community hubs"
```

---

### Task 12: Scenarios Guided simplification

**Files:**
- Modify: `src/pages/ScenariosHub.jsx`

- [ ] **Step 1: Branch on browse mode**

```jsx
const { effectiveMode } = useBrowseMode();
const pinnedPosts = scenarioPosts.filter((p) => p.pinned);
```

**Guided:** hero + 3 pinned `BlogCard`s + `Link to="/scenarios?view=all"` — hide scroll panel and resource grid.

**Explore:** existing layout; wrap `VerticalScrollSlider` in:

```jsx
const ScrollPanel = React.lazy(() => import('../components/VerticalScrollSlider'));
// Suspense fallback={null} around explore-only panel
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/ScenariosHub.jsx
git commit -m "feat(scenarios): simplify Guided view, lazy-load Explore panel"
```

---

### Task 13: Tests + README

**Files:**
- Modify: `src/App.test.js`
- Create: `src/components/LegacyRedirect.test.jsx`
- Modify: `README.md`

- [ ] **Step 1: Update App.test.js**

```js
test('renders browse mode toggle', () => {
  render(<App />);
  expect(screen.getByRole('group', { name: /browse mode/i })).toBeInTheDocument();
});
```

Update sidebar nav test — explore default shows "Discover" not "Home".

- [ ] **Step 2: LegacyRedirect test**

```jsx
// Wrap with MemoryRouter + BrowseModeProvider
// Render route /templates, expect navigation to /documents
```

- [ ] **Step 3: Update README routes table**

Document new routes, redirects, Guided/Explore modes.

- [ ] **Step 4: Run full test suite**

Run: `npm test -- --watchAll=false`
Expected: all PASS

- [ ] **Step 5: Production build**

Run: `npm run build`
Expected: compiles without errors

- [ ] **Step 6: Commit**

```bash
git add src/App.test.js src/components/LegacyRedirect.test.jsx README.md
git commit -m "test: cover browse mode and redirects; update README"
```

---

## Spec Coverage Checklist

| Spec requirement | Task |
|------------------|------|
| Browse mode localStorage v1 | Task 1 |
| Context + hook API | Task 1 |
| navigation.js config | Task 2 |
| Sidebar toggle | Task 3–4 |
| ≤5 nav items per mode | Task 2–4 |
| First-visit fork | Task 9 |
| Guided/Explore home layouts | Task 9 |
| Documents merge | Task 7–8 |
| Legacy redirects | Task 8 |
| ResourceCard compact | Task 5 |
| tier tags | Task 6 |
| Essentials / Resources hubs | Task 10 |
| More / Community | Task 11 |
| Scenarios Guided simplification | Task 12 |
| Typography/colors unchanged | Global Constraints |
| Mobile responsive | All page tasks |
| React perf patterns | Tasks 1, 4, 12 |
| Accessibility on toggle | Task 3 |

## Self-Review Notes

- No TBD placeholders in task steps
- `effectiveMode` fallback consistent across redirect + nav
- Phase 1+2 combined in single plan; Tasks 1–9 are MVP shippable incrementally
- 21st registry search optional during Task 3 — custom toggle is default per spec

---

## Execution Handoff

Plan saved to `docs/superpowers/plans/2026-07-01-dual-mode-ia.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks
2. **Inline Execution** — implement task-by-task in this session with checkpoints

Which approach?
