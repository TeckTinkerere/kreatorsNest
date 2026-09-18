import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Youtube, Instagram, Twitter, Linkedin, Video, Users, Search, X, Clock, Share2, Check, ExternalLink } from 'lucide-react';
import { useContent } from '../content/ContentContext';
import SEO from '../components/SEO';

const FILTERS = ["All", "YouTube", "Instagram", "Twitter", "TikTok", "LinkedIn"];

const socialIcons = {
  youtube: { icon: Youtube, color: "text-red-600", bg: "bg-red-50", border: "border-red-200", hover: "hover:bg-red-100" },
  instagram: { icon: Instagram, color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200", hover: "hover:bg-pink-100" },
  twitter: { icon: Twitter, color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-200", hover: "hover:bg-sky-100" },
  tiktok: { icon: Video, color: "text-organic-charcoal", bg: "bg-organic-stone/30", border: "border-organic-stone", hover: "hover:bg-organic-stone/50" },
  linkedin: { icon: Linkedin, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", hover: "hover:bg-blue-100" }
};

const RECENT_SEARCHES_KEY = 'kn-recent-searches';
const MAX_HISTORY = 5;

/**
 * Contributors
 * Renders a searchable, filterable grid of community contributors with
 * social links, contribution lists, and a share feature.
 */
const Contributors = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || []; }
    catch { return []; }
  });
  const [showHistory, setShowHistory] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  // highlightedId: contributor id surfaced from ?ref= query param
  const [highlightedId, setHighlightedId] = useState(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  // Map of contributor id → DOM node, used to scroll to a shared contributor
  const cardRefs = useRef({});
  const location = useLocation();
  const { contributors: contributorsData } = useContent();

  /**
   * Deep-link handler: read ?ref=<id> on mount, scroll to and highlight the card.
   * The highlight fades after 3 s so it doesn't persist permanently.
   */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refId = params.get('ref');
    if (!refId) return;

    const target = contributorsData.find(c => String(c.id) === refId);
    if (!target) return;

    setHighlightedId(refId);

    // Wait one tick for the grid to render, then scroll
    const timer = setTimeout(() => {
      const node = cardRefs.current[refId];
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        node.focus({ preventScroll: true });
      }
    }, 150);

    // Remove highlight ring after 3 s
    const clearTimer = setTimeout(() => setHighlightedId(null), 3150);

    return () => {
      clearTimeout(timer);
      clearTimeout(clearTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  /**
   * saveSearch
   * Persists a search query to localStorage recent searches history.
   *
   * @param {string} query - The search term to save
   */
  const saveSearch = useCallback((query) => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const updated = [trimmed, ...prev.filter(s => s !== trimmed)].slice(0, MAX_HISTORY);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  /**
   * clearHistory
   * Clears all recent search history from state and localStorage.
   */
  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredContributors = useMemo(() => {
    let list = contributorsData;
    if (activeFilter !== "All") {
      const platformKey = activeFilter.toLowerCase();
      list = list.filter(c => c.socials[platformKey]);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.bio.toLowerCase().includes(q) ||
        c.contributions.some(ct => ct.toLowerCase().includes(q))
      );
    }
    return list;
  }, [contributorsData, activeFilter, searchQuery]);

  /**
   * handleSearch
   * Handles search form submission, saves the query, and closes the history dropdown.
   *
   * @param {object} e - The form submit event
   */
  const handleSearch = (e) => {
    e.preventDefault();
    saveSearch(searchQuery);
    setShowHistory(false);
  };

  /**
   * handleRecentClick
   * Sets the search query from a recent search term and closes the history dropdown.
   *
   * @param {string} term - The selected recent search term
   */
  const handleRecentClick = (term) => {
    setSearchQuery(term);
    setShowHistory(false);
    searchInputRef.current?.blur();
  };

  /**
   * handleClearSearch
   * Clears the current search query and refocuses the search input.
   */
  const handleClearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  /**
   * getInitials
   * Extracts up to 2 uppercase initials from a full name.
   * Returns '?' for empty or missing names.
   *
   * @param {string} name - The full name
   * @returns {string} Uppercase initials (e.g. "John Doe" -> "JD", "Madonna" -> "M")
   */
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .trim()
      .split(/\s+/)
      .map(n => n[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * shareContributor
   * Shares a contributor's profile URL via the Web Share API, or falls back
   * to clipboard copy / Twitter intent.
   *
   * @param {object} contributor - The contributor object with id, name, and bio
   */
  const shareContributor = async (contributor) => {
    const url = `${window.location.origin}/contributors?ref=${contributor.id}`;
    const text = `Check out ${contributor.name} on KreatorNest — ${contributor.bio}`;

    if (navigator.share) {
      await navigator.share({ title: contributor.name, text, url }).catch(() => {});
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(contributor.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    }
  };

  return (
    <>
      <SEO
        title="Contributors"
        description="Meet the creators who share their knowledge and help the KreatorNest community grow. Search contributors by name, platform, or contributions."
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto min-h-screen"
      >
        <div className="mb-10 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-organic-charcoal mb-4 leading-tight tracking-tight">
            Contributors
          </h1>
          <p className="text-lg md:text-xl text-organic-clay leading-relaxed">
            Meet the creators who share their knowledge and help this community grow.
          </p>
        </div>

        <div className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 md:mx-0 md:px-0 border-b border-organic-stone/30 mb-8">
          {/* Search */}
          <div ref={searchRef} className="relative mb-2 max-w-md">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-organic-clay pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowHistory(true)}
                  placeholder="Search contributors..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-full text-sm bg-white border border-organic-stone text-organic-charcoal placeholder:text-organic-clay/60 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-organic-clay hover:text-organic-charcoal transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </form>

            <AnimatePresence>
              {showHistory && recentSearches.length > 0 && !searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-organic-stone rounded-xl shadow-lg z-30 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-organic-stone/30">
                    <span className="text-xs font-semibold text-organic-clay flex items-center gap-1.5">
                      <Clock size={12} />
                      Recent searches
                    </span>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <ul>
                    {recentSearches.map((term) => (
                      <li key={term}>
                        <button
                          onClick={() => handleRecentClick(term)}
                          className="w-full text-left px-4 py-2.5 text-sm text-organic-charcoal hover:bg-organic-stone/20 transition-colors flex items-center gap-2"
                        >
                          <Clock size={12} className="text-organic-clay shrink-0" />
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pill filters */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 py-4">
            {FILTERS.map((filter) => {
              const platformKey = filter.toLowerCase();
              const socialConfig = socialIcons[platformKey];
              const isActive = activeFilter === filter;
              return (
                <motion.button
                  key={filter}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setActiveFilter(filter); setShowHistory(false); }}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? "bg-organic-charcoal text-white shadow-md border-transparent"
                      : "bg-white text-organic-charcoal hover:bg-organic-stone/30 border border-organic-stone"
                  }`}
                >
                  {filter !== "All" && socialConfig && <socialConfig.icon size={14} />}
                  {filter === "All" && <Users size={14} />}
                  {filter}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        {searchQuery.trim() && (
          <p className="text-sm text-organic-clay mb-6">
            {filteredContributors.length} result{filteredContributors.length !== 1 ? 's' : ''} for "<span className="font-medium text-organic-charcoal">{searchQuery.trim()}</span>"
          </p>
        )}

        <AnimatePresence mode="popLayout">
          {filteredContributors.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 md:gap-8"
            >
              {filteredContributors.map((contributor) => (
                <motion.div
                  key={contributor.id}
                  layout
                  ref={(node) => { cardRefs.current[String(contributor.id)] = node; }}
                  tabIndex={highlightedId === String(contributor.id) ? -1 : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white rounded-3xl border p-6 hover:shadow-lg transition-all duration-300 ${
                    highlightedId === String(contributor.id)
                      ? 'border-primary-400 shadow-lg ring-2 ring-primary-300 ring-offset-2'
                      : 'border-organic-stone/50'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-5">
                    {contributor.avatar ? (
                      <img
                        src={contributor.avatar}
                        alt={contributor.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-organic-stone"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-organic-stone/40 flex items-center justify-center text-organic-clay font-serif font-semibold text-lg border-2 border-organic-stone shrink-0">
                        {getInitials(contributor.name)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-serif text-organic-charcoal font-semibold truncate">
                        {contributor.name}
                      </h3>
                      <p className="text-sm text-organic-clay mt-1 line-clamp-2">
                        {contributor.bio}
                      </p>
                    </div>
                  </div>

                  {contributor.contributions && contributor.contributions.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-organic-clay mb-2">
                        Contributions
                      </h4>
                      <ul className="space-y-1">
                        {contributor.contributions.map((contribution, idx) => (
                          <li key={idx} className="text-sm text-organic-charcoal flex items-start gap-2">
                            <span className="text-organic-sand mt-0.5 shrink-0">•</span>
                            <span>{contribution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Social links */}
                  <div className="mb-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-organic-clay mb-3">
                      Connect
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(contributor.socials).map(([platform, url]) => {
                        const config = socialIcons[platform];
                        if (!config) return null;
                        const Icon = config.icon;
                        const platformLabel = platform === "twitter" ? "X" : platform.charAt(0).toUpperCase() + platform.slice(1);
                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${config.bg} ${config.color} ${config.border} ${config.hover}`}
                          >
                            <Icon size={12} />
                            {platformLabel}
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Share */}
                  <div className="border-t border-organic-stone/30 pt-4 mt-auto">
                    <button
                      onClick={() => shareContributor(contributor)}
                      className="flex items-center gap-2 text-xs font-medium text-organic-clay hover:text-primary-600 transition-colors group"
                    >
                      {copiedId === contributor.id ? (
                        <>
                          <Check size={14} className="text-green-600" />
                          <span className="text-green-600">Link copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 size={14} className="group-hover:scale-110 transition-transform" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-organic-stone/50 mt-8"
            >
              <span className="text-5xl block mb-4">🔍</span>
              <h3 className="text-2xl font-serif text-organic-charcoal mb-2">No contributors found.</h3>
              <p className="text-organic-clay">Try a different search or filter.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Built by footer */}
        {contributorsData.length > 0 && (
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-32 mb-8 pt-12 border-t border-organic-stone/30"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-organic-clay mb-8">
                Built by
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {contributorsData.map((c, idx) => (
                  <motion.span
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * idx }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-organic-stone/50 text-sm text-organic-charcoal hover:border-primary-300 hover:text-primary-700 transition-all shadow-sm"
                  >
                    {c.avatar ? (
                      <img src={c.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-[10px] font-bold">
                        {getInitials(c.name)}
                      </span>
                    )}
                    <span className="font-medium">{c.name}</span>
                    <ExternalLink size={10} className="text-organic-clay opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.span>
                ))}
              </div>
              <p className="text-xs text-organic-clay mt-6">
                These creators contribute resources, guides, and knowledge to help the community grow.
              </p>
            </div>
          </motion.footer>
        )}
      </motion.div>
    </>
  );
};

export default Contributors;
