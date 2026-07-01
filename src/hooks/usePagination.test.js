import { usePagination } from './usePagination';

// usePagination is a pure-function hook (no React state / effects).
// We call it directly as a plain function in these tests — no renderHook needed.

describe('usePagination', () => {
  // ─── Small page counts (no ellipsis) ────────────────────────────────────────

  describe('when totalPages ≤ paginationItemsToDisplay', () => {
    it('returns every page number and no ellipsis', () => {
      const result = usePagination({ currentPage: 1, totalPages: 5 });
      expect(result.pages).toEqual([1, 2, 3, 4, 5]);
      expect(result.showLeftEllipsis).toBe(false);
      expect(result.showRightEllipsis).toBe(false);
    });

    it('handles a single page', () => {
      const result = usePagination({ currentPage: 1, totalPages: 1 });
      expect(result.pages).toEqual([1]);
      expect(result.showLeftEllipsis).toBe(false);
      expect(result.showRightEllipsis).toBe(false);
    });

    it('handles exactly paginationItemsToDisplay pages', () => {
      const result = usePagination({ currentPage: 4, totalPages: 7, paginationItemsToDisplay: 7 });
      expect(result.pages).toEqual([1, 2, 3, 4, 5, 6, 7]);
      expect(result.showLeftEllipsis).toBe(false);
      expect(result.showRightEllipsis).toBe(false);
    });
  });

  // ─── Large page counts (ellipsis logic) ─────────────────────────────────────

  describe('when totalPages > paginationItemsToDisplay', () => {
    const ITEMS = 5; // smaller window makes the tests easier to reason about

    it('shows right ellipsis only when near the start', () => {
      const result = usePagination({ currentPage: 1, totalPages: 20, paginationItemsToDisplay: ITEMS });
      expect(result.showLeftEllipsis).toBe(false);
      expect(result.showRightEllipsis).toBe(true);
    });

    it('shows left ellipsis only when near the end', () => {
      const result = usePagination({ currentPage: 20, totalPages: 20, paginationItemsToDisplay: ITEMS });
      expect(result.showLeftEllipsis).toBe(true);
      expect(result.showRightEllipsis).toBe(false);
    });

    it('shows both ellipses when in the middle', () => {
      const result = usePagination({ currentPage: 10, totalPages: 20, paginationItemsToDisplay: ITEMS });
      expect(result.showLeftEllipsis).toBe(true);
      expect(result.showRightEllipsis).toBe(true);
    });

    it('always includes the current page in the pages array', () => {
      [1, 5, 10, 15, 20].forEach((page) => {
        const result = usePagination({ currentPage: page, totalPages: 20, paginationItemsToDisplay: ITEMS });
        expect(result.pages).toContain(page);
      });
    });

    it('never returns more pages than paginationItemsToDisplay', () => {
      [1, 5, 10, 20].forEach((page) => {
        const result = usePagination({ currentPage: page, totalPages: 20, paginationItemsToDisplay: ITEMS });
        expect(result.pages.length).toBeLessThanOrEqual(ITEMS);
      });
    });

    it('returns only ascending page numbers with no duplicates', () => {
      const result = usePagination({ currentPage: 10, totalPages: 20, paginationItemsToDisplay: ITEMS });
      for (let i = 1; i < result.pages.length; i++) {
        expect(result.pages[i]).toBeGreaterThan(result.pages[i - 1]);
      }
      // No duplicates
      expect(new Set(result.pages).size).toBe(result.pages.length);
    });

    it('all returned page numbers are within [1, totalPages]', () => {
      const totalPages = 20;
      const result = usePagination({ currentPage: 10, totalPages, paginationItemsToDisplay: ITEMS });
      result.pages.forEach((p) => {
        expect(p).toBeGreaterThanOrEqual(1);
        expect(p).toBeLessThanOrEqual(totalPages);
      });
    });
  });

  // ─── Custom paginationItemsToDisplay ────────────────────────────────────────

  describe('respects custom paginationItemsToDisplay', () => {
    it('uses the provided value instead of the default (7)', () => {
      const result = usePagination({ currentPage: 1, totalPages: 10, paginationItemsToDisplay: 3 });
      expect(result.pages.length).toBeLessThanOrEqual(3);
    });

    it('defaults to 7 when not provided', () => {
      // 8 pages > default 7, so ellipsis should appear somewhere
      const result = usePagination({ currentPage: 5, totalPages: 8 });
      // With default 7 items and 8 total, we should have exactly 7 or fewer shown
      expect(result.pages.length).toBeLessThanOrEqual(7);
    });
  });

  // ─── Edge cases ─────────────────────────────────────────────────────────────

  describe('edge cases', () => {
    it('returns correct result when currentPage === totalPages', () => {
      const result = usePagination({ currentPage: 5, totalPages: 5 });
      expect(result.pages).toContain(5);
      expect(result.showRightEllipsis).toBe(false);
    });

    it('returns correct result when currentPage === 1', () => {
      const result = usePagination({ currentPage: 1, totalPages: 5 });
      expect(result.pages).toContain(1);
      expect(result.showLeftEllipsis).toBe(false);
    });
  });
});
