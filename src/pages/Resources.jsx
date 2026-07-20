import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import CategoryFilter from '../components/CategoryFilter';
import ResourceCard from '../components/ResourceCard';
import { resourceData } from '../data/resources';
import { useRecommendations } from '../hooks/useRecommendations';
import { filterByTier } from '../utils/tierFilters';

const TAB_CONFIG = {
  learning: { label: 'Learning', type: 'Learning' },
  tools: { label: 'Tools', type: 'Tools' },
  gigs: { label: 'Gigs', type: 'Gigs' },
};

const TIER_TABS = [
  { id: 'essential', label: 'Essentials' },
  { id: 'pro', label: 'Pro Picks' },
  { id: 'all', label: 'All' },
];

const normalizeTab = (value) => (value in TAB_CONFIG ? value : 'learning');

const Resources = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [tierTab, setTierTab] = useState('all');
  const { trackInteraction } = useRecommendations();

  const activeTab = normalizeTab(searchParams.get('tab') ?? 'learning');

  const resourcesForTab = useMemo(() => (
    resourceData.filter((resource) => resource.type === TAB_CONFIG[activeTab].type)
  ), [activeTab]);

  const resourcesForTier = useMemo(() => (
    filterByTier(resourcesForTab, tierTab)
  ), [resourcesForTab, tierTab]);

  const categories = useMemo(() => {
    const categorySet = new Set(resourcesForTier.map((resource) => resource.category));
    return ['All', ...categorySet];
  }, [resourcesForTier]);

  const filteredResources = useMemo(() => (
    resourcesForTier.filter((resource) => (
      activeCategory === 'All' || resource.category === activeCategory
    ))
  ), [resourcesForTier, activeCategory]);

  const setTab = (nextTab) => {
    const normalized = normalizeTab(nextTab);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', normalized);
    setSearchParams(nextParams);
    setActiveCategory('All');
  };

  const setTier = (nextTier) => {
    setTierTab(nextTier);
    setActiveCategory('All');
  };

  return (
    <>
      <SEO
        title="Resources"
        description="Explore curated learning, tools, and gig platforms with tier-based filtering for creative freelancers."
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto min-h-screen"
      >
        <div className="mb-10 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-organic-charcoal mb-4 leading-tight tracking-tight">
            Resources
          </h1>
          <p className="text-lg md:text-xl text-organic-clay leading-relaxed">
            Browse curated learning, tools, and gigs, then narrow by tier and category.
          </p>
        </div>

        <div className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 md:mx-0 md:px-0 border-b border-organic-stone/30 mb-8 space-y-4">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar" role="tablist" aria-label="Resource tabs">
            {Object.entries(TAB_CONFIG).map(([key, tab]) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setTab(key)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                    isActive
                      ? 'bg-organic-charcoal text-white border-transparent'
                      : 'bg-white text-organic-charcoal border-organic-stone hover:bg-organic-stone/30'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar" role="tablist" aria-label="Tier tabs">
            {TIER_TABS.map((tab) => {
              const isActive = tierTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setTier(tab.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                    isActive
                      ? 'bg-primary-700 text-white border-transparent'
                      : 'bg-white text-organic-charcoal border-organic-stone hover:bg-organic-stone/30'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${tierTab}-${activeCategory}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onInteract={trackInteraction}
                    variant="full"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white/50 rounded-3xl border border-organic-stone/50 mt-8">
                <span className="text-5xl block mb-4">📭</span>
                <h3 className="text-2xl font-serif text-organic-charcoal mb-2">
                  Nothing found for this view.
                </h3>
                <p className="text-organic-clay">Try a different tab, tier, or category.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Resources;
