import { motion, useReducedMotion } from 'framer-motion';
import { Map, Compass } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBrowseMode } from '../context/BrowseModeContext';
import { isRouteAvailable, MODE_HOME } from '../config/navigation';
import { layoutSpring } from '../utils/motion';

export default function BrowseModeToggle({ isDesktopOpen = true }) {
  const { effectiveMode, setMode } = useBrowseMode();
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const current = effectiveMode;
  const spring = layoutSpring(shouldReduceMotion);

  const handleSelect = (mode) => {
    if (mode === current) return;
    setMode(mode, {
      onAfterSet: (nextMode) => {
        if (!isRouteAvailable(location.pathname, nextMode)) {
          navigate(MODE_HOME[nextMode], { replace: true });
        }
      },
    });
  };

  if (!isDesktopOpen) {
    return (
      <div className="flex flex-col gap-1 px-2" role="group" aria-label="Browse mode">
        {[
          { mode: 'guided', Icon: Map, label: 'Guided' },
          { mode: 'explore', Icon: Compass, label: 'Explore' },
        ].map(({ mode, Icon, label }) => (
          <button
            key={mode}
            type="button"
            title={`Browse as: ${label}`}
            aria-pressed={current === mode}
            onClick={() => handleSelect(mode)}
            className="relative w-10 h-10 mx-auto flex items-center justify-center rounded-xl text-organic-clay hover:bg-organic-stone/50"
          >
            {current === mode && (
              <motion.span
                layoutId="browse-mode-pill-collapsed"
                className="absolute inset-0 rounded-xl bg-white shadow-sm border border-organic-stone"
                transition={spring}
              />
            )}
            <Icon size={18} className={`relative z-10 ${current === mode ? 'text-primary-700' : ''}`} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="px-3">
      <p className="text-xs font-semibold text-organic-clay uppercase tracking-wider mb-2 px-1">
        Browse as
      </p>
      <div
        className="relative flex rounded-xl border border-organic-stone overflow-hidden bg-organic-stone/20"
        role="group"
        aria-label="Browse mode"
      >
        {['guided', 'explore'].map((mode) => {
          const isActive = current === mode;
          return (
            <button
              key={mode}
              type="button"
              aria-pressed={isActive}
              onClick={() => handleSelect(mode)}
              className={`relative flex-1 py-2 text-sm font-medium capitalize z-10 transition-colors ${
                isActive ? 'text-primary-700' : 'text-organic-clay hover:text-organic-charcoal'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="browse-mode-pill"
                  className="absolute inset-0 bg-white shadow-sm"
                  transition={spring}
                />
              )}
              <span className="relative z-10">{mode === 'guided' ? 'Guided' : 'Explore'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
