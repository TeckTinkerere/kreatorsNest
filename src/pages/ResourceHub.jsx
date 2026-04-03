import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resourceData, CATEGORIES } from '../data/resources';
import { useRecommendations } from '../hooks/useRecommendations';
import CategoryFilter from '../components/CategoryFilter';
import ResourceCard from '../components/ResourceCard';

const ResourceHub = ({ title, typeDescription, hubType }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { trackInteraction } = useRecommendations();

  const filteredResources = useMemo(() => {
    return resourceData.filter(resource => {
      const matchType = resource.type === hubType;
      const matchCat = activeCategory === "All" || resource.category === activeCategory;
      return matchType && matchCat;
    });
  }, [hubType, activeCategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
          categories={CATEGORIES} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
      </div>

      <AnimatePresence mode="popLayout">
        {filteredResources.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 md:gap-8"
          >
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} onInteract={trackInteraction} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-organic-stone/50 mt-8"
          >
            <span className="text-5xl block mb-4">📭</span>
            <h3 className="text-2xl font-serif text-organic-charcoal mb-2">Nothing curated here yet.</h3>
            <p className="text-organic-clay">Check back later or change your category filter.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResourceHub;
