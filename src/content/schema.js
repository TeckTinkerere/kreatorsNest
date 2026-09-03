/**
 * Row schemas for the KreatorNest content spreadsheet.
 *
 * Each dataset maps one sheet tab to the object shape the app already renders.
 * Every mapper is defensive: a malformed or half-finished row is dropped rather
 * than allowed to crash a page, because the sheet is edited by hand and can be
 * saved mid-edit at any moment.
 */

/** Sheet tab names, in the order the app loads them. */
export const SHEET_TABS = {
  resources: 'resources',
  downloads: 'downloads',
  scenarios: 'scenarios',
  contributors: 'contributors',
};

/** Social platforms Contributors.jsx knows how to render. */
const SOCIAL_PLATFORMS = ['youtube', 'instagram', 'twitter', 'tiktok', 'linkedin'];

/**
 * Split a delimited cell into a trimmed list.
 * Accepts pipes or commas so editors can use whichever reads better.
 *
 * @param {string} value - Raw cell value.
 * @returns {string[]} Non-empty trimmed entries.
 */
export function splitList(value) {
  return String(value ?? '')
    .split(/[|,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/**
 * Interpret a spreadsheet cell as a boolean.
 * Blank means false; TRUE/yes/y/1/x all mean true (Sheets checkboxes emit TRUE).
 *
 * @param {string} value - Raw cell value.
 * @returns {boolean}
 */
export function toBoolean(value) {
  const token = String(value ?? '').trim().toLowerCase();
  return token === 'true' || token === 'yes' || token === 'y' || token === '1' || token === 'x';
}

/**
 * Whether a row is published. A missing `published` column means published,
 * so adding the column later is not a breaking change.
 *
 * @param {Object<string, string>} row - Parsed sheet row.
 * @returns {boolean}
 */
function isPublished(row) {
  if (!('published' in row)) return true;
  const raw = String(row.published ?? '').trim();
  if (raw === '') return true;
  return toBoolean(raw);
}

/**
 * Reject links that are not plain http(s) URLs.
 * Sheet content is external input, so a `javascript:` or `data:` href must
 * never reach an anchor tag.
 *
 * @param {string} value - Raw cell value.
 * @returns {string} A safe URL, or '' when the value is unusable.
 */
export function safeUrl(value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return '';
  try {
    // A bare "example.com" is not a valid URL on its own; assume https.
    const candidate = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return url.href;
  } catch {
    return '';
  }
}

/**
 * Keep a site-relative path, rejecting anything that could escape the origin.
 *
 * @param {string} value - Raw cell value.
 * @returns {string} A leading-slash path, or '' when unusable.
 */
export function safePath(value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return '';
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return '';
  return trimmed;
}

/**
 * Parse a scenario body written in the sheet's lightweight block syntax.
 *
 * The spreadsheet holds one multi-line cell instead of nested JSON:
 *   `## Heading text`  -> heading block
 *   `> Tip text`       -> tip block
 *   anything else      -> paragraph block
 *
 * @param {string} body - Raw multi-line cell value.
 * @returns {{type: string, text: string}[]} Renderable content blocks.
 */
export function parseScenarioBody(body) {
  return String(body ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith('##')) {
        return { type: 'heading', text: line.replace(/^#+\s*/, '').trim() };
      }
      if (line.startsWith('>')) {
        return { type: 'tip', text: line.replace(/^>\s*/, '').trim() };
      }
      return { type: 'paragraph', text: line };
    })
    .filter((block) => block.text !== '');
}

/**
 * Serialise content blocks back into the sheet's block syntax.
 * Used by the CSV export script to seed the spreadsheet from bundled data.
 *
 * @param {{type: string, text: string}[]} blocks - Content blocks.
 * @returns {string} Multi-line body cell.
 */
export function serialiseScenarioBody(blocks) {
  return (blocks || [])
    .map((block) => {
      if (block.type === 'heading') return `## ${block.text}`;
      if (block.type === 'tip') return `> ${block.text}`;
      return block.text;
    })
    .join('\n\n');
}

/**
 * Map a `resources` row to a resource entry.
 *
 * @param {Object<string, string>} row - Parsed sheet row.
 * @returns {object|null} Resource entry, or null when the row is unusable.
 */
function toResource(row) {
  const title = String(row.title ?? '').trim();
  const link = safeUrl(row.link);
  const type = String(row.type ?? '').trim();
  if (!title || !link || !type) return null;

  const entry = {
    id: String(row.id ?? '').trim() || `res-${title.toLowerCase().replace(/\W+/g, '-')}`,
    title,
    description: String(row.description ?? '').trim(),
    type,
    category: String(row.category ?? '').trim(),
    link,
    icon: String(row.icon ?? '').trim(),
    tags: splitList(row.tags),
  };

  const tier = String(row.tier ?? '').trim();
  if (tier) entry.tier = tier;

  return entry;
}

/**
 * Map a `downloads` row to a template-document entry.
 *
 * @param {Object<string, string>} row - Parsed sheet row.
 * @returns {object|null} Download entry, or null when the row is unusable.
 */
function toDownload(row) {
  const title = String(row.title ?? '').trim();
  const txtFile = safePath(row.txtfile);
  if (!title || !txtFile) return null;

  const entry = {
    id: String(row.id ?? '').trim() || `dl-${title.toLowerCase().replace(/\W+/g, '-')}`,
    title,
    description: String(row.description ?? '').trim(),
    category: String(row.category ?? '').trim(),
    tags: splitList(row.tags),
    txtFile,
    featured: toBoolean(row.featured),
    icon: String(row.icon ?? '').trim(),
  };

  const tier = String(row.tier ?? '').trim();
  if (tier) entry.tier = tier;

  return entry;
}

/**
 * Map a `scenarios` row to a blog-style article.
 *
 * @param {Object<string, string>} row - Parsed sheet row.
 * @returns {object|null} Scenario post, or null when the row is unusable.
 */
function toScenario(row) {
  const title = String(row.title ?? '').trim();
  const slug = String(row.slug ?? '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
  const content = parseScenarioBody(row.body);
  if (!title || !slug || content.length === 0) return null;

  return {
    id: String(row.id ?? '').trim() || `blog-${slug}`,
    slug,
    title,
    excerpt: String(row.excerpt ?? '').trim(),
    author: String(row.author ?? '').trim() || 'Kreator Editorial',
    date: String(row.date ?? '').trim(),
    readTime: String(row.readtime ?? '').trim(),
    pinned: toBoolean(row.pinned),
    category: String(row.category ?? '').trim(),
    tags: splitList(row.tags),
    content,
  };
}

/**
 * Map a `contributors` row to a contributor profile.
 * Social columns are one per platform so the sheet stays flat and editable.
 *
 * @param {Object<string, string>} row - Parsed sheet row.
 * @returns {object|null} Contributor profile, or null when the row is unusable.
 */
function toContributor(row) {
  const name = String(row.name ?? '').trim();
  if (!name) return null;

  const socials = {};
  SOCIAL_PLATFORMS.forEach((platform) => {
    const url = safeUrl(row[platform]);
    if (url) socials[platform] = url;
  });

  return {
    id: String(row.id ?? '').trim() || name.toLowerCase().replace(/\W+/g, '-'),
    name,
    avatar: safeUrl(row.avatar),
    bio: String(row.bio ?? '').trim(),
    contributions: splitList(row.contributions),
    socials,
  };
}

/** Per-dataset row mappers, keyed by sheet tab name. */
const MAPPERS = {
  resources: toResource,
  downloads: toDownload,
  scenarios: toScenario,
  contributors: toContributor,
};

/**
 * Convert parsed sheet rows into renderable entries for one dataset.
 * Unpublished and malformed rows are dropped.
 *
 * @param {string} dataset - One of the SHEET_TABS keys.
 * @param {Object<string, string>[]} rows - Parsed sheet rows.
 * @returns {object[]} Valid entries.
 */
export function mapRows(dataset, rows) {
  const mapper = MAPPERS[dataset];
  if (!mapper) return [];

  return rows
    .filter(isPublished)
    .map(mapper)
    .filter(Boolean);
}
