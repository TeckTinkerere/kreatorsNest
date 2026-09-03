# SEO and GEO

Two audiences read this site without ever seeing it: search crawlers, and the
answer engines (ChatGPT, Claude, Perplexity, AI Overviews) that increasingly sit
between a person's question and any website. They need different things, and
KreatorNest now serves both.

**The one thing that mattered most:** the site was a client-rendered React app.
The HTML a crawler received was an empty `<div id="root">`. Googlebot renders
JavaScript and coped; GPTBot, ClaudeBot and PerplexityBot do not — they read raw
HTML and move on. The site was least visible in exactly the channel taking over
its category.

---

## Required setup

One variable turns all of this on:

```
REACT_APP_SITE_URL = https://your-real-domain.com
```

Set it in Netlify → Site configuration → Environment variables. Without it:

- **sitemap.xml is not generated** — a sitemap of wrong URLs is worse than none
- **prerendering is skipped** — it would otherwise bake `http://127.0.0.1`
  canonical URLs into every page

Both skip loudly in the build log rather than producing something broken.

### Netlify build command

Prerendering needs a headless browser. Set the build command to:

```sh
npx playwright install --with-deps chromium && npm run build
```

If you skip this, the build still succeeds — `npm run build` warns that
Playwright is missing and ships a client-rendered site, exactly as before. You
lose AI-crawler visibility, not the deploy.

---

## What runs at build time

`npm run build` now does three things:

| Step | Output |
|---|---|
| `react-scripts build` | The app bundle, as before |
| `scripts/generate-seo-files.mjs` | `robots.txt`, `llms.txt`, `sitemap.xml` |
| `scripts/prerender.mjs` | Static HTML for all 20 routes |

Run them individually with `npm run seo` and `npm run prerender` (the latter
takes `--verbose` to list each route and its size). `npm run build:fast` skips
both when you just want a quick bundle.

### Prerendering

The script serves the production build locally, visits every route in headless
Chromium, and writes the fully rendered HTML back as that route's `index.html`.
Netlify then serves real content on the first byte, and React takes over on load.

Three details that matter:

- **The content sheet and analytics are blocked during prerendering**, so
  snapshots reflect the content committed in `src/data/` rather than whatever
  the live sheet held at build time. Both resume normally in the real browser.
- **Each page is scrolled before capture**, so content that animates in on
  scroll is captured in its revealed state. Elements still parked at
  `opacity: 0` have that stripped — hidden text is the wrong signal for content
  you want cited.
- **A route that fails to prerender is a warning, never a failed build.** It
  simply stays client-rendered.

### llms.txt

A plain-text site map written for language models, listing the templates and
guides with one-line descriptions. The convention is young and no engine
guarantees it is read — it costs one static file, so it is worth having and not
worth relying on. The real work is the prerendered HTML and the JSON-LD.

---

## Structured data

`src/utils/structuredData.js` builds the JSON-LD, and pages pass it to `<SEO>`
via the `schema` prop.

| Page | Schema | Why |
|---|---|---|
| Home | `Organization` + `WebSite` | Establishes the entity every other page references |
| Scenario article | `Article` + `BreadcrumbList` | The pages most likely to be quoted in an answer |
| Resources, Essentials, Scenarios hub | `CollectionPage` + `ItemList` | Lists the actual entries, so the page can be cited for *what* it recommends |

The `Article` graph carries the full flattened `articleBody`, so an engine
reading only the JSON-LD still gets the whole text rather than an excerpt.

Every builder returns `null` when there is not enough data to make a truthful
claim — an incomplete graph asserts things that are not there, which is worse
than no graph.

Validate changes with the [Rich Results Test](https://search.google.com/test/rich-results)
and [Schema Markup Validator](https://validator.schema.org/).

---

## robots.txt

Generated at build. Every AI crawler is named and allowed explicitly — GPTBot,
ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot and the
rest. They are already covered by the wildcard; naming them documents that the
permission is a decision rather than an oversight, and makes revoking one a
one-line edit if that ever becomes the call.

---

## Content that gets cited

Structure is most of it, and it is the part that is now yours rather than the
build's. Answer engines quote passages that stand alone:

- **Open each section with a direct two-to-three sentence answer**, then expand.
  A section that builds to its point gets skipped for one that leads with it.
- **Attach a number, a date, or a source to every claim.** "The Small Claims
  Tribunal handles disputes up to SGD 20,000" is citable; "you can take them to
  small claims" is not.
- **Keep the Singapore specificity explicit.** PayNow, IRAS, ACRA, the Small
  Claims Tribunal — these are why an engine would pick your page over a generic
  US template site, and they only work if the words are actually on the page.
- **Use real headings.** Every `##` in a scenario body becomes an `<h2>`, which
  is what lets an engine extract one section as an answer.

---

## Checking it worked

After the first deploy with `REACT_APP_SITE_URL` set:

```sh
# The test that matters — content in raw HTML, with no JavaScript run at all
curl -s https://your-domain.com/scenarios/pricing-your-first-freelance-project | grep -c "articleBody"

# Should list 20 URLs
curl -s https://your-domain.com/sitemap.xml | grep -c "<loc>"

curl -s https://your-domain.com/llms.txt | head
```

If the first command returns 0, prerendering did not run — check the build log
for the Playwright or `REACT_APP_SITE_URL` warning.

Then submit the sitemap in Google Search Console. Expect weeks, not days.

**One honest caveat.** All of this makes the site *findable and quotable*. It
does not create demand. For a directory of curated links competing against AI
answers that need no click, strong SEO raises a low ceiling. The pages worth
this effort are the paperwork and the scenario writing, where someone is looking
for a document to use rather than a fact to learn.
