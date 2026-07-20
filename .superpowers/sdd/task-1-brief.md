### Task 1: Browse mode storage + context

**Files:**
- Create: `src/hooks/useBrowseMode.js`
- Create: `src/context/BrowseModeContext.jsx`
- Create: `src/hooks/useBrowseMode.test.js`

**Interfaces:**
- Produces: `BrowseModeProvider`, `useBrowseMode()` returning `{ mode, setMode, isModeSet, forkDismissed, dismissFork, effectiveMode }`
- `mode`: `'guided' | 'explore' | null`
- `effectiveMode`: `'guided' | 'explore'` — falls back to `'explore'` when unset but fork dismissed
- `setMode(nextMode, options)` — persists + calls optional `options.onAfterSet?.(mode)` callback

- [ ] **Step 1: Write failing tests** (see plan for full test code)

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --watchAll=false useBrowseMode.test.js`
Expected: FAIL — module not found

- [ ] **Step 3: Implement storage + context** (see plan for full implementation)

- [ ] **Step 4: Run tests**

Run: `npm test -- --watchAll=false useBrowseMode.test.js`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useBrowseMode.js src/context/BrowseModeContext.jsx src/hooks/useBrowseMode.test.js
git commit -m "feat(browse-mode): add versioned localStorage context"
```
