// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// ─── Global browser API stubs for jsdom ──────────────────────────────────────
// jsdom does not implement these APIs. Defining them here in setupTests ensures
// every test file gets them without repeating the boilerplate.

// window.matchMedia — used by Sidebar (PWA install check) and Framer Motion
// (prefers-reduced-motion). jsdom doesn't implement it fully.
// Unconditional assignment ensures we always get a working stub.
window.matchMedia = function mockMatchMedia(query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  };
};

// IntersectionObserver — used by Framer Motion's whileInView prop.
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// window.scrollTo — called by ScrollToTop component on route change.
// jsdom throws "not implemented" without this stub.
window.scrollTo = jest.fn();
