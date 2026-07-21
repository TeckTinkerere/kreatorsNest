import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Download, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { getNavForMode } from '../config/navigation';
import { useBrowseMode } from '../context/BrowseModeContext';
import BrowseModeToggle from './BrowseModeToggle';
import { NAV_ICONS } from '../utils/navIcons';
import { contentTransition, contentVariants } from '../utils/motion';

const mobileSidebarVariants = {
  open: { x: 0, transition: { type: "tween", ease: "circOut", duration: 0.3 } },
  closed: { x: "-100%", transition: { type: "tween", ease: "circIn", duration: 0.2 } }
};

/**
 * Sidebar
 * Responsive navigation sidebar with mobile drawer and desktop collapsible variants.
 *
 * @param {object} props
 * @param {boolean} props.isDesktopOpen - Whether the desktop sidebar is expanded
 * @param {function} props.setIsDesktopOpen - Setter for desktop sidebar open state
 */
const Sidebar = ({ isDesktopOpen, setIsDesktopOpen }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { effectiveMode } = useBrowseMode();
  const navItems = getNavForMode(effectiveMode);
  const navSwap = contentVariants(shouldReduceMotion);
  const location = useLocation();
  // Ref for the mobile drawer — used by useFocusTrap
  const mobileDrawerRef = useRef(null);
  // Trap focus inside the mobile drawer while it's open (WCAG 2.1 §F79)
  useFocusTrap(mobileDrawerRef, isMobileOpen);

  // Check if already installed
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
    }
    const handler = (e) => setIsInstalled(e.matches);
    const mq = window.matchMedia('(display-mode: standalone)');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Handle body scroll locking for mobile (html only — avoid double scrollbars)
  useEffect(() => {
    const root = document.documentElement;
    if (isMobileOpen) {
      root.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      root.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      root.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  // Handle PWA Installation event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setIsMobileOpen(false);
  };

  return (
    <>
      <button
        aria-label={isMobileOpen ? "Close sidebar" : "Open sidebar"}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-full bg-white text-organic-charcoal shadow hover:shadow-md border border-organic-stone md:hidden transition-shadow"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-organic-charcoal/20 backdrop-blur-sm z-30 md:hidden" 
            />
            <motion.aside
              key="mobile-sidebar"
              ref={mobileDrawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
              tabIndex={-1}
              onKeyDown={handleKeyDown}
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileSidebarVariants}
              className="fixed inset-y-0 left-0 w-64 bg-organic-cream text-organic-charcoal p-5 z-40 shadow-2xl overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col md:hidden"
            >
              <div className="mb-8 shrink-0">
                {/* Clearance for fixed close button (top-4 left-4) */}
                <div className="h-14 shrink-0" aria-hidden="true" />
                <div className="flex items-center gap-3 pl-2">
                  <img src="/logomain-bg.png" alt="KreatorNest Logo" className="w-8 h-8 object-contain shrink-0" />
                  <h1 className="text-2xl font-serif font-semibold tracking-tight">KreatorNest</h1>
                </div>
              </div>

              <nav className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.ul
                    key={effectiveMode}
                    variants={navSwap}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={contentTransition(shouldReduceMotion)}
                    className="space-y-1"
                  >
                    {navItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      const Icon = NAV_ICONS[item.iconKey];
                      return (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                              isActive ? 'bg-white text-primary-700 shadow-sm border border-organic-stone' : 'text-organic-clay hover:bg-organic-stone/50 hover:text-organic-charcoal'
                            }`}
                          >
                            {Icon ? <Icon size={20} /> : null}
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </motion.ul>
                </AnimatePresence>
              </nav>

              <div className="mt-6 pt-5 border-t border-organic-stone">
                <BrowseModeToggle isDesktopOpen={true} />
              </div>

              {!isInstalled && (
                <div className="mt-4">
                  <button 
                    onClick={deferredPrompt ? handleInstallClick : undefined}
                    disabled={!deferredPrompt}
                    className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl font-semibold transition-colors ${
                      deferredPrompt
                        ? 'bg-primary-600 hover:bg-primary-700 text-white cursor-pointer'
                        : 'bg-organic-stone/50 text-organic-clay cursor-not-allowed'
                    }`}
                  >
                    <Download size={18} />
                    <span>{deferredPrompt ? 'Install App' : 'Install (build only)'}</span>
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isDesktopOpen ? 256 : 80 }}
        className="hidden md:flex flex-col fixed top-0 left-0 h-screen bg-organic-cream border-r border-organic-stone py-5 z-30 overflow-x-hidden overflow-y-auto hover:overflow-y-auto custom-scrollbar"
      >
        <div className={`flex items-center mb-8 pt-2 px-5 ${isDesktopOpen ? 'justify-between' : 'flex-col gap-3'}`}>
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity min-w-max">
            <img src="/logomain.png" alt="KreatorNest Logo" className="w-8 h-8 object-contain shrink-0" />
            <motion.h1 
              initial={false}
              animate={{ opacity: isDesktopOpen ? 1 : 0, width: isDesktopOpen ? "auto" : 0 }}
              className="text-2xl font-serif font-bold tracking-tight text-organic-charcoal overflow-hidden"
            >
              KreatorNest
            </motion.h1>
          </Link>
          
          <button 
            onClick={() => setIsDesktopOpen(!isDesktopOpen)}
            className="p-1.5 rounded-full text-organic-charcoal shadow-sm border border-organic-stone bg-white hover:bg-organic-stone/50 transition-colors"
            aria-label={isDesktopOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isDesktopOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        <nav className="flex-1 px-3">
          <AnimatePresence mode="wait">
            <motion.ul
              key={effectiveMode}
              variants={navSwap}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={contentTransition(shouldReduceMotion)}
              className="space-y-1"
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = NAV_ICONS[item.iconKey];
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      title={!isDesktopOpen ? item.label : ""}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium whitespace-nowrap ${
                        isActive ? 'bg-white text-primary-700 shadow-sm border border-organic-stone' : 'text-organic-clay hover:bg-organic-stone/50 hover:text-organic-charcoal'
                      } ${!isDesktopOpen && 'justify-center px-0'}`}
                    >
                      <div className="shrink-0">{Icon ? <Icon size={20} /> : null}</div>
                      <motion.span
                        initial={false}
                        animate={{ opacity: isDesktopOpen ? 1 : 0, width: isDesktopOpen ? "auto" : 0 }}
                        className="overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                  </li>
                );
              })}
            </motion.ul>
          </AnimatePresence>
        </nav>

        <div className="mt-6 pt-5 border-t border-organic-stone/80 px-3">
          <BrowseModeToggle isDesktopOpen={isDesktopOpen} />
        </div>

        {!isInstalled && (
          <div className="mt-4 px-4">
            <button 
              onClick={deferredPrompt ? handleInstallClick : undefined}
              title={!isDesktopOpen ? (deferredPrompt ? "Install Web App" : "Install not available in dev mode") : ""}
              disabled={!deferredPrompt}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl font-semibold transition-all shadow-sm ${
                deferredPrompt
                  ? 'bg-organic-charcoal hover:bg-black text-organic-cream cursor-pointer'
                  : 'bg-organic-stone/50 text-organic-clay cursor-not-allowed'
              } ${isDesktopOpen ? 'w-full' : 'w-10 h-10 p-0 mx-auto'}`}
            >
              <Download size={18} className="shrink-0" />
              <motion.span
                initial={false}
                animate={{ opacity: isDesktopOpen ? 1 : 0, width: isDesktopOpen ? "auto" : 0 }}
                className="overflow-hidden whitespace-nowrap text-sm"
              >
                {deferredPrompt ? 'Install App' : 'Install (build only)'}
              </motion.span>
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
};

export default Sidebar;
