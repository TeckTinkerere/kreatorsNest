import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { resourceData } from '../data/resources';
import { useRecommendations } from '../hooks/useRecommendations';
import CategoryFilter from '../components/CategoryFilter';
import ResourceCard from '../components/ResourceCard';
import SEO from '../components/SEO';
import {
  contentTransition,
  contentVariants,
  pageTransition,
  pageVariants,
} from '../utils/motion';

/**
 * ResourceHub
 * Generic resource listing page with category filtering and animated grid.
 *
 * @param {object} props
 * @param {string} props.title - Page heading
 * @param {string} props.typeDescription - Subtitle/description text
 * @param {string} props.hubType - Resource type key to filter from resourceData
 */
const ResourceHub = ({ title, typeDescription, hubType }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { trackInteraction } = useRecommendations();
  const shouldReduceMotion = useReducedMotion();
  const routeVariants = pageVariants(shouldReduceMotion);
  const swapVariants = contentVariants(shouldReduceMotion);

  const filteredResources = useMemo(() => {
    // Derive categories from the actual resources for this hubType
    return resourceData.filter(resource => {
      const matchType = resource.type === hubType;
      const matchCat = activeCategory === "All" || resource.category === activeCategory;
      return matchType && matchCat;
    });
  }, [hubType, activeCategory]);

  // Only show categories that have resources for this hub type
  const availableCategories = useMemo(() => {
    const cats = resourceData
      .filter(r => r.type === hubType)
      .map(r => r.category);
    return ['All', ...new Set(cats)];
  }, [hubType]);

  return (
    <>
      <SEO title={title} description={typeDescription} />
      <motion.div
        variants={routeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition(shouldReduceMotion)}
        className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto min-h-screen"
      >
      <div className="mb-10 max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-organic-charcoal mb-4 leading-tight tracking-tight">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-organic-clay leading-relaxed">
          {typeDescription}
        </p>
      </div>

      <div className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 md:mx-0 md:px-0 border-b border-organic-stone/30 mb-8">
        <CategoryFilter
          categories={availableCategories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          layoutGroupId={`${hubType}-category-pill`}
        />
      </div>

      <AnimatePresence mode="wait">
        {filteredResources.length > 0 ? (
          <motion.div
            key={`hub-${hubType}-${activeCategory}`}
            variants={swapVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={contentTransition(shouldReduceMotion)}
            className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 md:gap-8"
          >
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} onInteract={trackInteraction} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={`hub-empty-${hubType}-${activeCategory}`}
            variants={swapVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={contentTransition(shouldReduceMotion)}
            className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-organic-stone/50 mt-8"
          >
            <span className="text-5xl block mb-4">📭</span>
            <h3 className="text-2xl font-serif text-organic-charcoal mb-2">Nothing curated here yet.</h3>
            <p className="text-organic-clay">Check back later or change your category filter.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </>
  );
};

export default ResourceHub;
