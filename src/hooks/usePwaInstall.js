import { useCallback, useEffect, useState } from 'react';
import {
  checkPwaInstalled,
  detectInstallPlatform,
  getPwaBridge,
  isPwaInstalled,
  markPwaInstalled,
  supportsNativeInstallPrompt,
} from '../utils/pwaInstall';

/**
 * usePwaInstall
 * Cross-platform install state: native Chromium prompt, iOS guide, or manual tips.
 * Hides install UI once the PWA is installed (standalone, related apps, or recorded).
 *
 * @returns {{
 *   isInstalled: boolean,
 *   canNativeInstall: boolean,
 *   platform: { id: string, label: string },
 *   needsManualGuide: boolean,
 *   promptNativeInstall: () => Promise<'accepted'|'dismissed'|'unavailable'>,
 * }}
 */
export function usePwaInstall() {
  const [isInstalled, setIsInstalled] = useState(() => isPwaInstalled());
  const [canNativeInstall, setCanNativeInstall] = useState(() => {
    const bridge = getPwaBridge();
    return Boolean(bridge.deferredPrompt);
  });
  const [platform] = useState(() => detectInstallPlatform());

  useEffect(() => {
    let cancelled = false;

    const syncInstalled = async () => {
      const installed = await checkPwaInstalled();
      if (!cancelled) setIsInstalled(installed);
    };

    syncInstalled();

    const mq = window.matchMedia('(display-mode: standalone)');
    const onDisplayMode = () => {
      if (isPwaInstalled()) setIsInstalled(true);
    };
    mq.addEventListener('change', onDisplayMode);

    const onAvailable = () => setCanNativeInstall(Boolean(getPwaBridge().deferredPrompt));
    const onInstalled = () => {
      getPwaBridge().deferredPrompt = null;
      markPwaInstalled();
      setCanNativeInstall(false);
      setIsInstalled(true);
    };

    onAvailable();

    window.addEventListener('pwa-install-available', onAvailable);
    window.addEventListener('pwa-installed', onInstalled);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      cancelled = true;
      mq.removeEventListener('change', onDisplayMode);
      window.removeEventListener('pwa-install-available', onAvailable);
      window.removeEventListener('pwa-installed', onInstalled);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const promptNativeInstall = useCallback(async () => {
    const bridge = getPwaBridge();
    const deferred = bridge.deferredPrompt;
    if (!deferred) return 'unavailable';

    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    bridge.deferredPrompt = null;
    setCanNativeInstall(false);
    if (outcome === 'accepted') {
      markPwaInstalled();
      setIsInstalled(true);
    }
    return outcome === 'accepted' ? 'accepted' : 'dismissed';
  }, []);

  const needsManualGuide =
    !isInstalled && (!canNativeInstall || platform.id === 'ios' || !supportsNativeInstallPrompt());

  return {
    isInstalled,
    canNativeInstall,
    platform,
    needsManualGuide,
    promptNativeInstall,
  };
}
