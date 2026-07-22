import { useRef, useState } from 'react';
import { Download, Plus, Share, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { usePwaInstall } from '../hooks/usePwaInstall';

/**
 * Step copy for platforms that cannot use beforeinstallprompt.
 * @param {string} platformId
 * @returns {{ title: string, steps: string[] }}
 */
function guideForPlatform(platformId) {
  switch (platformId) {
    case 'ios':
      return {
        title: 'Add KreatorNest to your Home Screen',
        steps: [
          'Tap the Share button in Safari (square with an arrow).',
          'Scroll and tap “Add to Home Screen”.',
          'Tap “Add” — KreatorNest opens like an app, even offline.',
        ],
      };
    case 'android':
      return {
        title: 'Install KreatorNest on Android',
        steps: [
          'Open this site in Chrome.',
          'Tap the menu (⋮) → “Install app” or “Add to Home screen”.',
          'Confirm Install — the app icon appears on your home screen.',
        ],
      };
    case 'linux':
      return {
        title: 'Install KreatorNest on Linux',
        steps: [
          'Use Chrome, Chromium, Edge, or Brave (Firefox has limited PWA install).',
          'Look for the install icon in the address bar, or menu → “Install KreatorNest…”.',
          'Confirm — the app is added to your app launcher / dock.',
        ],
      };
    default:
      return {
        title: 'Install KreatorNest',
        steps: [
          'Open this site in Chrome, Edge, or Chromium.',
          'Click the install icon in the address bar, or menu → “Install app”.',
          'Confirm — KreatorNest runs in its own window.',
        ],
      };
  }
}

/**
 * PwaInstallButton
 * Works on iPhone (guided A2HS), Android & Linux Chromium (native prompt),
 * and falls back to clear manual steps when the browser has no install API.
 *
 * @param {object} props
 * @param {boolean} [props.expanded=true] - Show label text (desktop expanded sidebar)
 * @param {'mobile'|'desktop'} [props.variant='desktop']
 */
const PwaInstallButton = ({ expanded = true, variant = 'desktop' }) => {
  const {
    isInstalled,
    canNativeInstall,
    platform,
    promptNativeInstall,
  } = usePwaInstall();
  const [guideOpen, setGuideOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const dialogRef = useRef(null);
  useFocusTrap(dialogRef, guideOpen);

  if (isInstalled) return null;

  const guide = guideForPlatform(platform.id);

  const handleClick = async () => {
    if (canNativeInstall) {
      const outcome = await promptNativeInstall();
      if (outcome === 'unavailable') setGuideOpen(true);
      return;
    }
    setGuideOpen(true);
  };

  const label = canNativeInstall ? 'Install App' : 'Install App';
  const title =
    canNativeInstall
      ? 'Install KreatorNest'
      : platform.id === 'ios'
        ? 'Add to Home Screen'
        : `How to install on ${platform.label}`;

  const buttonClass =
    variant === 'mobile'
      ? 'w-full flex items-center justify-center gap-2 p-3 rounded-xl font-semibold transition-colors bg-primary-600 hover:bg-primary-700 text-white cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800'
      : `flex items-center justify-center gap-2 p-2.5 rounded-xl font-semibold transition-all shadow-sm bg-organic-charcoal hover:bg-black text-organic-cream cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
          expanded ? 'w-full' : 'w-10 h-10 p-0 mx-auto'
        }`;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title={title}
        aria-haspopup="dialog"
        aria-expanded={guideOpen}
        className={buttonClass}
      >
        <Download size={18} className="shrink-0" aria-hidden="true" />
        {expanded && (
          <span className="overflow-hidden whitespace-nowrap text-sm">{label}</span>
        )}
      </button>

      <AnimatePresence>
        {guideOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
            <motion.button
              type="button"
              aria-label="Close install guide"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-organic-charcoal/40 backdrop-blur-sm"
              onClick={() => setGuideOpen(false)}
            />
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="pwa-install-title"
              tabIndex={-1}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-md bg-organic-cream border border-organic-stone rounded-2xl shadow-xl p-6 outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Escape') setGuideOpen(false);
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-600 mb-1">
                    {platform.label}
                  </p>
                  <h2 id="pwa-install-title" className="font-serif text-xl text-organic-charcoal leading-snug">
                    {guide.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setGuideOpen(false)}
                  className="p-2 rounded-full border border-organic-stone bg-white text-organic-charcoal hover:bg-organic-stone/40 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {platform.id === 'ios' && (
                <div className="mb-5 flex items-center justify-center gap-3 text-primary-700" aria-hidden="true">
                  <Share size={22} />
                  <span className="text-organic-clay">→</span>
                  <Plus size={22} className="rounded border border-primary-300 p-0.5" />
                </div>
              )}

              <ol className="space-y-3 text-left mb-6">
                {guide.steps.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm text-organic-clay leading-relaxed">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              <button
                type="button"
                onClick={() => setGuideOpen(false)}
                className="w-full min-h-[44px] rounded-xl bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PwaInstallButton;
