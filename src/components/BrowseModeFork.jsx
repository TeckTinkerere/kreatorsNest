import { motion, useReducedMotion } from "framer-motion";
import { Compass, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBrowseMode } from "../context/BrowseModeContext";

const MODE_OPTIONS = [
  {
    mode: "guided",
    title: "Guided",
    headline: "Show me the path",
    description: "Role-based starter kit and essentials.",
    Icon: Map,
  },
  {
    mode: "explore",
    title: "Explore",
    headline: "I know my way around",
    description: "Curated picks and tools you might have missed.",
    Icon: Compass,
  },
];

const BrowseModeFork = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { setMode, dismissFork } = useBrowseMode();

  const handleModeSelect = (nextMode) => {
    if (nextMode === "guided") {
      setMode("guided", {
        onAfterSet: () => navigate("/starter-kit"),
      });
      return;
    }

    setMode("explore");
  };

  return (
    <section className="rounded-3xl border border-organic-stone bg-white p-6 md:p-8 shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 noise-bg opacity-20 pointer-events-none" />
      <div className="relative z-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600 mb-2">
          Choose your browse style
        </p>
        <h2 className="text-2xl md:text-3xl font-serif text-organic-charcoal">
          How do you want to explore KreatorNest?
        </h2>
        <p className="text-organic-clay mt-3 max-w-2xl">
          Pick a mode now, or decide later. You can switch anytime from the sidebar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {MODE_OPTIONS.map(({ mode, title, headline, description, Icon }) => (
            <motion.button
              key={mode}
              type="button"
              onClick={() => handleModeSelect(mode)}
              whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-left rounded-2xl border border-organic-stone bg-surface px-5 py-6 hover:border-primary-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 text-primary-700 mb-3">
                <Icon size={18} />
                <span className="text-xs font-bold uppercase tracking-[0.16em]">{title}</span>
              </div>
              <h3 className="text-xl font-serif text-organic-charcoal">{headline}</h3>
              <p className="mt-2 text-sm text-organic-clay">{description}</p>
            </motion.button>
          ))}
        </div>

        <button
          type="button"
          onClick={dismissFork}
          className="mt-6 text-sm font-semibold text-primary-700 hover:text-primary-900 underline underline-offset-4"
        >
          Decide later
        </button>
      </div>
    </section>
  );
};

export default BrowseModeFork;
