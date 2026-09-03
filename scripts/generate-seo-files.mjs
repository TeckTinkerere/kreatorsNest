/**
 * generate-seo-files
 *
 * Writes sitemap.xml, robots.txt and llms.txt into the build output.
 *
 * All three need the site's real public origin, which only the deployment
 * knows, so they are generated at build time from REACT_APP_SITE_URL rather
 * than committed with a guessed domain. With no origin configured the sitemap
 * is skipped entirely — a sitemap full of wrong URLs is worse than none.
 *
 *   node scripts/generate-seo-files.mjs [--build-dir build]
 */
import { writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, '..');

const args = process.argv.slice(2);
const buildDirArg = args.indexOf('--build-dir');
const BUILD_DIR = resolve(projectRoot, buildDirArg !== -1 ? args[buildDirArg + 1] : 'build');

const SITE_URL = (process.env.REACT_APP_SITE_URL || '').trim().replace(/\/$/, '');

/**
 * Static routes with their crawl priorities.
 *
 * Priorities encode what the site is actually for: the paperwork and the
 * scenario writing are the pages worth ranking and citing; the hubs are entry
 * points; the feedback form is neither.
 */
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/documents', priority: '0.9', changefreq: 'weekly' },
  { path: '/scenarios', priority: '0.9', changefreq: 'weekly' },
  { path: '/essentials', priority: '0.8', changefreq: 'weekly' },
  { path: '/resources', priority: '0.8', changefreq: 'weekly' },
  { path: '/starter-kit', priority: '0.7', changefreq: 'monthly' },
  { path: '/community', priority: '0.6', changefreq: 'monthly' },
  { path: '/contributors', priority: '0.5', changefreq: 'monthly' },
  { path: '/more', priority: '0.4', changefreq: 'monthly' },
  { path: '/feedback', priority: '0.3', changefreq: 'yearly' },
];

/** Escape the five XML entities. Titles and slugs come from an editable sheet. */
const xmlEscape = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/**
 * Convert a human date like "March 12, 2026" to ISO, or null if unparseable.
 *
 * @param {string} value - Date text.
 * @returns {string|null}
 */
function isoDate(value) {
  const parsed = new Date(String(value ?? '').trim());
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

/**
 * Build sitemap.xml from static routes plus every scenario article.
 *
 * @param {object[]} posts - Scenario posts.
 * @returns {string} Sitemap XML.
 */
function buildSitemap(posts) {
  const today = new Date().toISOString().slice(0, 10);

  const entries = [
    ...STATIC_ROUTES.map((route) => ({
      loc: `${SITE_URL}${route.path}`,
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
    })),
    ...posts.map((post) => ({
      loc: `${SITE_URL}/scenarios/${post.slug}`,
      lastmod: isoDate(post.date) || today,
      changefreq: 'yearly',
      priority: post.pinned ? '0.8' : '0.7',
    })),
  ];

  const body = entries
    .map(({ loc, lastmod, changefreq, priority }) =>
      [
        '  <url>',
        `    <loc>${xmlEscape(loc)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n')
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

/**
 * Build robots.txt.
 *
 * Every AI crawler is named and allowed explicitly. They are already allowed by
 * the wildcard, but naming them is the documented signal that the omission is a
 * decision rather than an oversight — and it makes revoking one a one-line edit
 * if that ever becomes the call.
 *
 * @returns {string} robots.txt contents.
 */
function buildRobots() {
  const aiCrawlers = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-User',
    'Claude-SearchBot',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot-Extended',
    'CCBot',
    'Bytespider',
    'meta-externalagent',
  ];

  const lines = [
    '# KreatorNest',
    '# Content here exists to be found and cited. Everything is open to crawlers,',
    '# including the AI crawlers named below.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# AI and answer-engine crawlers, allowed deliberately rather than by default.',
    ...aiCrawlers.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
  ];

  if (SITE_URL) {
    lines.push(`Sitemap: ${SITE_URL}/sitemap.xml`);
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

/**
 * Build llms.txt — a plain-text map of the site for language models.
 *
 * The convention is young and no engine guarantees it is read. It costs one
 * static file, so it is worth having; it is not worth relying on. The real work
 * is the prerendered HTML and the JSON-LD.
 *
 * @param {object[]} posts - Scenario posts.
 * @param {object[]} downloads - Template documents.
 * @returns {string} llms.txt contents.
 */
function buildLlmsTxt(posts, downloads) {
  const base = SITE_URL || '';

  const section = (title, items) =>
    items.length === 0 ? '' : `\n## ${title}\n\n${items.join('\n')}\n`;

  return `# KreatorNest

> Curated tools, document templates, and practical guidance for early-career
> creative freelancers in Singapore. Independently run; free to use.

KreatorNest covers two things: business paperwork that Singapore creative
freelancers actually need (contracts, invoices, scopes of work, proposals), and
curated learning, tools, and gig-platform links across visual communication,
motion graphics, UX/UI, 3D, photography, and video.

Documents reference Singapore conventions specifically — PayNow payment
details, IRAS obligations, and the Small Claims Tribunal for disputes — which is
what distinguishes them from generic US or UK templates.
${section('Key pages', [
  `- [Documents](${base}/documents): Contracts, invoices, proposals, briefs, and checklists, free to download.`,
  `- [Scenarios](${base}/scenarios): Field guides on pricing, chasing payment, scope creep, and client management.`,
  `- [Essentials](${base}/essentials): The foundational learning material and tools to start with.`,
  `- [Resources](${base}/resources): The full curated index of learning, tools, and gig platforms.`,
])}${section('Templates', downloads.map(
  (doc) => `- ${doc.title}: ${doc.description}`
))}${section('Guides', posts.map(
  (post) => `- [${post.title}](${base}/scenarios/${post.slug}): ${post.excerpt}`
))}
## Notes

- Content is maintained in a public spreadsheet and updated continuously.
- Templates are practical documents, not legal advice.
`;
}

async function main() {
  if (!existsSync(BUILD_DIR)) {
    console.error(`seo-files: no build found at ${BUILD_DIR} — run the build first.`);
    process.exit(1);
  }

  const [{ scenarioPosts }, { downloadsData }] = await Promise.all([
    import(new URL('../src/data/scenarioPosts.js', import.meta.url).href),
    import(new URL('../src/data/downloads.js', import.meta.url).href),
  ]);

  await writeFile(join(BUILD_DIR, 'robots.txt'), buildRobots(), 'utf8');
  await writeFile(join(BUILD_DIR, 'llms.txt'), buildLlmsTxt(scenarioPosts, downloadsData), 'utf8');
  console.log('seo-files: robots.txt, llms.txt written');

  if (!SITE_URL) {
    console.warn(
      'seo-files: REACT_APP_SITE_URL is not set — sitemap.xml skipped.\n' +
      '           Set it to the public origin (e.g. https://kreatornest.com) to generate one.'
    );
    return;
  }

  await writeFile(join(BUILD_DIR, 'sitemap.xml'), buildSitemap(scenarioPosts), 'utf8');
  console.log(`seo-files: sitemap.xml written with ${STATIC_ROUTES.length + scenarioPosts.length} URLs`);
}

main().catch((error) => {
  console.error('seo-files: failed —', error.message);
  process.exit(1);
});
