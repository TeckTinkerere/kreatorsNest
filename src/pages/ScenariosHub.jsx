import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { resourceData } from '../data/resources';
import { scenarioPosts } from '../data/scenarioPosts';
import { useRecommendations } from '../hooks/useRecommendations';
import { usePagination } from '../hooks/usePagination';
import ResourceCard from '../components/ResourceCard';
import VerticalScrollSlider from '../components/VerticalScrollSlider';

// ─── Config ────────────────────────────────────────────────────────────────
const ARTICLES_PER_PAGE = 4;  // 2 top row + 2 bottom row
const PAGINATION_ITEMS  = 5;
const SCROLL_PANEL_H    = 520; // px — height of the scrollable blog panel

// ─── Seeded shuffle (stable per session, random across reloads) ────────────
const seededShuffle = (arr) => {
  const a = [...arr];
  // Use a simple seed from session so it's random but stable during the session
  let seed = sessionStorage.getItem('scenario-seed');
  if (!seed) {
    seed = Math.floor(Math.random() * 10000).toString();
    sessionStorage.setItem('scenario-seed', seed);
  }
  let s = parseInt(seed, 10);
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ─── BlogCard — grey bg, black text ────────────────────────────────────────
const BlogCard = ({ post }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className="min-w-[280px]"
  >
    <Link to={`/scenarios/${post.slug}`} className="block h-full">
      <div className="group flex flex-col h-full bg-[#EBEBEB] text-black rounded-tl-3xl rounded-br-3xl rounded-tr-xl rounded-bl-xl p-8 min-h-[300px] border border-[#D5D5D5] shadow-sm hover:shadow-md transition-shadow duration-500 relative overflow-hidden">
        <div className="absolute inset-0 noise-bg z-0 opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-700 bg-primary-100 px-3 py-1.5 rounded-full border border-primary-200">
              Deep Dive
            </span>
          </div>
          <div className="mb-4 flex-1">
            <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase mb-1.5">{post.category}</p>
            <h3 className="font-serif text-xl mb-2 text-black group-hover:text-primary-700 transition-colors duration-300 leading-tight">
              {post.title}
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">{post.excerpt}</p>
          </div>
          <div className="mt-auto pt-3 flex items-center justify-between border-t border-neutral-300">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Clock size={12} />
              <span>{post.readTime}</span>
              <span className="mx-1">·</span>
              <span>{post.date}</span>
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all duration-300">
              Read <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

// ─── Pagination Controls ────────────────────────────────────────────────────
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage, totalPages, paginationItemsToDisplay: PAGINATION_ITEMS,
  });
  if (totalPages <= 1) return null;

  const base = 'flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 border';
  const active = 'bg-organic-charcoal text-organic-cream border-organic-charcoal shadow-sm';
  const idle = 'bg-white text-organic-charcoal border-organic-stone hover:bg-organic-stone/40';
  const disabled = 'opacity-40 pointer-events-none bg-white border-organic-stone text-organic-clay';

  return (
    <nav aria-label="Blog pagination" className="flex items-center justify-center gap-1.5 pt-5">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
        className={`${base} ${currentPage === 1 ? disabled : idle}`} aria-label="Previous page">
        <ChevronLeft size={16} />
      </button>

      {showLeftEllipsis && (<>
        <button onClick={() => onPageChange(1)} className={`${base} ${idle}`}>1</button>
        <span className={`${base} border-transparent pointer-events-none`}><MoreHorizontal size={16} className="text-organic-clay" /></span>
      </>)}

      {pages.map(page => (
        <button key={page} onClick={() => onPageChange(page)}
          className={`${base} ${page === currentPage ? active : idle}`}
          aria-current={page === currentPage ? 'page' : undefined}>
          {page}
        </button>
      ))}

      {showRightEllipsis && (<>
        <span className={`${base} border-transparent pointer-events-none`}><MoreHorizontal size={16} className="text-organic-clay" /></span>
        <button onClick={() => onPageChange(totalPages)} className={`${base} ${idle}`}>{totalPages}</button>
      </>)}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
        className={`${base} ${currentPage === totalPages ? disabled : idle}`} aria-label="Next page">
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

// ─── Filters ────────────────────────────────────────────────────────────────
const FILTERS = ['All', 'Blog Articles', 'Visual Communication', 'Motion Graphics', 'UX/UI & Web Design', 'Animation & 3D Arts', 'Media Production'];

// ─── ScenariosHub ───────────────────────────────────────────────────────────
const ScenariosHub = () => {
  const { trackInteraction } = useRecommendations();
  const [activeFilter, setActiveFilter] = useState('All');
  const [blogPage, setBlogPage] = useState(1);
  const scrollRef = useRef(null);

  // Reset page + scroll to top of panel on filter/page change
  useEffect(() => { setBlogPage(1); }, [activeFilter]);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [blogPage]);

  const scenarioResources = useMemo(() => resourceData.filter(r => r.type === 'Scenarios'), []);

  // ── Blog panel (paginated) ─────────────────────────────────────────────
  const isBlogFilter = activeFilter === 'Blog Articles';
  const totalBlogPages = Math.ceil(scenarioPosts.length / ARTICLES_PER_PAGE);
  const pagedBlogPosts = useMemo(() => {
    const start = (blogPage - 1) * ARTICLES_PER_PAGE;
    return scenarioPosts.slice(start, start + ARTICLES_PER_PAGE);
  }, [blogPage]);

  // ── Category filter ────────────────────────────────────────────────────
  const filteredResources = useMemo(() => {
    if (activeFilter === 'All') return scenarioResources;
    return scenarioResources.filter(r => r.category === activeFilter);
  }, [activeFilter, scenarioResources]);

  // ── All view — seeded random interleave ───────────────────────────────
  const mixedItems = useMemo(() => {
    if (activeFilter !== 'All') return null;
    // Shuffle both arrays with the same seed so order is random but stable per session
    const shuffledResources = seededShuffle(scenarioResources).map(d => ({ kind: 'resource', data: d }));
    const shuffledBlogs = seededShuffle(scenarioPosts).map(d => ({ kind: 'blog', data: d }));
    // Interleave: insert a blog card roughly every 2 resource cards
    const result = [];
    let bi = 0;
    shuffledResources.forEach((item, i) => {
      result.push(item);
      if ((i + 1) % 2 === 0 && bi < shuffledBlogs.length) {
        result.push(shuffledBlogs[bi++]);
      }
    });
    // Append remaining blog cards
    while (bi < shuffledBlogs.length) result.push(shuffledBlogs[bi++]);
    return result;
  }, [activeFilter, scenarioResources]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto min-h-screen"
    >
      {/* Header */}
      <div className="mb-10 max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-organic-charcoal mb-4 leading-tight tracking-tight">
          Real-World Scenarios
        </h1>
        <p className="text-lg md:text-xl text-organic-clay leading-relaxed">
          Case studies on pricing, client management, and law — plus deep-dive articles from the field.
        </p>
      </div>

      {/* Filter bar */}
      <div className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 md:mx-0 md:px-0 border-b border-organic-stone/30 mb-8">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 py-4">
          {FILTERS.map(filter => {
            const isBlog = filter === 'Blog Articles';
            const isActive = activeFilter === filter;
            return (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border
                  ${isActive
                    ? 'bg-organic-charcoal text-white border-organic-charcoal shadow-md'
                    : isBlog
                      ? 'bg-[#EBEBEB] text-black border-[#D5D5D5] hover:bg-[#DCDCDC]'
                      : 'bg-white text-organic-charcoal border-organic-stone hover:bg-organic-stone/30'
                  }`}
              >
                {filter}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ── Blog Articles paginated panel with custom slider ── */}
        {isBlogFilter ? (
          <motion.div
            key="blog-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-4 items-start">
              {/* Scrollable card area — hides native scrollbar */}
              <div
                ref={scrollRef}
                style={{ maxHeight: SCROLL_PANEL_H }}
                className="flex-1 overflow-y-auto hide-scrollbar"
              >
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 md:gap-8 pb-2">
                  <AnimatePresence mode="popLayout">
                    {pagedBlogPosts.map(post => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Custom vertical slider — replaces native scrollbar */}
              <div className="shrink-0 flex items-center" style={{ height: SCROLL_PANEL_H }}>
                <VerticalScrollSlider scrollRef={scrollRef} height={SCROLL_PANEL_H} />
              </div>
            </div>

            <PaginationControls
              currentPage={blogPage}
              totalPages={totalBlogPages}
              onPageChange={setBlogPage}
            />
            <p className="text-center text-xs text-organic-clay mt-3 pb-16">
              Showing {Math.min((blogPage - 1) * ARTICLES_PER_PAGE + 1, scenarioPosts.length)}–{Math.min(blogPage * ARTICLES_PER_PAGE, scenarioPosts.length)} of {scenarioPosts.length} articles
            </p>
          </motion.div>

        ) : (
          /* ── Mixed / category grid ── */
          <motion.div
            key={`grid-${activeFilter}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            layout
            className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 md:gap-8 pb-16"
          >
            {activeFilter === 'All'
              ? mixedItems.map(item =>
                  item.kind === 'blog'
                    ? <BlogCard key={item.data.id} post={item.data} />
                    : <ResourceCard key={item.data.id} resource={item.data} onInteract={trackInteraction} />
                )
              : filteredResources.length > 0
                ? filteredResources.map(r => (
                    <ResourceCard key={r.id} resource={r} onInteract={trackInteraction} />
                  ))
                : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-24 bg-white/50 rounded-3xl border border-organic-stone/50"
                  >
                    <p className="text-2xl font-serif text-organic-charcoal mb-2">Nothing here yet.</p>
                    <p className="text-organic-clay">Try a different filter.</p>
                  </motion.div>
                )
            }
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ScenariosHub;
