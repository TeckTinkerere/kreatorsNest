/**
 * Remote content loader.
 *
 * KreatorNest is a static site, so content lives in a public Google Sheet and
 * is fetched at runtime. The bundled data in src/data/ stays in the build as a
 * seed: it renders instantly on first paint, keeps the PWA working offline, and
 * is what the app falls back to whenever the sheet is unreachable or invalid.
 *
 * Loading order on a page view:
 *   1. bundled seed (synchronous, always available)
 *   2. localStorage cache from a previous visit, if still fresh
 *   3. live sheet fetch, which updates the cache for next time
 */
import { parseCsvToObjects } from './csv';
import { SHEET_TABS, mapRows } from './schema';

/** Spreadsheet ID, set at build time. Empty means "bundled data only". */
export const SHEET_ID = (process.env.REACT_APP_CONTENT_SHEET_ID || '').trim();

/** localStorage key holding the last successful sheet payload. */
const CACHE_KEY = 'kreatornest:content:v1';

/** How long a cached payload is served before a refetch is attempted. */
const CACHE_TTL_MS = 30 * 60 * 1000;

/** Abort a sheet request that stalls, so a slow network never blocks content. */
const FETCH_TIMEOUT_MS = 8000;

/**
 * Build the CSV export URL for one tab of the spreadsheet.
 * The gviz endpoint serves CORS-enabled CSV for any sheet shared as
 * "Anyone with the link — Viewer", with no API key.
 *
 * @param {string} tab - Sheet tab name.
 * @returns {string} CSV endpoint URL.
 */
export function sheetCsvUrl(tab) {
  return `https://docs.google.com/spreadsheets/d/${encodeURIComponent(SHEET_ID)}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
}

/**
 * Whether remote content is configured for this build.
 *
 * @returns {boolean}
 */
export function isRemoteConfigured() {
  return SHEET_ID !== '';
}

/**
 * Fetch and map a single sheet tab.
 *
 * @param {string} dataset - One of the SHEET_TABS keys.
 * @param {AbortSignal} signal - Abort signal for the request.
 * @returns {Promise<object[]|null>} Mapped entries, or null on any failure.
 */
async function loadTab(dataset, signal) {
  try {
    const response = await fetch(sheetCsvUrl(SHEET_TABS[dataset]), {
      signal,
      // The sheet is public; sending credentials would only trip CORS.
      credentials: 'omit',
    });
    if (!response.ok) return null;

    const text = await response.text();
    // A sheet that is private (or a tab that was renamed) answers with an HTML
    // sign-in page rather than an error status, so reject non-CSV bodies.
    if (/^\s*</.test(text)) return null;

    const entries = mapRows(dataset, parseCsvToObjects(text));
    // An empty tab is far more likely to be a mistake than an intentional wipe,
    // so treat it as a failure and keep whatever the app already has.
    return entries.length > 0 ? entries : null;
  } catch {
    return null;
  }
}

/**
 * Read the cached sheet payload written by a previous visit.
 *
 * @returns {{data: object, fetchedAt: number}|null} Cache entry, or null.
 */
export function readCache() {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || typeof parsed.fetchedAt !== 'number') {
      return null;
    }
    return parsed;
  } catch {
    // Private browsing, disabled storage, or corrupt JSON — cache is optional.
    return null;
  }
}

/**
 * Whether a cache entry is young enough to serve without refetching.
 *
 * @param {{fetchedAt: number}|null} cache - Cache entry.
 * @returns {boolean}
 */
export function isCacheFresh(cache) {
  if (!cache) return false;
  const age = Date.now() - cache.fetchedAt;
  return age >= 0 && age < CACHE_TTL_MS;
}

/**
 * Persist a sheet payload for the next visit. Failures are ignored.
 *
 * @param {object} data - Mapped datasets to cache.
 */
function writeCache(data) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ data, fetchedAt: Date.now() }));
  } catch {
    // Quota or disabled storage — the app works fine without a cache.
  }
}

/**
 * Fetch every configured tab and return only the datasets that loaded cleanly.
 * Tabs are independent: a broken `scenarios` tab does not discard a good
 * `resources` tab, it just leaves scenarios on the previous data.
 *
 * @returns {Promise<object|null>} Partial dataset map, or null if nothing loaded.
 */
export async function fetchRemoteContent() {
  if (!isRemoteConfigured() || typeof fetch !== 'function') return null;

  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS) : null;

  try {
    const datasets = Object.keys(SHEET_TABS);
    const results = await Promise.all(
      datasets.map((dataset) => loadTab(dataset, controller ? controller.signal : undefined))
    );

    const loaded = {};
    datasets.forEach((dataset, index) => {
      if (results[index]) loaded[dataset] = results[index];
    });

    if (Object.keys(loaded).length === 0) return null;

    writeCache(loaded);
    return loaded;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
