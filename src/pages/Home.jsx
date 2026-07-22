import { useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useBrowseMode } from "../context/BrowseModeContext";
import { resourceData } from "../data/resources";
import { useRecommendations } from "../hooks/useRecommendations";
import { getTieredHomeSlice } from "../utils/tierFilters";
import {
  contentTransition,
  contentVariants,
  pageTransition,
  pageVariants,
} from "../utils/motion";
import BrowseModeFork from "../components/BrowseModeFork";
import ResourceCard from "../components/ResourceCard";
import SEO from "../components/SEO";

const STARTER_ROLES = [
  "Visual Communication",
  "Motion Graphics",
  "UX/UI & Web Design",
  "Animation & 3D Arts",
  "Media Production",
  "Photography",
  "Video Editing",
  "Videography",
];

/**
 * Home
 * Mode-aware home page with first-visit fork, guided essentials, and explore picks.
 */
const Home = () => {
  const shouldReduceMotion = useReducedMotion();
  const { recommendations, isReady, trackInteraction } = useRecommendations();
  const { mode, isModeSet, forkDismissed, effectiveMode } = useBrowseMode();

  const showFork = !isModeSet && !forkDismissed;
  const showGuidedHome = !showFork && (mode === "guided" || effectiveMode === "guided");
  const showExploreHome = !showFork && !showGuidedHome;

  const essentials = useMemo(() => getTieredHomeSlice(resourceData, "essential", 4), []);
  const curatorPicks = useMemo(() => getTieredHomeSlice(resourceData, "pro", 3), []);
  const hiddenGems = useMemo(() => getTieredHomeSlice(resourceData, "hidden-gem", 6), []);

  const containerVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      };

  const itemVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      };

  const routeVariants = pageVariants(shouldReduceMotion);
  const swapVariants = contentVariants(shouldReduceMotion);
  const homeViewKey = showFork
    ? "fork"
    : showGuidedHome
      ? "guided"
      : showExploreHome
        ? "explore"
        : "fallback";

  return (
    <>
      <SEO title="Home" description="Curated resources, tools, templates, and community for creative freelancers. Level up your freelance career with KreatorNest." />
      <motion.div
        variants={routeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition(shouldReduceMotion)}
        className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto space-y-20 overflow-hidden"
      >
      <motion.div
        variants={containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
      >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="pt-10 md:pt-20 pb-8 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-[100px] -z-10 opacity-60"></div>
        <p className="text-sm font-semibold tracking-widest text-primary-600 uppercase mb-4 pl-1">
          The Freelancer's Companion
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-organic-charcoal leading-[1.1] mb-6 max-w-4xl">
          Crafting tools & knowledge for the <span className="italic text-primary-600">modern creative</span>.
        </h1>
        <p className="text-lg md:text-xl text-organic-clay max-w-2xl leading-relaxed">
          Break out of the generic templates. Access curated, high-quality resources engineered specifically for early-career independent workers.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {showFork && (
          <motion.div
            key="fork"
            variants={swapVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={contentTransition(shouldReduceMotion)}
          >
            <BrowseModeFork />
          </motion.div>
        )}

        {showGuidedHome && (
          <motion.div
            key="guided"
            variants={swapVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={contentTransition(shouldReduceMotion)}
            className="space-y-12 pb-20"
          >
            <section>
              <div className="flex items-end justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-3xl font-serif text-organic-charcoal">Start with your role</h2>
                  <p className="text-organic-clay mt-2">Pick a path and jump straight into your Starter Kit.</p>
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {STARTER_ROLES.map((role) => (
                  <Link
                    key={role}
                    to={`/starter-kit?role=${encodeURIComponent(role)}`}
                    className="whitespace-nowrap px-4 py-2 rounded-full border border-organic-stone bg-white text-xs md:text-sm font-semibold text-organic-charcoal hover:border-primary-300 hover:text-primary-700 transition-colors"
                  >
                    {role}
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-serif text-organic-charcoal">Start with these</h2>
                  <p className="text-organic-clay mt-2">Essential resources for your first milestones.</p>
                </div>
                <Link to="/essentials" className="text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors">
                  View all essentials →
                </Link>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
                {essentials.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} onInteract={trackInteraction} variant="compact" />
                ))}
              </div>
            </section>

            <Link
              to="/documents"
              className="block rounded-3xl border border-organic-stone bg-white p-6 md:p-8 hover:border-primary-300 transition-colors"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-600 mb-2">Documents</p>
              <h3 className="text-2xl font-serif text-organic-charcoal">Contracts, invoices, and proposal templates</h3>
              <p className="text-organic-clay mt-2 max-w-2xl">
                Grab ready-to-use documents and adapt them quickly for client work.
              </p>
            </Link>
          </motion.div>
        )}

        {showExploreHome && (
          <motion.div
            key="explore"
            variants={swapVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={contentTransition(shouldReduceMotion)}
            className="space-y-14 pb-20"
          >
            <section className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-serif text-organic-charcoal">Curator&apos;s Picks</h2>
                  <p className="text-organic-clay mt-2">Hand-picked resources from the pro tier.</p>
                </div>
                <Link to="/resources?tab=learning" className="text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors">
                  Explore resources →
                </Link>
              </div>

              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                {curatorPicks.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} onInteract={trackInteraction} />
                ))}
              </div>
            </section>

            <section className="relative z-10">
              <div className="mb-8">
                <h2 className="text-3xl font-serif text-organic-charcoal">Hidden Gems</h2>
                <p className="text-organic-clay mt-2">Useful finds you might have missed.</p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                {hiddenGems.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} onInteract={trackInteraction} />
                ))}
              </div>
            </section>

            {!isReady && (
              <section className="relative z-10" aria-busy="true" aria-label="Loading recommendations">
                <div className="h-8 w-32 rounded-lg bg-organic-stone/50 mb-3" />
                <div className="h-4 w-64 rounded bg-organic-stone/30 mb-8" />
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`min-h-[200px] rounded-2xl border border-organic-stone bg-white/80 ${
                        shouldReduceMotion ? '' : 'animate-pulse'
                      }`}
                    />
                  ))}
                </div>
              </section>
            )}

            {isReady && recommendations.length > 0 && (
              <section className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-3xl font-serif text-organic-charcoal">For you</h2>
                    <p className="text-organic-clay mt-2">Curated from your recent reading history.</p>
                  </div>
                  <Link to="/resources?tab=tools" className="text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors">
                    View all resources →
                  </Link>
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                  {recommendations.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} onInteract={trackInteraction} />
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}

        {homeViewKey === "fallback" && (
          <motion.div
            key="fallback"
            variants={swapVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={contentTransition(shouldReduceMotion)}
            className="pb-20"
          >
            <div className="rounded-3xl border border-organic-stone bg-white p-6 md:p-8">
              <h2 className="text-2xl font-serif text-organic-charcoal">Start exploring</h2>
              <p className="text-organic-clay mt-2">
                Choose a browse mode from the sidebar toggle to personalize your home view.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
      </motion.div>
    </>
  );
};

export default Home;
