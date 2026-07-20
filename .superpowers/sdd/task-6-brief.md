### Task 6: Tier tags on data

Modify:
- `src/data/resources.js` — add `tier: 'essential'|'pro'|'hidden-gem'` to ~17 entries
- `src/data/downloads.js` — tier on key docs
- `src/data/scenarioPosts.js` — `pinned: true` on exactly 3 posts
- Create: `src/utils/tierFilters.js` — filterByTier, getTieredHomeSlice

Read existing resource titles in data files to pick sensible tags. Minimum counts per plan:
- essential: 8 resources
- pro: 3
- hidden-gem: 6
- downloads: 2 essential
- scenarioPosts: 3 pinned

Commit: `feat(data): add tier and pinned tags for mode curation`
