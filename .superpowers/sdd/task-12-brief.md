### Task 12: Scenarios Guided simplification

Modify `src/pages/ScenariosHub.jsx`:
- Branch on `effectiveMode` from `useBrowseMode`
- Guided mode: keep hero + show 3 pinned `BlogCard`s + add `Link to="/scenarios?view=all"`
- Explore mode: keep existing filter + blog panel + resource grid layout
- Lazy-load explore scroll panel with `React.lazy` + `Suspense` around `VerticalScrollSlider`

Commit: `feat(scenarios): simplify Guided view and lazy-load Explore slider`
