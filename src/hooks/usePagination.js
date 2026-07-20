/**
 * usePagination
 * Calculates the visible pagination range and whether ellipsis indicators
 * should appear on the left/right side of the page number strip.
 *
 * Ellipsis logic only applies when totalPages > paginationItemsToDisplay.
 * When all pages fit within the display window neither ellipsis is shown.
 *
 * @param {object} params
 * @param {number} params.currentPage - The currently active page (1-indexed)
 * @param {number} params.totalPages - Total number of pages
 * @param {number} [params.paginationItemsToDisplay=7] - Max page numbers visible at once
 * @returns {{ pages: number[], showLeftEllipsis: boolean, showRightEllipsis: boolean }}
 */
export function usePagination({ currentPage, totalPages, paginationItemsToDisplay = 7 }) {
  // Ellipsis is only relevant when there are more pages than the display window
  const needsTruncation = totalPages > paginationItemsToDisplay;

  const showLeftEllipsis  = needsTruncation && currentPage - 1 > paginationItemsToDisplay / 2;
  const showRightEllipsis = needsTruncation && totalPages - currentPage + 1 > paginationItemsToDisplay / 2;

  function calculatePaginationRange() {
    // All pages fit — show everything
    if (!needsTruncation) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfDisplay = Math.floor(paginationItemsToDisplay / 2);
    let start = Math.max(1, currentPage - halfDisplay);
    let end   = Math.min(totalPages, currentPage + halfDisplay);

    // Pin to start: ensure we show a full window from page 1
    if (start === 1) end = paginationItemsToDisplay;
    // Pin to end: ensure we show a full window ending at totalPages
    if (end === totalPages) start = totalPages - paginationItemsToDisplay + 1;

    // Shrink range by one on each side where an ellipsis will appear
    // (the ellipsis component renders the boundary page separately)
    if (showLeftEllipsis)  start++;
    if (showRightEllipsis) end--;

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  return {
    pages: calculatePaginationRange(),
    showLeftEllipsis,
    showRightEllipsis,
  };
}
