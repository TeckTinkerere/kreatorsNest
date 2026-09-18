/**
 * Analytics
 *
 * Thin wrapper around Umami. Two things matter here:
 *
 * 1. It is entirely optional. With no REACT_APP_UMAMI_WEBSITE_ID configured,
 *    the script is never loaded and every track call is a no-op, so local
 *    development and forks stay clean.
 * 2. It never throws. Analytics failing must not break a download button.
 *
 * Umami's tracker watches the History API, so route changes in this SPA are
 * recorded automatically — only the custom events below need calling.
 */

/** Umami site id. Empty means analytics are disabled for this build. */
const WEBSITE_ID = (process.env.REACT_APP_UMAMI_WEBSITE_ID || '').trim();

/** Tracker script URL. Override only when self-hosting Umami. */
const SCRIPT_URL = (
  process.env.REACT_APP_UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js'
).trim();

/** Guards against a second injection under React StrictMode double-mounting. */
let injected = false;

/**
 * Whether analytics are configured for this build.
 *
 * @returns {boolean}
 */
export function isAnalyticsEnabled() {
  return WEBSITE_ID !== '';
}

/**
 * Inject the Umami tracker once, if configured.
 * Safe to call repeatedly and safe to call before the DOM is ready.
 */
export function initAnalytics() {
  if (!isAnalyticsEnabled() || injected) return;
  if (typeof document === 'undefined') return;

  injected = true;

  const script = document.createElement('script');
  script.src = SCRIPT_URL;
  script.async = true;
  script.defer = true;
  script.setAttribute('data-website-id', WEBSITE_ID);
  document.head.appendChild(script);
}

/**
 * Record a custom event.
 *
 * Silently does nothing when analytics are disabled or the tracker has not
 * loaded yet (blocked, offline, or still in flight) — a dropped event is
 * always preferable to a broken interaction.
 *
 * @param {string} name - Event name, e.g. 'template-download'.
 * @param {Object<string, string|number|boolean>} [data] - Event properties.
 */
export function trackEvent(name, data) {
  if (!isAnalyticsEnabled() || !name) return;

  try {
    const umami = typeof window !== 'undefined' ? window.umami : undefined;
    if (!umami || typeof umami.track !== 'function') return;
    umami.track(name, data);
  } catch {
    // Never let a measurement failure surface to the user.
  }
}

/**
 * Event names, kept in one place so the dashboard and the code cannot drift.
 *
 * These are chosen to answer one question: which half of the site is actually
 * used — the curated links, or the paperwork?
 */
export const EVENTS = {
  /** A template document was downloaded. The primary success metric. */
  TEMPLATE_DOWNLOAD: 'template-download',
  /** An outbound curated resource link was opened. */
  RESOURCE_CLICK: 'resource-click',
  /** A scenario article was opened. */
  ARTICLE_READ: 'article-read',
  /** A visitor picked Guided or Explore at the first-visit fork. */
  MODE_SELECT: 'mode-select',
  /** A visitor opened the suggest-a-resource form. */
  SUGGEST_OPEN: 'suggest-open',
};
