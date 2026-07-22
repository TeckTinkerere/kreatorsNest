import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, RefreshCw, WifiOff } from 'lucide-react';
import SEO from '../components/SEO';
import { isBrowserOnline, isExternalHttpUrl } from '../utils/connectivity';
import { pageTransition, pageVariants } from '../utils/motion';

/**
 * Parse a safe display host from a destination URL.
 * @param {string} raw
 * @returns {string|null}
 */
function destinationHost(raw) {
  if (!isExternalHttpUrl(raw)) return null;
  try {
    return new URL(raw).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * ConnectionRequired
 * Friendly interstitial shown when the user tries to open an external
 * (internet-only) page while the device is offline.
 */
const ConnectionRequired = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const destination = searchParams.get('to') || '';
  const host = destinationHost(destination);
  const [online, setOnline] = useState(isBrowserOnline);

  useEffect(() => {
    const sync = () => setOnline(isBrowserOnline());
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, []);

  /**
   * Open the original destination once connectivity returns.
   */
  const handleOpenDestination = () => {
    if (!destination || !isExternalHttpUrl(destination) || !isBrowserOnline()) return;
    window.open(destination, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <SEO
        title="Connection needed"
        description="This link opens a page on the internet. Connect to Wi‑Fi or mobile data to continue."
      />
      <motion.div
        variants={pageVariants(shouldReduceMotion)}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition(shouldReduceMotion)}
        className="relative min-h-[calc(100vh-4rem)] md:min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden"
      >
        {/* Atmosphere — soft organic wash, not flat */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, #E6EBE9 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 80% 100%, #E8E6DF 0%, transparent 50%), #FAF9F5',
          }}
        />
        <div className="absolute inset-0 noise-bg opacity-40" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-lg text-center">
          {/* Signature: nest thread that never quite reaches the web */}
          <div className="mx-auto mb-10 w-40 h-28 relative" aria-hidden="true">
            <svg viewBox="0 0 160 110" className="w-full h-full text-primary-700" fill="none">
              <ellipse cx="48" cy="78" rx="28" ry="14" className="stroke-organic-sand" strokeWidth="2" fill="#F5F7F6" />
              <path
                d="M28 78c6-10 14-16 20-16s14 6 20 16"
                className="stroke-primary-600"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="48" cy="72" r="3" className="fill-primary-700" />
              <path
                d="M76 68 C100 52, 118 40, 138 28"
                className="stroke-organic-clay"
                strokeWidth="1.75"
                strokeDasharray="4 5"
                strokeLinecap="round"
              />
              <circle cx="142" cy="24" r="10" className="stroke-organic-sand fill-white" strokeWidth="1.5" />
              <path d="M136 24h12M142 18v12" className="stroke-organic-clay" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600 mb-3">
            Offline · External page
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-organic-charcoal mb-4 leading-tight">
            This page lives on the internet
          </h1>
          <p className="text-organic-clay text-base md:text-lg leading-relaxed mb-2 max-w-md mx-auto">
            KreatorNest still works offline, but the link you opened needs a live connection.
            {host ? (
              <>
                {' '}
                Connect to Wi‑Fi or mobile data to reach{' '}
                <span className="font-semibold text-organic-charcoal">{host}</span>.
              </>
            ) : (
              <> Connect to Wi‑Fi or mobile data, then try again.</>
            )}
          </p>

          <div
            className={`mt-6 inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full border ${
              online
                ? 'bg-primary-50 text-primary-700 border-primary-100'
                : 'bg-organic-cream text-organic-clay border-organic-stone'
            }`}
            role="status"
            aria-live="polite"
          >
            {online ? (
              <>
                <RefreshCw size={14} aria-hidden="true" />
                You&apos;re back online
              </>
            ) : (
              <>
                <WifiOff size={14} aria-hidden="true" />
                No internet connection
              </>
            )}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-lg text-sm font-semibold text-organic-charcoal bg-white border border-organic-stone hover:border-organic-sand transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Go back
            </button>

            {online && isExternalHttpUrl(destination) ? (
              <button
                type="button"
                onClick={handleOpenDestination}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-lg text-sm font-semibold text-white bg-primary-700 hover:bg-primary-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Open link
                <span aria-hidden="true">→</span>
              </button>
            ) : (
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-lg text-sm font-semibold text-white bg-primary-700 hover:bg-primary-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Stay in the Nest
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ConnectionRequired;
