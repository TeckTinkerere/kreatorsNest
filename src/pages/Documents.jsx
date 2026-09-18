import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FileText, Layers } from 'lucide-react';
import SEO from '../components/SEO';
import CategoryFilter from '../components/CategoryFilter';
import DownloadCard from '../components/DownloadCard';
import ResourceCard from '../components/ResourceCard';
import { useBrowseMode } from '../context/BrowseModeContext';
import { useContent } from '../content/ContentContext';
import { useRecommendations } from '../hooks/useRecommendations';
import {
  contentTransition,
  contentVariants,
  pageTransition,
  pageVariants,
} from '../utils/motion';

const DOCUMENT_CATEGORIES = ['All', 'Contracts', 'Invoices', 'Templates', 'Checklists'];

const mapDownloadCategory = (category) => {
  if (category === 'Contracts') return 'Contracts';
  if (category === 'Invoices') return 'Invoices';
  if (category === 'Checklists') return 'Checklists';
  return 'Templates';
};

const Documents = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { effectiveMode } = useBrowseMode();
  const { trackInteraction } = useRecommendations();
  const shouldReduceMotion = useReducedMotion();
  const routeVariants = pageVariants(shouldReduceMotion);
  const swapVariants = contentVariants(shouldReduceMotion);
  const { resources, downloads } = useContent();

  const filteredDownloads = useMemo(() => (
    downloads.filter((doc) => (
      activeCategory === 'All' || mapDownloadCategory(doc.category) === activeCategory
    ))
  ), [downloads, activeCategory]);

  const filteredTemplateResources = useMemo(() => (
    resources.filter((resource) => {
      if (resource.type !== 'Templates') return false;
      return activeCategory === 'All' || activeCategory === 'Templates';
    })
  ), [resources, activeCategory]);

  const showHiddenGemBadge = effectiveMode === 'explore';
  const hasResults = filteredDownloads.length > 0 || filteredTemplateResources.length > 0;

  return (
    <>
      <SEO
        title="Documents Hub"
        description="Contracts, invoices, checklists, and practical template resources in one place for creative freelancers."
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
            Documents
          </h1>
          <p className="text-lg md:text-xl text-organic-clay leading-relaxed">
            Download ready-to-edit files and discover curated templates to speed up your client workflow.
          </p>
        </div>

        <div className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 md:mx-0 md:px-0 border-b border-organic-stone/30 mb-8">
          <CategoryFilter
            categories={DOCUMENT_CATEGORIES}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            layoutGroupId="documents-category-pill"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`documents-${activeCategory}`}
            variants={swapVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={contentTransition(shouldReduceMotion)}
          >
            {hasResults ? (
              <div className="space-y-12">
                {filteredDownloads.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <FileText size={16} className="text-organic-clay" />
                      <h2 className="text-sm font-bold uppercase tracking-widest text-organic-clay">
                        Downloadable Docs
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredDownloads.map((doc) => (
                        <DownloadCard
                          key={doc.id}
                          doc={doc}
                          showHiddenGem={showHiddenGemBadge}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {filteredTemplateResources.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <Layers size={16} className="text-primary-600" />
                      <h2 className="text-sm font-bold uppercase tracking-widest text-primary-600">
                        Curated Template Resources
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {filteredTemplateResources.map((resource) => (
                        <div key={resource.id} className="relative">
                          {showHiddenGemBadge && resource.tier === 'hidden-gem' && (
                            <span className="absolute top-4 right-4 z-20 text-[10px] font-semibold uppercase tracking-wide text-primary-700 bg-primary-50 border border-primary-100 px-2 py-1 rounded-full">
                              Hidden gem
                            </span>
                          )}
                          <ResourceCard
                            resource={resource}
                            onInteract={trackInteraction}
                            variant="full"
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <div className="text-center py-24 bg-white/50 rounded-3xl border border-organic-stone/50 mt-8">
                <span className="text-5xl block mb-4">📭</span>
                <h3 className="text-2xl font-serif text-organic-charcoal mb-2">
                  Nothing curated here yet.
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

export default Documents;
