/**
 * Site identity.
 *
 * The public origin is needed in three places that must agree: canonical URLs
 * and Open Graph tags in the browser, JSON-LD `@id` values, and the build-time
 * sitemap and prerenderer. It lives here so there is one answer.
 *
 * The default is the production domain, so a plain `npm run build` produces
 * correct canonicals and a usable sitemap with no configuration. Override with
 * REACT_APP_SITE_URL when deploying the same code somewhere else.
 *
 * This module is imported both by the app (where CRA inlines process.env at
 * build time) and by the Node scripts in scripts/, so it stays free of JSX and
 * of anything browser-specific.
 */

/** Production origin for KreatorNest. */
export const DEFAULT_SITE_URL = 'https://kreatornest.mohdaslam.dev';

/** The configured public origin, without a trailing slash. */
export const SITE_URL = (process.env.REACT_APP_SITE_URL || DEFAULT_SITE_URL)
  .trim()
  .replace(/\/$/, '');
