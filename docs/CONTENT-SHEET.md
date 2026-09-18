# Editing content from a Google Sheet

KreatorNest is a static site, but its content no longer lives only in the
repository. All four content sets — resources, downloads, scenario articles, and
contributors — are read from a public Google Sheet at runtime.

**Adding a resource is now: type a row, save the sheet, refresh the site.**
No commit, no rebuild, no deploy.

---

## How it works

```
src/data/*.js  ──►  bundled into the build  ──►  renders instantly, works offline
                                                        │
Google Sheet   ──►  CSV fetch on page load  ────────────┘  replaces it when it arrives
```

Three layers, in order:

1. **Bundled data** (`src/data/`) renders on first paint and is what visitors see
   offline, or if the sheet is ever unreachable. It is never removed.
2. **A cached copy** of the last sheet read (localStorage, 30-minute lifetime) so
   repeat visits do not flicker or wait on the network.
3. **The live sheet**, fetched in the background and cached for next time.

Nothing about this can take the site down. If the sheet is deleted, made private,
renamed, emptied, or malformed, every one of those cases falls back to the
bundled data and the site keeps working.

---

## One-time setup

### 1. Generate the starting CSVs

```sh
node scripts/export-content-csv.mjs
```

This writes four files into `content-csv/` containing everything currently in
`src/data/`. The folder is git-ignored — it is scratch output, not source.

### 2. Create the spreadsheet

1. Create a new Google Sheet named e.g. **KreatorNest Content**.
2. Create four tabs, named exactly (lowercase):
   `resources`, `downloads`, `scenarios`, `contributors`.
3. For each tab: **File → Import → Upload** the matching CSV, choosing
   **Replace current sheet** and **Detect automatically** for the separator.

### 3. Share it publicly

**Share → General access → Anyone with the link → Viewer.**

This is required. The site reads the sheet with no API key and no login, so an
unshared sheet is simply invisible to it. Only give **Editor** access to people
who should be able to change the live site — an editor of this sheet can publish
to the site without touching the repository.

### 4. Point the site at it

Copy the sheet ID out of its URL:

```
https://docs.google.com/spreadsheets/d/1AbC...XyZ/edit
                                      └──── this part ────┘
```

Set it as an environment variable on your host (Netlify: **Site configuration →
Environment variables**; Vercel: **Settings → Environment Variables**):

```
REACT_APP_CONTENT_SHEET_ID = 1AbC...XyZ
```

Locally, copy `.env.example` to `.env.local` and fill in the same value.

Redeploy once. That is the last deploy you need for a content change.

---

## Column reference

Header names are matched case- and space-insensitively, so `Read Time`,
`readTime`, and `read_time` are all the same column. Column *order* does not
matter. Extra columns you add for your own notes are ignored.

### `resources`

| Column | Required | Notes |
|---|---|---|
| `id` | – | Unique string. Auto-generated from the title if blank. |
| `title` | **yes** | Row is skipped without it. |
| `description` | – | One or two sentences shown on the card. |
| `type` | **yes** | `Learning`, `Tools`, `Templates`, `Gigs`, `Communities`, or `Scenarios`. Drives which page it appears on. |
| `category` | – | e.g. `Photography`. New values automatically appear in the filter bar. |
| `link` | **yes** | Must be `http://` or `https://`. A bare `example.com` is upgraded to `https://`. |
| `icon` | – | A Lucide icon name already in `src/utils/iconMap.js`. Unknown names just render without an icon. |
| `tags` | – | Pipe- or comma-separated: `Typography \| Layout \| Basics`. |
| `tier` | – | `essential`, `pro`, or `hidden-gem`. Controls the Home page rows and the Essentials page. |
| `published` | – | `FALSE` hides the row. Blank or missing means published. |

### `downloads`

| Column | Required | Notes |
|---|---|---|
| `id`, `title`, `description`, `category`, `tags`, `icon`, `tier`, `published` | | As above. `icon` here is an emoji, not a Lucide name. |
| `txtFile` | **yes** | Site-relative path like `/downloads/invoice-template.txt`. External URLs are rejected. **The file itself still has to be committed** to `public/downloads/`. |
| `featured` | – | `TRUE` puts it in the featured row. |

### `scenarios`

| Column | Required | Notes |
|---|---|---|
| `slug` | **yes** | URL segment: `/scenarios/<slug>`. Changing it breaks existing links. |
| `title` | **yes** | |
| `excerpt` | – | Shown in listings. |
| `author`, `date`, `readTime` | – | Displayed as metadata. `date` is free text, e.g. `March 12, 2026`. |
| `pinned` | – | `TRUE` features it at the top of the Scenarios hub. |
| `category`, `tags`, `published` | – | As above. |
| `body` | **yes** | The article itself — see below. |

**Writing a `body` cell.** Use `Alt`+`Enter` (Windows) or `⌥`+`Enter` (Mac) for a
line break inside the cell. One line per block:

```
Most beginners price too low out of fear.

## Start From Your Costs

Add up your monthly expenses, then divide by billable hours.

> Never quote a number in the first meeting. Ask for the budget first.
```

- A line starting `##` becomes a **heading**
- A line starting `>` becomes a **tip box**
- Everything else becomes a **paragraph**

Blank lines are ignored, so space blocks out however reads best.

### `contributors`

| Column | Required | Notes |
|---|---|---|
| `name` | **yes** | |
| `avatar` | – | Full image URL. |
| `bio` | – | One line. |
| `contributions` | – | Pipe-separated list. |
| `youtube`, `instagram`, `twitter`, `tiktok`, `linkedin` | – | One full profile URL per column. Blank columns are skipped. Anything that is not a valid URL is dropped. |
| `published` | – | As above. |

---

## Behaviour worth knowing

**Changes take up to 30 minutes to appear.** That is the cache lifetime. A hard
refresh in a private window shows the change immediately, which is the fastest way
to check your edit landed.

**An empty tab is treated as a mistake, not a deletion.** If you clear the
`resources` tab, the site keeps showing the previous resources rather than
rendering an empty page. To actually remove an entry, delete its row or set
`published` to `FALSE` — leave at least one row in every tab.

**Tabs fail independently.** A broken `scenarios` tab does not affect `resources`.

**Bad rows are skipped silently, not rendered broken.** A row missing a required
column, or with a `link` that is not a real http(s) URL, is dropped. If something
you added is not showing up, check the required columns above first.

**Links are validated for safety.** The sheet is treated as untrusted input:
`javascript:` and `data:` URLs are rejected, and `txtFile` cannot point off-site.
This matters because sheet editors can publish to the live site.

---

## Keeping the bundled fallback current

The committed data in `src/data/` is the offline fallback, so it drifts from the
sheet over time. That is fine — it only shows to offline visitors and only until
the fetch succeeds. Refresh it whenever it feels too stale by exporting the sheet
tabs back to CSV and updating `src/data/`, then commit as normal.

## Turning the sheet off

Unset `REACT_APP_CONTENT_SHEET_ID` and redeploy. The site runs entirely on the
committed data, exactly as it did before.
