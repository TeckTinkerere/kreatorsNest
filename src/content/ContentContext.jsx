/**
 * ContentContext
 * Single source of truth for every piece of editable site content.
 *
 * Pages read content through `useContent()` instead of importing from
 * src/data/ directly. That indirection is what lets the spreadsheet replace the
 * bundled data at runtime without any page needing to know where content
 * came from.
 */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { resourceData, CATEGORIES } from '../data/resources';
import { downloadsData, DOWNLOAD_CATEGORIES } from '../data/downloads';
import { scenarioPosts } from '../data/scenarioPosts';
import contributorsSeed from '../data/contributors.json';
import { fetchRemoteContent, isRemoteConfigured, isCacheFresh, readCache } from './remote';

/** Content shipped in the bundle — the always-available baseline. */
const SEED = {
  resources: resourceData,
  downloads: downloadsData,
  scenarios: scenarioPosts,
  contributors: contributorsSeed,
};

/** Stable fallback value for consumers rendered outside a ContentProvider. */
const BUNDLED_VALUE = {
  ...SEED,
  categories: CATEGORIES,
  downloadCategories: DOWNLOAD_CATEGORIES,
  source: 'bundled',
};

const ContentContext = createContext(null);

/**
 * Derive the category filter list from whatever resources are loaded, so a new
 * category added in the spreadsheet shows up in the filter bar automatically.
 *
 * @param {object[]} resources - Loaded resource entries.
 * @returns {string[]} Category names, "All" first.
 */
function deriveCategories(resources) {
  const seen = new Set();
  resources.forEach((resource) => {
    if (resource.category) seen.add(resource.category);
  });

  // Keep the curated order from the bundled list, then append anything new.
  const ordered = CATEGORIES.filter((category) => category === 'All' || seen.has(category));
  const extras = [...seen].filter((category) => !CATEGORIES.includes(category)).sort();

  return [...ordered, ...extras];
}

/**
 * Derive download category filters the same way.
 *
 * @param {object[]} downloads - Loaded download entries.
 * @returns {string[]} Category names, "All" first.
 */
function deriveDownloadCategories(downloads) {
  const seen = new Set();
  downloads.forEach((doc) => {
    if (doc.category) seen.add(doc.category);
  });

  const ordered = DOWNLOAD_CATEGORIES.filter((category) => category === 'All' || seen.has(category));
  const extras = [...seen].filter((category) => !DOWNLOAD_CATEGORIES.includes(category)).sort();

  return [...ordered, ...extras];
}

/**
 * ContentProvider
 * Seeds state with bundled content, upgrades it from the localStorage cache on
 * mount, then refreshes from the spreadsheet in the background.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Application tree.
 * @returns {JSX.Element}
 */
export function ContentProvider({ children }) {
  const [datasets, setDatasets] = useState(SEED);
  const [source, setSource] = useState('bundled');

  useEffect(() => {
    if (!isRemoteConfigured()) return undefined;

    let cancelled = false;

    // Serve the previous visit's data immediately — avoids a visible content
    // swap on every page load while the network request is in flight.
    const cache = readCache();
    if (cache && cache.data) {
      setDatasets((current) => ({ ...current, ...cache.data }));
      setSource('cache');
    }

    // A fresh cache means the sheet was read minutes ago; skip the refetch.
    if (isCacheFresh(cache)) return undefined;

    fetchRemoteContent().then((remote) => {
      if (cancelled || !remote) return;
      setDatasets((current) => ({ ...current, ...remote }));
      setSource('sheet');
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({
    resources: datasets.resources,
    downloads: datasets.downloads,
    scenarios: datasets.scenarios,
    contributors: datasets.contributors,
    categories: deriveCategories(datasets.resources),
    downloadCategories: deriveDownloadCategories(datasets.downloads),
    source,
  }), [datasets, source]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

/**
 * Read site content.
 *
 * Falls back to bundled content when used outside a ContentProvider, so tests
 * and isolated component renders keep working without extra wiring.
 *
 * @returns {{resources: object[], downloads: object[], scenarios: object[],
 *   contributors: object[], categories: string[], downloadCategories: string[],
 *   source: string}}
 */
export function useContent() {
  return useContext(ContentContext) ?? BUNDLED_VALUE;
}
