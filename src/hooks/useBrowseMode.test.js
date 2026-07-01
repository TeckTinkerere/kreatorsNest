import { renderHook, act } from '@testing-library/react';
import { BrowseModeProvider, useBrowseMode } from '../context/BrowseModeContext';

const STORAGE_KEY = 'kn-browse-mode';

const wrapper = ({ children }) => (
  <BrowseModeProvider>{children}</BrowseModeProvider>
);

beforeEach(() => {
  localStorage.clear();
});

test('starts with null mode when storage empty', () => {
  const { result } = renderHook(() => useBrowseMode(), { wrapper });
  expect(result.current.mode).toBeNull();
  expect(result.current.isModeSet).toBe(false);
});

test('setMode persists guided to localStorage', () => {
  const { result } = renderHook(() => useBrowseMode(), { wrapper });
  act(() => result.current.setMode('guided'));
  expect(result.current.mode).toBe('guided');
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
  expect(stored.v).toBe(1);
  expect(stored.mode).toBe('guided');
});

test('dismissFork sets forkDismissed without setting mode', () => {
  const { result } = renderHook(() => useBrowseMode(), { wrapper });
  act(() => result.current.dismissFork());
  expect(result.current.forkDismissed).toBe(true);
  expect(result.current.mode).toBeNull();
  expect(result.current.effectiveMode).toBe('explore');
});

test('ignores invalid storage version', () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 0, mode: 'guided' }));
  const { result } = renderHook(() => useBrowseMode(), { wrapper });
  expect(result.current.mode).toBeNull();
});
