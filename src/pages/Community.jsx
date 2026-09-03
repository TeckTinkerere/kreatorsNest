import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter';
import ResourceCard from '../components/ResourceCard';
import SuggestResourceCard from '../components/SuggestResourceCard';
import SEO from '../components/SEO';
import { useContent } from '../content/ContentContext';
import { useRecommendations } from '../hooks/useRecommendations';

const Community = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { trackInteraction } = useRecommendations();
  const { resources } = useContent();

  const communityResources = useMemo(() => (
    resources.filter((resource) => resource.type === 'Communities')
  ), [resources]);

  const availableCategories = useMemo(() => (
    ['All', ...new Set(communityResources.map((resource) => resource.category))]
  ), [communityResources]);

  const filteredResources = useMemo(() => (
    communityResources.filter((resource) => (
      activeCategory === 'All' || resource.category === activeCategory
    ))
  ), [communityResources, activeCategory]);

  return (
    <>
      <SEO
        title="Community"
        description="Discover communities, connect with contributors, and keep improving your freelance process."
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto min-h-screen"
      >
        <div className="mb-10 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-organic-charcoal mb-4 leading-tight tracking-tight">
            Community
          </h1>
          <p className="text-lg md:text-xl text-organic-clay leading-relaxed">
            Join creative communities, learn with peers, and keep building with support.
          </p>
        </div>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-primary-600" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary-600">
              Communities
            </h2>
          </div>

          <div className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 md:mx-0 md:px-0 border-b border-organic-stone/30 mb-8">
            <CategoryFilter
              categories={availableCategories}
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
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onInteract={trackInteraction}
                    variant="full"
                  />
                ))}
                <SuggestResourceCard context="community" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-organic-stone/50 mt-8"
              >
                <span className="text-5xl block mb-4">🤝</span>
                <h3 className="text-2xl font-serif text-organic-charcoal mb-2">
                  No communities in this filter yet.
                </h3>
                <p className="text-organic-clay">Try another category to discover more spaces.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="mb-10">
          <div className="rounded-3xl border border-organic-stone bg-white p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-serif text-organic-charcoal mb-2">
                Meet contributors from the community
              </h2>
              <p className="text-organic-clay">
                Explore creators sharing practical insights, curated links, and real freelance experience.
              </p>
            </div>
            <Link
              to="/contributors"
              className="inline-flex items-center justify-center rounded-xl bg-primary-700 text-white px-5 py-3 font-semibold hover:bg-primary-800 transition-colors whitespace-nowrap"
            >
              Open Contributors
            </Link>
          </div>
        </section>

        <footer className="pt-8 border-t border-organic-stone/40">
          <Link
            to="/feedback"
            className="inline-flex items-center gap-2 text-sm font-semibold text-organic-clay hover:text-primary-700 transition-colors"
          >
            <MessageSquare size={16} />
            Share feedback with the team
          </Link>
        </footer>
      </motion.div>
    </>
  );
};

export default Community;
