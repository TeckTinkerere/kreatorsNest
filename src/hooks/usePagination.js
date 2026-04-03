/**
 * usePagination — plain JS port of the shadcn pagination hook.
 * Adaptable: change paginationItemsToDisplay to control how many
 * page numbers show before ellipsis kicks in.
 */
export function usePagination({ currentPage, totalPages, paginationItemsToDisplay = 7 }) {
  const showLeftEllipsis = currentPage - 1 > paginationItemsToDisplay / 2;
  const showRightEllipsis = totalPages - currentPage + 1 > paginationItemsToDisplay / 2;

  function calculatePaginationRange() {
    if (totalPages <= paginationItemsToDisplay) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfDisplay = Math.floor(paginationItemsToDisplay / 2);
    let start = Math.max(1, currentPage - halfDisplay);
    let end = Math.min(totalPages, currentPage + halfDisplay);

    if (start === 1) end = paginationItemsToDisplay;
    if (end === totalPages) start = totalPages - paginationItemsToDisplay + 1;
    if (showLeftEllipsis) start++;
    if (showRightEllipsis) end--;

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  return {
    pages: calculatePaginationRange(),
    showLeftEllipsis,
    showRightEllipsis,
  };
}
