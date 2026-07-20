const STORAGE_KEY = 'kn-browse-mode';

export function readBrowseModeState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.v !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeBrowseModeState(partial) {
  const prev = readBrowseModeState() ?? { v: 1, forkDismissed: false };
  const next = {
    v: 1,
    mode: partial.mode ?? prev.mode ?? null,
    forkDismissed: partial.forkDismissed ?? prev.forkDismissed ?? false,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export { STORAGE_KEY };
