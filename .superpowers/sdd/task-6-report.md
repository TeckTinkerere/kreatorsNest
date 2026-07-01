# Task 6 Report — Tier tags on data

## Status

**DONE**

## Commit

`feat(data): add tier and pinned tags for mode curation`

## Tests

**Command:** `npm test -- --watchAll=false`

**Result:** PASS (5 suites, 39 tests)

## Files changed (Task 6)

- `src/data/resources.js` — added `tier` tags to 17 real entries (`essential`, `pro`, `hidden-gem`)
- `src/data/downloads.js` — added `tier: "essential"` to 2 key docs
- `src/data/scenarioPosts.js` — added `pinned: true` on exactly 3 posts
- `src/utils/tierFilters.js` — added `filterByTier(items, tier)` and `getTieredHomeSlice(items, tier, limit)`
- `.superpowers/sdd/task-6-report.md` — task status and verification notes

## Tagged entries

**Resources — essential (8):**
- `l1` Typography & Layout Fundamentals
- `l3` After Effects Beginner Guide
- `l5` Figma Auto Layout Guide
- `t1` Figma
- `t2` Blender
- `t5` Wave (Invoicing)
- `temp1` Freelance Contract Template
- `temp2` Invoice Template

**Resources — pro (3):**
- `l7` School of Motion: Path to MoGraph
- `l8` Refactoring UI
- `t6` Adobe Illustrator

**Resources — hidden-gem (6):**
- `t7` Cavalry
- `t10` Rive
- `t13` Storyboarder
- `t14` Sun Surveyor
- `temp7` 3-Point Lighting Setup (Blender)
- `c5` Motion Hatch

**Downloads — essential (2):**
- `dl-1` Freelance Services Agreement
- `dl-5` Invoice Template

**Scenario posts — pinned (3):**
- `blog-1` How I Handled a Client Who Refused to Pay
- `blog-2` Pricing Your First Freelance Project Without Underselling Yourself
- `blog-4` Managing Scope Creep Like a Pro
