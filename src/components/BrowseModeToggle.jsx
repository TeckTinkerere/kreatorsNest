import { Map, Compass } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBrowseMode } from '../context/BrowseModeContext';
import { isRouteAvailable, MODE_HOME } from '../config/navigation';

export default function BrowseModeToggle({ isDesktopOpen = true }) {
  const { effectiveMode, setMode } = useBrowseMode();
  const navigate = useNavigate();
  const location = useLocation();
  const current = effectiveMode;

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
            className={`w-10 h-10 mx-auto flex items-center justify-center rounded-xl transition-colors ${
              current === mode
                ? 'bg-white text-primary-700 shadow-sm border border-organic-stone'
                : 'text-organic-clay hover:bg-organic-stone/50'
            }`}
          >
            <Icon size={18} />
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
      <div className="flex rounded-xl border border-organic-stone overflow-hidden" role="group" aria-label="Browse mode">
        {['guided', 'explore'].map((mode) => (
          <button
            key={mode}
            type="button"
            aria-pressed={current === mode}
            onClick={() => handleSelect(mode)}
            className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
              current === mode
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-organic-clay hover:bg-organic-stone/50'
            }`}
          >
            {mode === 'guided' ? 'Guided' : 'Explore'}
          </button>
        ))}
      </div>
    </div>
  );
}
