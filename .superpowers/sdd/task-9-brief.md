### Task 9: Home fork + mode layouts

Create `src/components/BrowseModeFork.jsx`
Refactor `src/pages/Home.jsx`:
- Remove curatedSections bento grid
- Show fork when !isModeSet && !forkDismissed
- Explore home: Curator's Picks (pro x3), Hidden Gems (hidden-gem x6), recommendations block
- Guided home when mode set: role strip, essential cards compact x4, CTA to /documents
- Use getTieredHomeSlice from tierFilters.js

Commit: `feat(home): mode fork and curated sections replace bento`
