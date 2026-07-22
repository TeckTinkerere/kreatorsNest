import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  connectionRequiredPath,
  isBrowserOnline,
  isExternalHttpUrl,
} from '../utils/connectivity';

/**
 * ExternalLinkGuard
 * Intercepts external http(s) navigations while offline and routes to
 * /connection-required instead of a failed browser load.
 *
 * Covers: <a href> clicks (capture) and window.open calls.
 */
const ExternalLinkGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Redirect to the connection-required page for an external URL.
     * @param {string} url
     */
    const gateExternal = (url) => {
      navigate(connectionRequiredPath(url));
    };

    /**
     * Capture-phase click handler for external anchors.
     * @param {MouseEvent} event
     */
    const handleClick = (event) => {
      if (event.defaultPrevented) return;
      // Allow modified clicks (new tab / download) only when online
      if (event.button !== 0) return;

      const anchor = event.target instanceof Element
        ? event.target.closest('a[href]')
        : null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!isExternalHttpUrl(href)) return;
      if (isBrowserOnline()) return;

      event.preventDefault();
      event.stopPropagation();
      gateExternal(href);
    };

    const originalOpen = window.open.bind(window);

    /**
     * Wrap window.open so share / programmatic external opens are gated too.
     * @param {string|URL|undefined} url
     * @param {...*} rest
     */
    window.open = (url, ...rest) => {
      const href = typeof url === 'string' ? url : url?.toString?.() ?? '';
      if (href && isExternalHttpUrl(href) && !isBrowserOnline()) {
        gateExternal(href);
        return null;
      }
      return originalOpen(url, ...rest);
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.open = originalOpen;
    };
  }, [navigate]);

  return null;
};

export default ExternalLinkGuard;
