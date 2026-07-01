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
└── data/
    ├── contributors.json    # Contributor profiles (editable)
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

### Add a contributor

Edit `src/data/contributors.json` and add an entry:

```json
{
  "id": "4",
  "name": "Your Name",
  "avatar": "",
  "bio": "Short bio about what you do.",
  "contributions": ["Contribution title"],
  "socials": {
    "youtube": "https://youtube.com/@handle",
    "instagram": "https://instagram.com/handle"
  }
}
```

### Add a resource

Edit `src/data/resources.js` and add an entry to `resourceData`:

```js
{
  id: "l12",
  title: "Resource Title",
  description: "Short description.",
  type: "Learning",  // "Learning" | "Tools" | "Templates" | "Gigs" | "Communities"
  category: "Visual Communication",
  link: "https://example.com",
  icon: "BookOpen",
  tags: ["Tag1", "Tag2"],
}
```

### Add a scenario blog article

Edit `src/data/scenarioPosts.js` and add an entry. Each post needs:
- `id`, `slug`, `title`, `excerpt`, `author`, `date`, `readTime`, `category`, `tags`
- `content` array with `{ type: "paragraph" | "heading" | "tip", text: "..." }` blocks

## Available Scripts

```sh
npm start       # Development server on port 3000
npm run build   # Production build to /build
npm test        # Run test suite
```

## Tech Stack

- **React 18** — `create-react-app`
- **Tailwind CSS 3** — custom `organic` color palette
- **Framer Motion** — page transitions, hover animations
- **Lucide React** — icons
- **Radix UI** — Slider primitive (blog panel scrollbar)
- **React Router 6** — client-side routing
- **IndexedDB** — recommendation tracking (local)

## Deployment

```sh
npm run build
# Deploy the /build folder to any static host (Vercel, Netlify, Cloudflare Pages)
```
