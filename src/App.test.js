import { render, screen } from '@testing-library/react';
import App from './App';

// Global browser API stubs (matchMedia, IntersectionObserver, scrollTo) live in setupTests.js.

// IndexedDB stub — useRecommendations opens a DB on mount.
// Must be defined before render() so the hook finds it immediately.
beforeAll(() => {
  const mockStore = {
    getAll: () => {
      const req = {};
      // Resolve asynchronously to mimic real IndexedDB
      Promise.resolve().then(() => {
        if (req.onsuccess) req.onsuccess({ target: { result: [] } });
      });
      return req;
    },
    get: () => {
      const req = {};
      Promise.resolve().then(() => {
        if (req.onsuccess) req.onsuccess({ target: { result: undefined } });
      });
      return req;
    },
    put: jest.fn(),
  };

  const mockDB = {
    objectStoreNames: { contains: () => true },
    transaction: () => ({
      objectStore: () => mockStore,
      oncomplete: null,
    }),
    close: jest.fn(),
  };

  global.indexedDB = {
    open: () => {
      const req = { onupgradeneeded: null, onsuccess: null, onerror: null };
      // Resolve on next microtask tick so the hook's useEffect can register handlers first
      Promise.resolve().then(() => {
        if (req.onsuccess) req.onsuccess({ target: { result: mockDB } });
      });
      return req;
    },
  };
});

// ─── Tests ────────────────────────────────────────────────────────────────────

/**
 * Smoke test: the app shell mounts without crashing and renders the home page.
 * The Sidebar renders its own <h1> (brand name) so we use getAllByRole
 * and verify at least one heading is present.
 */
test('renders the home page headings', () => {
  render(<App />);
  // Both the sidebar brand name and the hero heading are h1 elements
  const headings = screen.getAllByRole('heading', { level: 1 });
  expect(headings.length).toBeGreaterThanOrEqual(1);
});

/**
 * Smoke test: the hero copy is present on the home page.
 */
test('renders the hero section tagline', () => {
  render(<App />);
  // The hero always contains this static text
  expect(screen.getByText(/The Freelancer's Companion/i)).toBeInTheDocument();
});

/**
 * Smoke test: navigation links are present in the DOM.
 */
test('renders sidebar navigation links', () => {
  render(<App />);
  // Explore mode is the default, so the first primary nav label is Discover.
  const discoverLinks = screen.getAllByRole('link', { name: /discover/i });
  expect(discoverLinks.length).toBeGreaterThan(0);
});
