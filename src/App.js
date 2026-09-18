import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy, useState } from 'react';
import Sidebar from './components/Sidebar';
import ScrollToTop from './components/ScrollToTop';
import LegacyRedirect from './components/LegacyRedirect';
import ExternalLinkGuard from './components/ExternalLinkGuard';
import PageLoader from './components/PageLoader';
import { BrowseModeProvider } from './context/BrowseModeContext';
import { ContentProvider } from './content/ContentContext';

// Eager: first paint home — keeps landing snappy
import Home from './pages/Home';

// Lazy: secondary routes — smaller initial JS, smoother first load
const StarterKit = lazy(() => import('./pages/StarterKit'));
const Feedback = lazy(() => import('./pages/Feedback'));
const Documents = lazy(() => import('./pages/Documents'));
const Essentials = lazy(() => import('./pages/Essentials'));
const Resources = lazy(() => import('./pages/Resources'));
const More = lazy(() => import('./pages/More'));
const Community = lazy(() => import('./pages/Community'));
const ScenariosHub = lazy(() => import('./pages/ScenariosHub'));
const ScenarioArticle = lazy(() => import('./pages/ScenarioArticle'));
const Contributors = lazy(() => import('./pages/Contributors'));
const ConnectionRequired = lazy(() => import('./pages/ConnectionRequired'));

/**
 * AnimatedRoutes
 * Wraps Routes with AnimatePresence using location.pathname as the key so that
 * Framer Motion correctly detects route changes and fires exit animations.
 */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/starter-kit" element={<StarterKit />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/essentials" element={<Essentials />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/more" element={<More />} />
          <Route path="/community" element={<Community />} />

          {/* Legacy routes redirected to mode-aware hubs */}
          <Route path="/templates" element={<LegacyRedirect from="/templates" />} />
          <Route path="/downloads" element={<LegacyRedirect from="/downloads" />} />
          <Route path="/learning" element={<LegacyRedirect from="/learning" />} />
          <Route path="/tools" element={<LegacyRedirect from="/tools" />} />
          <Route path="/gigs" element={<LegacyRedirect from="/gigs" />} />
          <Route path="/communities" element={<LegacyRedirect from="/communities" />} />

          <Route path="/scenarios" element={<ScenariosHub />} />
          <Route path="/scenarios/:slug" element={<ScenarioArticle />} />
          <Route path="/contributors" element={<Contributors />} />
          <Route path="/connection-required" element={<ConnectionRequired />} />

          {/* Catch-all: redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

/**
 * App
 * Root application component that sets up routing, sidebar state, and page transitions.
 *
 * @returns {JSX.Element} The application shell with router and animated routes
 */
function App() {
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);

  return (
    <ContentProvider>
      <BrowseModeProvider>
        <Router>
          <div className="flex min-h-screen font-sans overflow-x-hidden">
            <ScrollToTop />
            <ExternalLinkGuard />
            <Sidebar isDesktopOpen={isDesktopOpen} setIsDesktopOpen={setIsDesktopOpen} />
            <main
              className={`flex-1 relative min-w-0 max-w-full overflow-x-hidden transition-all duration-300 ease-in-out pt-16 md:pt-0 ${
                isDesktopOpen ? 'md:ml-64' : 'md:ml-20'
              }`}
            >
              <AnimatedRoutes />
            </main>
          </div>
        </Router>
      </BrowseModeProvider>
    </ContentProvider>
  );
}

export default App;
