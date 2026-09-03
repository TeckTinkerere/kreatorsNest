/**
 * JSON-LD structured data builders.
 *
 * Generative engines lean on schema.org to work out what a page *is* — who
 * wrote it, when, what it lists, which organisation stands behind it. Prose
 * alone leaves that to inference; JSON-LD states it, which is what makes a page
 * quotable rather than merely readable.
 *
 * Every builder returns a plain object or null. Null means "not enough data to
 * make a truthful claim" — an incomplete graph is worse than none, because it
 * asserts things that are not there.
 */

/** Public site origin. Falls back to the running origin in the browser. */
export function siteOrigin() {
  const configured = (process.env.REACT_APP_SITE_URL || '').trim().replace(/\/$/, '');
  if (configured) return configured;
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

/**
 * Build an absolute URL for a site path.
 *
 * @param {string} path - Site-relative path, e.g. '/scenarios/pricing'.
 * @returns {string} Absolute URL.
 */
export function absoluteUrl(path = '/') {
  return `${siteOrigin()}${path}`;
}

/** Publisher identity, reused across every graph so the entity stays consistent. */
export function organization() {
  return {
    '@type': 'Organization',
    '@id': `${siteOrigin()}/#organization`,
    name: 'KreatorNest',
    url: siteOrigin() || undefined,
    description:
      'Curated tools, templates, and practical guidance for early-career creative freelancers in Singapore.',
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logomain.png'),
    },
    areaServed: {
      '@type': 'Country',
      name: 'Singapore',
    },
  };
}

/**
 * Site-level graph for the home page: the organisation plus the WebSite itself.
 *
 * @returns {object} JSON-LD graph.
 */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization(),
      {
        '@type': 'WebSite',
        '@id': `${siteOrigin()}/#website`,
        url: siteOrigin() || undefined,
        name: 'KreatorNest',
        description:
          'A creative freelance resource hub — curated tools, templates, learning material, job boards, and scenario-based guidance for independent creatives.',
        publisher: { '@id': `${siteOrigin()}/#organization` },
        inLanguage: 'en-SG',
      },
    ],
  };
}

/**
 * Article graph for a scenario post.
 *
 * The article body is flattened into `articleBody` so an engine reading only
 * the JSON-LD still gets the full text rather than an excerpt.
 *
 * @param {object} post - Scenario post.
 * @param {string} path - Site path the article is served at.
 * @returns {object|null} JSON-LD graph, or null when the post is unusable.
 */
export function articleSchema(post, path) {
  if (!post || !post.title) return null;

  const body = (post.content || [])
    .map((block) => block.text)
    .filter(Boolean)
    .join('\n\n');

  const published = parseDate(post.date);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || undefined,
    articleBody: body || undefined,
    articleSection: post.category || undefined,
    keywords: (post.tags || []).join(', ') || undefined,
    datePublished: published || undefined,
    dateModified: published || undefined,
    author: {
      '@type': post.author === 'Kreator Editorial' ? 'Organization' : 'Person',
      name: post.author || 'Kreator Editorial',
    },
    publisher: organization(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(path),
    },
    inLanguage: 'en-SG',
  };
}

/**
 * CollectionPage + ItemList graph for a hub of resources.
 *
 * Listing the actual entries is what lets an engine answer "what tools does
 * KreatorNest recommend for motion graphics" by citing this page, rather than
 * knowing only that a page exists.
 *
 * @param {object} options
 * @param {string} options.name - Page name.
 * @param {string} options.description - Page description.
 * @param {string} options.path - Site path.
 * @param {object[]} options.items - Resource entries.
 * @param {number} [options.limit=50] - Maximum entries to include.
 * @returns {object|null} JSON-LD graph, or null when there is nothing to list.
 */
export function collectionSchema({ name, description, path, items, limit = 50 }) {
  const listed = (items || []).filter((item) => item && item.title).slice(0, limit);
  if (listed.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { '@id': `${siteOrigin()}/#website` },
    inLanguage: 'en-SG',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: listed.length,
      itemListElement: listed.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        description: item.description || undefined,
        url: item.link || undefined,
      })),
    },
  };
}

/**
 * BreadcrumbList graph.
 *
 * @param {{name: string, path: string}[]} trail - Crumbs, root first.
 * @returns {object|null} JSON-LD graph, or null for a trail too short to matter.
 */
export function breadcrumbSchema(trail) {
  if (!Array.isArray(trail) || trail.length < 2) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/**
 * Convert a human-written date like "March 12, 2026" to ISO 8601.
 * Returns null rather than an invalid date, so a bad cell in the content sheet
 * simply omits the field instead of publishing a broken one.
 *
 * @param {string} value - Date text from the content sheet.
 * @returns {string|null} ISO date (YYYY-MM-DD), or null.
 */
export function parseDate(value) {
  const text = String(value ?? '').trim();
  if (!text) return null;

  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toISOString().slice(0, 10);
}
