import { useReducedMotion } from 'framer-motion';

/**
 * PageLoader
 * Lightweight route-level fallback while lazy page chunks load.
 * Keeps the shell feeling continuous instead of a blank flash.
 */
const PageLoader = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto space-y-8"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="h-10 w-48 rounded-lg bg-organic-stone/60" />
      <div className="h-5 w-full max-w-xl rounded bg-organic-stone/40" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`min-h-[200px] rounded-2xl border border-organic-stone bg-white/70 ${
              shouldReduceMotion ? '' : 'animate-pulse'
            }`}
            style={shouldReduceMotion ? undefined : { animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
};

export default PageLoader;
