import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SEO from '../components/SEO';
import CategoryFilter from '../components/CategoryFilter';
import ResourceCard from '../components/ResourceCard';
import { resourceData } from '../data/resources';
import { useRecommendations } from '../hooks/useRecommendations';
import {
  contentTransition,
  contentVariants,
  pageTransition,
  pageVariants,
} from '../utils/motion';

const INCLUDED_TYPES = ['Learning', 'Tools'];

const Essentials = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { trackInteraction } = useRecommendations();
  const shouldReduceMotion = useReducedMotion();
  const routeVariants = pageVariants(shouldReduceMotion);
  const swapVariants = contentVariants(shouldReduceMotion);

  const essentials = useMemo(
    () => resourceData.filter((resource) => (
      INCLUDED_TYPES.includes(resource.type) && resource.tier === 'essential'
    )),
    []
  );

  const categories = useMemo(() => {
    const categorySet = new Set(essentials.map((resource) => resource.category));
    return ['All', ...categorySet];
  }, [essentials]);

  const filteredEssentials = useMemo(() => (
    essentials.filter((resource) => (
      activeCategory === 'All' || resource.category === activeCategory
    ))
  ), [essentials, activeCategory]);

  const learningResources = useMemo(
    () => filteredEssentials.filter((resource) => resource.type === 'Learning'),
    [filteredEssentials]
  );

  const toolResources = useMemo(
    () => filteredEssentials.filter((resource) => resource.type === 'Tools'),
    [filteredEssentials]
  );

  const hasResults = filteredEssentials.length > 0;

  return (
    <>
      <SEO
        title="Essentials"
        description="Guided essentials for creative freelancers: foundational learning and practical tools to start strong."
      />

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
            Essentials
          </h1>
          <p className="text-lg md:text-xl text-organic-clay leading-relaxed">
            Start with essential learning paths and tools curated for your first freelance milestones.
          </p>
        </div>

        <div className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 md:mx-0 md:px-0 border-b border-organic-stone/30 mb-8">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            layoutGroupId="essentials-category-pill"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`essentials-${activeCategory}`}
            variants={swapVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={contentTransition(shouldReduceMotion)}
          >
            {hasResults ? (
              <div className="space-y-12">
                {learningResources.length > 0 && (
                  <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-organic-clay mb-5">
                      Learning
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {learningResources.map((resource) => (
                        <ResourceCard
                          key={resource.id}
                          resource={resource}
                          onInteract={trackInteraction}
                          variant="compact"
                        />
                      ))}
                    </div>
                  </section>
                )}

                {toolResources.length > 0 && (
                  <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-primary-600 mb-5">
                      Tools
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {toolResources.map((resource) => (
                        <ResourceCard
                          key={resource.id}
                          resource={resource}
                          onInteract={trackInteraction}
                          variant="compact"
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <div className="text-center py-24 bg-white/50 rounded-3xl border border-organic-stone/50 mt-8">
                <span className="text-5xl block mb-4">📭</span>
                <h3 className="text-2xl font-serif text-organic-charcoal mb-2">
                  No essentials found.
                </h3>
                <p className="text-organic-clay">Try another category filter.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Essentials;
