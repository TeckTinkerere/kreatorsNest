/**
 * export-content-csv
 *
 * Writes the bundled content in src/data/ out as four CSV files, one per tab of
 * the KreatorNest content spreadsheet. Run it once to seed a new sheet:
 *
 *   node scripts/export-content-csv.mjs
 *   # then File > Import > Upload each CSV into its own tab in Google Sheets
 *
 * Re-run it any time you want to reset the sheet back to what is committed.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, '..');
const outDir = resolve(projectRoot, 'content-csv');

/**
 * Load an ES module from src/data/ without a build step.
 *
 * @param {string} file - File name under src/data/.
 * @returns {Promise<object>} Module namespace.
 */
function loadData(file) {
  return import(new URL(`../src/data/${file}`, import.meta.url).href);
}

/**
 * Quote a single CSV field per RFC 4180.
 *
 * @param {*} value - Cell value.
 * @returns {string} Escaped field.
 */
function csvField(value) {
  const text = value === undefined || value === null ? '' : String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

/**
 * Render a header row plus data rows as CSV text.
 *
 * @param {string[]} headers - Column names.
 * @param {Array<Array<*>>} rows - Row values, aligned to headers.
 * @returns {string} CSV document.
 */
function toCsv(headers, rows) {
  return [headers, ...rows].map((row) => row.map(csvField).join(',')).join('\n') + '\n';
}

/** Join a list into the pipe-delimited form the sheet schema expects. */
const list = (values) => (values || []).join(' | ');

/** Render a boolean as a Sheets-friendly TRUE/FALSE. */
const bool = (value) => (value ? 'TRUE' : 'FALSE');

/**
 * Serialise scenario content blocks into the sheet's block syntax.
 * Kept in sync with serialiseScenarioBody in src/content/schema.js — duplicated
 * here so this script stays runnable by plain Node without JSX transforms.
 *
 * @param {{type: string, text: string}[]} blocks - Content blocks.
 * @returns {string} Multi-line body cell.
 */
function serialiseBody(blocks) {
  return (blocks || [])
    .map((block) => {
      if (block.type === 'heading') return `## ${block.text}`;
      if (block.type === 'tip') return `> ${block.text}`;
      return block.text;
    })
    .join('\n\n');
}

const [{ resourceData }, { downloadsData }, { scenarioPosts }] = await Promise.all([
  loadData('resources.js'),
  loadData('downloads.js'),
  loadData('scenarioPosts.js'),
]);

const { default: contributors } = await import(
  new URL('../src/data/contributors.json', import.meta.url).href,
  { with: { type: 'json' } }
);

/** Row counts for the log line — CSV bodies contain newlines, so lines != rows. */
const counts = {
  'resources.csv': resourceData.length,
  'downloads.csv': downloadsData.length,
  'scenarios.csv': scenarioPosts.length,
  'contributors.csv': contributors.length,
};

const files = {
  'resources.csv': toCsv(
    ['id', 'title', 'description', 'type', 'category', 'link', 'icon', 'tags', 'tier', 'published'],
    resourceData.map((r) => [
      r.id, r.title, r.description, r.type, r.category, r.link, r.icon, list(r.tags), r.tier ?? '', 'TRUE',
    ])
  ),

  'downloads.csv': toCsv(
    ['id', 'title', 'description', 'category', 'tags', 'txtFile', 'featured', 'icon', 'tier', 'published'],
    downloadsData.map((d) => [
      d.id, d.title, d.description, d.category, list(d.tags), d.txtFile, bool(d.featured), d.icon, d.tier ?? '', 'TRUE',
    ])
  ),

  'scenarios.csv': toCsv(
    ['id', 'slug', 'title', 'excerpt', 'author', 'date', 'readTime', 'pinned', 'category', 'tags', 'body', 'published'],
    scenarioPosts.map((p) => [
      p.id, p.slug, p.title, p.excerpt, p.author, p.date, p.readTime, bool(p.pinned),
      p.category, list(p.tags), serialiseBody(p.content), 'TRUE',
    ])
  ),

  'contributors.csv': toCsv(
    ['id', 'name', 'avatar', 'bio', 'contributions', 'youtube', 'instagram', 'twitter', 'tiktok', 'linkedin', 'published'],
    contributors.map((c) => [
      c.id, c.name, c.avatar, c.bio, list(c.contributions),
      c.socials?.youtube ?? '', c.socials?.instagram ?? '', c.socials?.twitter ?? '',
      c.socials?.tiktok ?? '', c.socials?.linkedin ?? '', 'TRUE',
    ])
  ),
};

mkdirSync(outDir, { recursive: true });
for (const [name, contents] of Object.entries(files)) {
  writeFileSync(resolve(outDir, name), contents, 'utf8');
  console.log(`${name.padEnd(20)} ${counts[name]} rows`);
}
console.log(`\nWrote ${Object.keys(files).length} files to ${outDir}`);
