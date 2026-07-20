### Task 4: Wire provider + refactor Sidebar

**Files:**
- Modify: `src/App.js` — wrap with BrowseModeProvider
- Modify: `src/components/Sidebar.jsx` — remove inline navItems, use getNavForMode + BrowseModeToggle
- Create: `src/utils/navIcons.js` — iconKey → Lucide component map (NO import * lucide)

**Critical:**
- Import nav from `src/config/navigation.js`
- Insert BrowseModeToggle above Install App (mobile + desktop)
- Mode switch: useNavigate + isRouteAvailable + MODE_HOME redirect in toggle OR context onAfterSet
- Read current Sidebar.jsx navItems (lines 11-23) for icon mapping reference

Commit: `feat(sidebar): mode-driven nav and browse toggle`

Run: `npm test -- --watchAll=false` — fix App.test.js if nav labels change (Home may become Discover)
