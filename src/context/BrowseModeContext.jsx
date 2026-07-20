import { createContext, useCallback, useContext, useMemo, useState, startTransition } from 'react';
import { readBrowseModeState, writeBrowseModeState } from '../hooks/useBrowseMode';

const BrowseModeContext = createContext(null);

export function BrowseModeProvider({ children }) {
  const [state, setState] = useState(() => readBrowseModeState());

  const setMode = useCallback((mode, options = {}) => {
    const next = writeBrowseModeState({ mode });
    startTransition(() => setState(next));
    options.onAfterSet?.(mode);
  }, []);

  const dismissFork = useCallback(() => {
    const next = writeBrowseModeState({ forkDismissed: true });
    setState(next);
  }, []);

  const value = useMemo(() => {
    const mode = state?.mode ?? null;
    const forkDismissed = state?.forkDismissed ?? false;
    const effectiveMode = mode ?? (forkDismissed ? 'explore' : 'explore');
    return {
      mode,
      isModeSet: mode === 'guided' || mode === 'explore',
      forkDismissed,
      effectiveMode,
      setMode,
      dismissFork,
    };
  }, [state, setMode, dismissFork]);

  return (
    <BrowseModeContext.Provider value={value}>
      {children}
    </BrowseModeContext.Provider>
  );
}

export function useBrowseMode() {
  const ctx = useContext(BrowseModeContext);
  if (!ctx) throw new Error('useBrowseMode must be used within BrowseModeProvider');
  return ctx;
}
