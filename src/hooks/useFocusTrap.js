import { useEffect } from 'react';

/**
 * FOCUSABLE_SELECTORS
 * CSS selector string that matches all natively focusable elements.
 * Excludes disabled and hidden elements.
 */
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary',
].join(', ');

/**
 * useFocusTrap
 * Traps keyboard focus inside `containerRef` while `isActive` is true.
 *
 * Behaviour:
 * - On activation, moves focus to the first focusable element inside the container.
 * - Tab cycles forward through focusable children; wraps from last → first.
 * - Shift+Tab cycles backward; wraps from first → last.
 * - On deactivation, restores focus to the element that was focused before activation.
 *
 * @param {React.RefObject<HTMLElement>} containerRef - The element to trap focus within.
 * @param {boolean} isActive - Whether the trap is currently engaged.
 */
export function useFocusTrap(containerRef, isActive) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    // Remember who had focus before the trap activated so we can restore it
    const previouslyFocused = document.activeElement;

    const getFocusable = () =>
      Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS)).filter(
        (el) => !el.closest('[hidden]') && el.offsetParent !== null
      );

    // Move focus into the container
    const focusable = getFocusable();
    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      // No focusable children — focus the container itself as a fallback
      container.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const focusableNow = getFocusable();
      if (focusableNow.length === 0) return;

      const first = focusableNow[0];
      const last = focusableNow[focusableNow.length - 1];

      if (e.shiftKey) {
        // Shift+Tab — if we're on the first element, wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab — if we're on the last element, wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to whatever element was focused before the trap
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [isActive, containerRef]);
}
