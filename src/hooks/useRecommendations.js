import { useState, useEffect, useRef, useCallback } from 'react';
import { resourceData } from '../data/resources';

const DB_NAME = 'KreatorNestDB';
const DB_VERSION = 1;
const STORE_NAME = 'userFavorites';

/**
 * useRecommendations
 * Manages personalised content recommendations based on IndexedDB-stored user interaction history.
 * The IndexedDB connection is opened once and cached for the lifetime of the hook instance.
 *
 * @returns {{ recommendations: Array, trackInteraction: Function, isReady: boolean }}
 *   recommendations: array of up to 4 recommended resources;
 *   trackInteraction: records a resource category interaction;
 *   isReady: whether IndexedDB has been initialised
 */
export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isReady, setIsReady] = useState(false);
  // Cache the db reference to avoid re-opening on every interaction
  const dbRef = useRef(null);

  /**
   * generateRecommendations
   * Reads interaction history from a live db reference and updates the recommendations state.
   * Falls back to a random selection when no history exists.
   *
   * @param {IDBDatabase} db - The open IndexedDB database instance
   */
  const generateRecommendations = useCallback((db) => {
    if (!db || !db.objectStoreNames.contains(STORE_NAME)) return;

    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const getAllReq = store.getAll();

    getAllReq.onsuccess = () => {
      const history = getAllReq.result;

      if (!history || history.length === 0) {
        // No history — serve a random sample without mutating the shared module export
        const shuffled = [...resourceData].sort(() => 0.5 - Math.random());
        setRecommendations(shuffled.slice(0, 4));
        return;
      }

      // Sort categories by most interactions
      const topCategories = [...history]
        .sort((a, b) => b.interactions - a.interactions)
        .map(h => h.categoryId);

      // Collect resources matching top categories (preserves category priority order)
      let recs = topCategories.flatMap(cat =>
        resourceData.filter(r => r.category === cat)
      );

      // Pad to at least 4 with resources from other categories
      if (recs.length < 4) {
        const existingIds = new Set(recs.map(r => r.id));
        const others = resourceData
          .filter(r => !existingIds.has(r.id))
          .slice(0, 4 - recs.length);
        recs = [...recs, ...others];
      }

      // Deduplicate by id (correct object deduplication — Set deduplicates by reference, not value)
      const unique = [...new Map(recs.map(r => [r.id, r])).values()].slice(0, 4);
      setRecommendations(unique);
    };
  }, []);

  // Open the IndexedDB connection once on mount
  useEffect(() => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'categoryId' });
      }
    };

    request.onsuccess = (e) => {
      dbRef.current = e.target.result;
      setIsReady(true);
      generateRecommendations(dbRef.current);
    };

    request.onerror = (e) => {
      console.error('IndexedDB Error:', e);
    };

    return () => {
      // Close the connection when the hook unmounts to free resources
      dbRef.current?.close();
      dbRef.current = null;
    };
  }, [generateRecommendations]);

  /**
   * trackInteraction
   * Increments the interaction count for a given resource category in IndexedDB,
   * then refreshes recommendations.
   *
   * @param {string} resourceCategory - The category identifier to track
   */
  const trackInteraction = useCallback((resourceCategory) => {
    if (!resourceCategory || !dbRef.current) return;

    const db = dbRef.current;
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const getReq = store.get(resourceCategory);
    getReq.onsuccess = () => {
      const existing = getReq.result;
      store.put(
        existing
          ? { ...existing, interactions: existing.interactions + 1 }
          : { categoryId: resourceCategory, interactions: 1 }
      );
    };

    transaction.oncomplete = () => {
      generateRecommendations(db);
    };
  }, [generateRecommendations]);

  return { recommendations, trackInteraction, isReady };
};
