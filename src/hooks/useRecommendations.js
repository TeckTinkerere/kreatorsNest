import { useState, useEffect } from 'react';
import { resourceData } from '../data/resources';

const DB_NAME = 'KreatorNestDB';
const DB_VERSION = 1;
const STORE_NAME = 'userFavorites';

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // Initialize DB
  useEffect(() => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'categoryId' });
      }
    };

    request.onsuccess = () => {
      setIsReady(true);
      generateRecommendations();
    };

    request.onerror = (e) => {
      console.error("IndexedDB Error:", e);
    };
  }, []);

  const trackInteraction = (resourceCategory) => {
    if (!resourceCategory) return;
    
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = (e) => {
      const db = e.target.result;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const getReq = store.get(resourceCategory);
      getReq.onsuccess = () => {
        let data = getReq.result;
        if (data) {
          data.interactions += 1;
        } else {
          data = { categoryId: resourceCategory, interactions: 1 };
        }
        store.put(data);
      };
      
      transaction.oncomplete = () => {
        generateRecommendations(); // Refresh after interacting
      };
    };
  };

  const generateRecommendations = () => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = (e) => {
      const db = e.target.result;
      if(!db.objectStoreNames.contains(STORE_NAME)) return; // Failsafe
      
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getAllReq = store.getAll();

      getAllReq.onsuccess = () => {
        const history = getAllReq.result; // Array of { categoryId, interactions }
        
        // If no history, showcase random/curated selection
        if (!history || history.length === 0) {
          const defaultRecs = resourceData
            .sort(() => 0.5 - Math.random()) // very simple randomizing
            .slice(0, 4);
          setRecommendations(defaultRecs);
          return;
        }

        // Sort categories by highest interaction
        history.sort((a, b) => b.interactions - a.interactions);
        const topCategories = history.map(h => h.categoryId);

        // Filter resources that belong to top categories
        // Give higher preference or just take top ones
        let recs = [];
        topCategories.forEach(cat => {
          const matches = resourceData.filter(r => r.category === cat);
          recs = [...recs, ...matches];
        });
        
        // Fill the rest with random unique if we don't have enough
        if (recs.length < 4) {
          const others = resourceData.filter(r => !recs.includes(r)).slice(0, 4 - recs.length);
          recs = [...recs, ...others];
        }

        // Return top 4 unique (Set removes duplicates potentially caused if poor data map)
        setRecommendations([...new Set(recs)].slice(0, 4));
      };
    };
  };

  return { recommendations, trackInteraction, isReady };
};
