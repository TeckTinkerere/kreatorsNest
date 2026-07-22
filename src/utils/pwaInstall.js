/**
 * PWA install helpers — platform detection and early beforeinstallprompt bridge.
 *
 * Chromium (Android, Linux, Windows, ChromeOS): native beforeinstallprompt.
 * iPhone / iPad (Safari & all iOS browsers): manual Add to Home Screen only.
 */

const BRIDGE_KEY = '__kreatorNestPwa';
const INSTALLED_STORAGE_KEY = 'kreatornest-pwa-installed';

/**
 * Ensure the global install bridge exists (also seeded from index.html).
 * @returns {{ deferredPrompt: Event|null }}
 */
export function getPwaBridge() {
  if (typeof window === 'undefined') return { deferredPrompt: null };
  if (!window[BRIDGE_KEY]) {
    window[BRIDGE_KEY] = { deferredPrompt: null };
  }
  return window[BRIDGE_KEY];
}

/**
 * Persist that the user has installed the PWA (survives normal browser tabs).
 */
export function markPwaInstalled() {
  try {
    localStorage.setItem(INSTALLED_STORAGE_KEY, '1');
  } catch {
    // Private mode / blocked storage — ignore
  }
}

/**
 * Clear the persisted install flag (e.g. after Chromium reports uninstall).
 */
export function clearPwaInstalledMark() {
  try {
    localStorage.removeItem(INSTALLED_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * True when a previous install was recorded in localStorage.
 * @returns {boolean}
 */
function hasInstalledMark() {
  try {
    return localStorage.getItem(INSTALLED_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Whether the app is already running as an installed PWA (sync checks).
 * Covers: launched from icon, iOS home screen, and a prior install we recorded.
 * @returns {boolean}
 */
export function isPwaInstalled() {
  if (typeof window === 'undefined') return false;
  const standalone = window.matchMedia('(display-mode: standalone)').matches;
  const iosStandalone = window.navigator.standalone === true;
  const minimalUi = window.matchMedia('(display-mode: minimal-ui)').matches;
  if (standalone || iosStandalone || minimalUi) {
    markPwaInstalled();
    return true;
  }
  return hasInstalledMark();
}

/**
 * Async install check — also uses Chromium getInstalledRelatedApps when available.
 * @returns {Promise<boolean>}
 */
export async function checkPwaInstalled() {
  if (isPwaInstalled()) return true;

  if (typeof navigator !== 'undefined' && typeof navigator.getInstalledRelatedApps === 'function') {
    try {
      const apps = await navigator.getInstalledRelatedApps();
      if (Array.isArray(apps) && apps.length > 0) {
        markPwaInstalled();
        return true;
      }
    } catch {
      // Unsupported or blocked — fall through
    }
  }

  return hasInstalledMark();
}

/**
 * Detect the install surface for UX copy and actions.
 * @returns {{ id: 'ios'|'android'|'linux'|'desktop'|'unknown', label: string }}
 */
export function detectInstallPlatform() {
  if (typeof navigator === 'undefined') {
    return { id: 'unknown', label: 'this device' };
  }

  const ua = navigator.userAgent || '';
  // iPadOS 13+ reports as MacIntel with touch
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (isIOS) return { id: 'ios', label: 'iPhone / iPad' };

  if (/Android/i.test(ua)) return { id: 'android', label: 'Android' };

  if (/Linux/i.test(ua)) return { id: 'linux', label: 'Linux' };

  if (/Windows/i.test(ua) || /Macintosh|Mac OS X/i.test(ua)) {
    return { id: 'desktop', label: 'desktop' };
  }

  return { id: 'unknown', label: 'this device' };
}

/**
 * True when the browser can fire beforeinstallprompt (Chromium family).
 * iOS never supports this API.
 * @returns {boolean}
 */
export function supportsNativeInstallPrompt() {
  const { id } = detectInstallPlatform();
  if (id === 'ios') return false;
  return true;
}
