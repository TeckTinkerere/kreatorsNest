/**
 * Connectivity helpers for PWA external-link gating.
 */

/**
 * Whether the browser reports an active network connection.
 * Uses navigator.onLine — the standard signal for offline UX gates.
 *
 * @returns {boolean}
 */
export function isBrowserOnline() {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine !== false;
}

/**
 * True when href points to an http(s) URL on a different origin.
 * Skips mailto, tel, hash, relative, and same-origin links.
 *
 * @param {string|null|undefined} href
 * @returns {boolean}
 */
export function isExternalHttpUrl(href) {
  if (!href || typeof href !== 'string') return false;

  const trimmed = href.trim();
  if (!trimmed) return false;
  if (
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('javascript:')
  ) {
    return false;
  }

  if (typeof window === 'undefined') return false;

  try {
    const url = new URL(trimmed, window.location.href);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Build the in-app path for the connection-required interstitial.
 *
 * @param {string} destinationUrl - External URL the user tried to open.
 * @returns {string}
 */
export function connectionRequiredPath(destinationUrl) {
  const params = new URLSearchParams();
  params.set('to', destinationUrl);
  return `/connection-required?${params.toString()}`;
}
