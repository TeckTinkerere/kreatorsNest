# Task 11 Report — More + Community pages

## Status

**DONE**

## Scope Delivered

| File | Outcome |
|------|---------|
| `src/pages/More.jsx` | Replaced stub with guided link card grid sourced from `MORE_LINKS_GUIDED` |
| `src/pages/Community.jsx` | Replaced stub with Communities resource grid, contributors CTA, and feedback footer link |

## Implementation Notes

### More page

- Uses `MORE_LINKS_GUIDED` from `src/config/navigation.js` as the single source of links.
- Renders card-style internal links with nav icons from `NAV_ICONS`.
- Applies existing organic/primary styling language and responsive layout (1 column mobile, 2 columns desktop).

### Community page

- Filters `resourceData` by `type === 'Communities'`.
- Derives category pills from live data and reuses `CategoryFilter` + animated grid pattern from `ResourceHub`.
- Uses `ResourceCard` (`variant="full"`) and tracks interactions via `useRecommendations`.
- Adds dedicated contributors CTA (`/contributors`) and footer feedback link (`/feedback`).

## Validation

**Command:** `npm test -- --watchAll=false`

**Result:** PASS (6 suites, 41 tests)

Notes:
- Existing React Router future-flag warnings and act warnings were printed during tests.
- No failing tests or linter errors introduced by Task 11 changes.
