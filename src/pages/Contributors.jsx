import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Instagram, Twitter, Linkedin, Video, Users, ChevronRight, Mail, Filter } from 'lucide-react';
import contributorsData from '../data/contributors.json';

const FILTERS = ["All", "YouTube", "Instagram", "Twitter", "TikTok", "LinkedIn"];

const socialIcons = {
  youtube: { icon: Youtube, color: "text-red-600", bg: "bg-red-50", border: "border-red-100", hover: "hover:bg-red-100" },
  instagram: { icon: Instagram, color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-100", hover: "hover:bg-pink-100" },
  twitter: { icon: Twitter, color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-100", hover: "hover:bg-sky-100" },
  tiktok: { icon: Video, color: "text-organic-charcoal", bg: "bg-organic-stone/30", border: "border-organic-stone", hover: "hover:bg-organic-stone/50" },
  linkedin: { icon: Linkedin, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-100", hover: "hover:bg-blue-100" }
};

const Contributors = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const counts = useMemo(() => {
    const stats = { All: contributorsData.length };
    FILTERS.forEach(f => {
      if (f === "All") return;
      stats[f] = contributorsData.filter(c => c.socials[f.toLowerCase()]).length;
    });
    return stats;
  }, []);

  const filteredContributors = useMemo(() => {
    if (activeFilter === "All") return contributorsData;
    const platformKey = activeFilter.toLowerCase();
    return contributorsData.filter(c => c.socials[platformKey]);
  }, [activeFilter]);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto min-h-screen relative overflow-hidden"
    >
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/30 rounded-full blur-[100px] -z-10" />

      {/* Header Section - Normalized Sizing */}
      <motion.div variants={itemVariants} className="pt-10 md:pt-16 mb-12 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm">
          <Users size={12} />
          Community
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-organic-charcoal mb-6 leading-[1.1] tracking-tight">
          The <span className="italic text-primary-600">Minds</span> Behind the Nest.
        </h1>
        <p className="text-lg md:text-xl text-organic-clay leading-relaxed max-w-2xl font-light">
          A collective of creators, makers, and strategists sharing knowledge to elevate the freelance ecosystem.
        </p>
      </motion.div>

      {/* Filter Bar - Consistent with ResourceHub */}
      <motion.div 
        variants={itemVariants}
        className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 md:mx-0 md:px-0 border-b border-organic-stone/30 mb-10"
      >
        <div className="flex overflow-x-auto hide-scrollbar gap-2 py-4">
          <div className="hidden md:flex items-center gap-2 mr-2 border-r border-organic-stone/50 pr-4">
            <Filter size={14} className="text-organic-clay" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-organic-clay">Filter</span>
          </div>
          {FILTERS.map((filter) => {
            const platformKey = filter.toLowerCase();
            const socialConfig = socialIcons[platformKey];
            const isActive = activeFilter === filter;
            const count = counts[filter];

            if (count === 0 && filter !== "All") return null;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-2 border ${
                  isActive
                    ? "bg-organic-charcoal text-white border-organic-charcoal shadow-md"
                    : "bg-white text-organic-clay hover:text-organic-charcoal border-organic-stone hover:bg-organic-stone/20"
                }`}
              >
                {filter !== "All" && socialConfig && (
                  <socialConfig.icon size={14} className={isActive ? "text-white" : socialConfig.color} />
                )}
                {filter === "All" && <Users size={14} />}
                <span>{filter}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-organic-stone text-organic-clay"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {filteredContributors.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {filteredContributors.map((contributor) => (
              <motion.div
                key={contributor.id}
                layout
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col bg-white border border-organic-stone/50 shadow-sm hover:shadow-md transition-all duration-500 rounded-tl-3xl rounded-br-3xl rounded-tr-xl rounded-bl-xl overflow-hidden p-6 md:p-8"
              >
                {/* Organic texture overlay */}
                <div className="absolute inset-0 noise-bg z-0 opacity-20 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative shrink-0">
                      {contributor.avatar ? (
                        <img
                          src={contributor.avatar}
                          alt={contributor.name}
                          className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover border border-organic-stone shadow-sm"
                        />
                      ) : (
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-organic-cream flex items-center justify-center text-primary-700 font-serif font-bold text-lg md:text-xl border border-organic-stone shadow-sm">
                          {getInitials(contributor.name)}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-organic-stone flex items-center justify-center shadow-sm">
                        <span className="text-[10px]">✨</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl font-serif text-organic-charcoal leading-tight group-hover:text-primary-700 transition-colors">
                        {contributor.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-primary-600 mt-1">
                        <span className="w-1 h-1 rounded-full bg-primary-600 animate-pulse"></span>
                        <span className="text-[9px] font-bold uppercase tracking-widest">Active Member</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-organic-clay text-sm leading-relaxed mb-6 italic font-light line-clamp-3">
                    "{contributor.bio}"
                  </p>

                  {contributor.contributions && contributor.contributions.length > 0 && (
                    <div className="mb-6 flex-grow">
                      <h4 className="text-[9px] font-bold uppercase tracking-widest text-organic-sand mb-3 flex items-center gap-2">
                        <span className="w-4 h-px bg-organic-sand"></span>
                        Contributions
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {contributor.contributions.map((contribution, idx) => (
                          <span 
                            key={idx} 
                            className="text-[10px] font-medium text-organic-charcoal bg-organic-stone/20 px-2.5 py-1 rounded-lg border border-organic-stone/30"
                          >
                            {contribution}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-6 border-t border-organic-stone/30 flex items-center justify-between">
                    <div className="flex gap-2">
                      {Object.entries(contributor.socials).map(([platform, url]) => {
                        const config = socialIcons[platform];
                        if (!config) return null;
                        const Icon = config.icon;
                        return (
                          <motion.a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -2, scale: 1.1 }}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-300 ${config.bg} ${config.color} ${config.border} hover:shadow-sm`}
                            title={platform}
                          >
                            <Icon size={14} />
                          </motion.a>
                        );
                      })}
                    </div>
                    
                    <button className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-organic-clay hover:text-primary-700 transition-colors group/btn">
                      <span>View Bio</span>
                      <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-organic-stone mt-8 text-center px-6"
          >
            <div className="w-16 h-16 rounded-full bg-organic-stone/20 flex items-center justify-center mb-6 text-3xl">
              🔭
            </div>
            <h3 className="text-2xl font-serif text-organic-charcoal mb-2">No creators found.</h3>
            <p className="text-organic-clay max-w-sm mx-auto text-sm">
              Try a different filter or check back later.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer CTA - Normalized Sizing */}
      <motion.div 
        variants={itemVariants}
        className="mt-24 mb-12 p-10 md:p-20 bg-organic-charcoal rounded-3xl text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 noise-bg opacity-10"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
            Join the <span className="italic text-primary-400">Collective.</span>
          </h2>
          <p className="text-organic-sand mb-10 max-w-xl mx-auto font-light text-sm md:text-lg leading-relaxed">
            Kreator's Nest is built by the community. Share your resources and knowledge with the next generation of creators.
          </p>
          <a 
            href="mailto:hello@kreatornest.com" 
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-organic-charcoal rounded-full font-bold text-base hover:bg-primary-50 transition-all shadow-xl shadow-white/5"
          >
            <Mail size={18} />
            <span>Apply to Contribute</span>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Contributors;
