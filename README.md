# KreatorNest

A creative freelance resource hub — curated tools, templates, learning material, job boards, community links, and scenario-based articles for early-career independent creatives.

Built with React 18, Tailwind CSS, Framer Motion, and Lucide icons.

---

## Project Structure

```
src/
├── App.js                  # Root component with routing
├── index.js                # Entry point
├── components/             # Reusable UI components
│   ├── CategoryFilter.jsx   # Pill-style category filter bar
│   ├── carousel.jsx         # Freelancer challenge advice carousel
│   ├── ResourceCard.jsx     # Card for displaying a resource
│   ├── ScrollToTop.js       # Scrolls to top on route change
│   ├── SEO.jsx              # Sets document title & OG meta tags
│   ├── Sidebar.jsx          # Mobile + desktop sidebar navigation
│   └── VerticalScrollSlider.jsx  # Custom vertical scrollbar for blog panel
├── pages/                  # Route-level page components
│   ├── Caricature.jsx       # Caricature resource hub (legacy)
│   ├── Contributors.jsx     # Contributors directory with search, filters, social sharing
│   ├── FeaturedFreelancers.jsx  # Featured freelancer cards (legacy / WIP)
│   ├── Feedback.jsx         # Google Form feedback embed
│   ├── GraphicDesign.jsx    # Graphic design resource hub (legacy)
│   ├── Home.jsx             # Landing page with hero, recommendations, bento grid
│   ├── Photography.jsx      # Photography resource hub (legacy)
│   ├── ResourceHub.jsx      # Generic hub (Learning, Tools, Templates, Gigs, Communities)
│   ├── ScenarioArticle.jsx  # Individual scenario blog article
│   ├── ScenariosHub.jsx     # Scenario listings with blog panel + pagination
│   ├── StarterKit.jsx       # Role-based starter kit journey
│   └── Videography.jsx      # Videography resource hub (legacy)
├── hooks/
│   ├── usePagination.js     # Pagination range logic with ellipsis
│   └── useRecommendations.js # IndexedDB-backed recommendation engine
├── config/
│   ├── contribute.js        # Peer contribution (suggest form) config
│   └── navigation.js        # Sidebar/nav definitions
├── content/                # Sheet-backed content layer
│   ├── ContentContext.jsx   # Provides all content via useContent()
│   ├── csv.js               # RFC 4180 CSV parser
│   ├── remote.js            # Google Sheets fetch, cache, and fallback
│   └── schema.js            # Sheet row -> app object mapping + validation
└── data/                   # Bundled fallback copy (offline + first paint)
    ├── contributors.json    # Contributor profiles
    ├── downloads.js         # Template documents
    ├── resources.js         # All curated resource entries + categories
    └── scenarioPosts.js     # Scenario blog article content
```

## Routes

### Primary routes

| Path | Page | Mode | Description |
|---|---|---|---|
| `/` | Home | Explore (default) | Discover view with curated picks and recommendations |
| `/starter-kit` | StarterKit | Guided + Explore | Role-based onboarding pathfinder |
| `/essentials` | Essentials | Guided | Guided hub for essential learning + tools |
| `/resources` | Resources | Explore | Explore hub with tabbed learning/tools/gigs |
| `/documents` | Documents | Guided + Explore | Unified templates + downloads hub |
| `/more` | More | Guided | Guided secondary links (gigs, communities, contributors, feedback) |
| `/community` | Community | Explore | Communities and contributors directory access |
| `/scenarios` | ScenariosHub | Guided + Explore | Scenario listings (guided simplified, explore full) |
| `/scenarios/:slug` | ScenarioArticle | Guided + Explore | Individual scenario article |
| `/contributors` | Contributors | Guided + Explore | Contributor directory |
| `/feedback` | Feedback | Guided + Explore | Google Form feedback widget |

### Legacy redirects

| Legacy path | Redirect target |
|---|---|
| `/templates` | `/documents` |
| `/downloads` | `/documents` |
| `/learning` | `/essentials` (guided) or `/resources?tab=learning` (explore) |
| `/tools` | `/essentials` (guided) or `/resources?tab=tools` (explore) |
| `/gigs` | `/more` (guided) or `/resources?tab=gigs` (explore) |
| `/communities` | `/more` (guided) or `/community` (explore) |

## Adding Content

**Content is edited in a Google Sheet, not in this repository.** Add a row, save,
and it appears on the site within 30 minutes — no commit, no rebuild, no deploy.

See **[docs/CONTENT-SHEET.md](docs/CONTENT-SHEET.md)** for the one-time setup,
the full column reference for all four tabs, and the article body syntax.

The files in `src/data/` remain in the build as the offline/fallback copy: they
render on first paint, keep the PWA working without a network, and are what the
site falls back to if the sheet is ever unreachable, private, empty, or malformed.
Editing them directly still works, it just requires a deploy.

One exception: template **files** (`public/downloads/*.txt`) still have to be
committed. The sheet controls the card describing a download; the file it points
at is served from this repo.

### Let peers contribute

Two routes, neither needing GitHub: give trusted peers **Editor** access to the
sheet so their rows go live directly, or point
`REACT_APP_SUGGEST_FORM_URL` at a Google Form so anyone can submit a resource for
review. Setup for both is in **[docs/CONTRIBUTING-PEERS.md](docs/CONTRIBUTING-PEERS.md)**.

## Available Scripts

```sh
npm start       # Development server on port 3000
npm run build   # Production build to /build
npm test        # Run test suite

node scripts/export-content-csv.mjs   # Export src/data/ as CSVs to seed the sheet
```

## Tech Stack

- **React 18** — `create-react-app`
- **Tailwind CSS 3** — custom `organic` color palette
- **Framer Motion** — page transitions, hover animations
- **Lucide React** — icons
- **Radix UI** — Slider primitive (blog panel scrollbar)
- **React Router 6** — client-side routing
- **IndexedDB** — recommendation tracking (local)
- **Google Sheets** — runtime content source (CSV export, no API key)
- **Umami** — privacy-friendly, cookie-free analytics (optional)

## Deployment

```sh
npm run build
# Deploy the /build folder to any static host (Vercel, Netlify, Cloudflare Pages)
```

Set the environment variables from `.env.example` in the host's dashboard:

| Variable | Effect if unset |
|---|---|
| `REACT_APP_CONTENT_SHEET_ID` | Site runs entirely on the data committed in `src/data/` |
| `REACT_APP_UMAMI_WEBSITE_ID` | No analytics script is loaded at all |
| `REACT_APP_SUGGEST_FORM_URL` | "Add a resource" entry points do not render |

Every one of them is optional, and the site is fully functional with none of them
set.
