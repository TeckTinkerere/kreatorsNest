import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Star } from 'lucide-react';
import { downloadsData, DOWNLOAD_CATEGORIES } from '../data/downloads';
import SEO from '../components/SEO';
import DownloadCard from '../components/DownloadCard';

/**
 * FeaturedCard
 * Larger hero-style card for featured documents at the top of the page.
 *
 * @param {object} props
 * @param {object} props.doc - Document entry from downloadsData
 */
const FeaturedCard = ({ doc }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = doc.txtFile;
    link.download = doc.txtFile.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group flex flex-col bg-organic-charcoal text-organic-cream rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute inset-0 noise-bg opacity-10 pointer-events-none z-0" />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <span className="text-3xl select-none">{doc.icon}</span>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-organic-sand bg-white/10 px-3 py-1.5 rounded-full">
            <Star size={10} className="text-yellow-400" />
            <span>Featured</span>
          </div>
        </div>
        <div className="flex-1 mb-6">
          <p className="text-xs font-semibold tracking-widest text-organic-clay uppercase mb-2">{doc.category}</p>
          <h3 className="font-serif text-2xl text-white mb-3 leading-tight group-hover:text-primary-300 transition-colors duration-300">
            {doc.title}
          </h3>
          <p className="text-sm text-organic-sand leading-relaxed">{doc.description}</p>
        </div>
        <button
          onClick={handleDownload}
          className={`mt-auto w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-bold transition-all duration-200 ${
            downloaded
              ? 'bg-green-500 text-white'
              : 'bg-white text-organic-charcoal hover:bg-primary-50'
          }`}
          aria-label={`Download ${doc.title} as editable text file`}
        >
          {downloaded ? (
            <>
              <span>✓</span>
              <span>Downloaded!</span>
            </>
          ) : (
            <>
              <Download size={15} />
              <span>Download .txt</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

/**
 * Downloads
 * A hub of free, ready-to-use document templates for creative freelancers.
 * Templates are filterable by category and downloadable as editable .txt files.
 */
const Downloads = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const featuredDocs = useMemo(
    () => downloadsData.filter((d) => d.featured),
    []
  );

  const filteredDocs = useMemo(() => {
    const all = activeCategory === 'All'
      ? downloadsData.filter((d) => !d.featured)
      : downloadsData.filter((d) => d.category === activeCategory);
    return all;
  }, [activeCategory]);

  // When a category is selected show all docs in that category (including featured)
  const showingAll = activeCategory === 'All';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  return (
    <>
      <SEO
        title="Free Downloads"
        description="Free, ready-to-use templates for creative freelancers — contracts, proposals, invoices, briefs, and checklists. Download and customise instantly."
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto min-h-screen"
      >
        {/* Header */}
        <div className="mb-10 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-organic-charcoal mb-4 leading-tight tracking-tight">
            Free Downloads
          </h1>
          <p className="text-lg md:text-xl text-organic-clay leading-relaxed">
            Contracts, proposals, invoices, and briefs — ready to download, edit, and send.
            No sign-up required.
          </p>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 md:mx-0 md:px-0 border-b border-organic-stone/30 mb-10">
          <div className="flex overflow-x-auto hide-scrollbar gap-2 py-4">
            {DOWNLOAD_CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'bg-organic-charcoal text-white border-organic-charcoal shadow-md'
                    : 'bg-white text-organic-charcoal border-organic-stone hover:bg-organic-stone/30'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showingAll ? (
            <motion.div
              key="all-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Featured row */}
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Star size={16} className="text-primary-600" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-primary-600">
                    Essential Templates
                  </h2>
                </div>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                >
                  {featuredDocs.map((doc) => (
                    <FeaturedCard key={doc.id} doc={doc} />
                  ))}
                </motion.div>
              </section>

              {/* All other templates */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <FileText size={16} className="text-organic-clay" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-organic-clay">
                    All Templates
                  </h2>
                </div>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredDocs.map((doc) => (
                    <DownloadCard key={doc.id} doc={doc} />
                  ))}
                </motion.div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key={`cat-${activeCategory}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {downloadsData.filter((d) => d.category === activeCategory).length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {downloadsData
                    .filter((d) => d.category === activeCategory)
                    .map((doc) => (
                      <DownloadCard key={doc.id} doc={doc} />
                    ))}
                </motion.div>
              ) : (
                <div className="text-center py-24 bg-white/50 rounded-3xl border border-organic-stone/50">
                  <span className="text-5xl block mb-4">📭</span>
                  <h3 className="text-2xl font-serif text-organic-charcoal mb-2">
                    Nothing here yet.
                  </h3>
                  <p className="text-organic-clay">More templates coming soon.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-24 mb-12 bg-primary-50 border border-primary-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="max-w-xl">
            <h3 className="text-2xl md:text-3xl font-serif text-organic-charcoal mb-3">
              Missing a template?
            </h3>
            <p className="text-organic-clay leading-relaxed">
              Tell us what document would save you the most time.
              We'll prioritise the most-requested additions.
            </p>
          </div>
          <a
            href="/feedback"
            className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-organic-charcoal text-organic-cream rounded-full font-bold text-sm hover:bg-black transition-colors"
          >
            <span>Request a Template</span>
            <span>→</span>
          </a>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Downloads;
