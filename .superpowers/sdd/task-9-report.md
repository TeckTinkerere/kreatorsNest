# Task 9 Report — Home Fork + Mode Layouts

## Status
- Completed.

## Implemented
- Created `src/components/BrowseModeFork.jsx`:
  - Two first-visit cards (`Guided`, `Explore`) with inline actions.
  - Guided card calls `setMode('guided')` and navigates to `/starter-kit`.
  - Explore card calls `setMode('explore')` and stays on `/`.
  - Added `Decide later` link wired to `dismissFork()`.
  - Applied Framer Motion with `useReducedMotion`-aware hover behavior.
- Refactored `src/pages/Home.jsx`:
  - Removed the `curatedSections` bento grid entirely.
  - Added browse-mode branching from `useBrowseMode()` with:
    - `showFork` when `!isModeSet && !forkDismissed`
    - Guided layout (role strip, essential cards, `/documents` CTA)
    - Explore layout (Curator's Picks, Hidden Gems, existing recommendations block)
  - Integrated `getTieredHomeSlice` from `src/utils/tierFilters.js`:
    - `pro` x3 for Curator's Picks
    - `hidden-gem` x6 for Hidden Gems
    - `essential` x4 for Guided "Start with these" cards
  - Applied `useReducedMotion` to animation variants for accessibility.

## Verification
- Ran: `npm test -- --watchAll=false`
- Result: PASS (`6` suites, `41` tests).
- Existing React Router future-flag warnings and pre-existing `act(...)` warnings are still present in logs; no test failures.

## Commit
- `feat(home): mode fork and curated sections replace bento`
