import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ScrollToTop from './components/ScrollToTop';
import LegacyRedirect from './components/LegacyRedirect';
import Home from './pages/Home';
import StarterKit from './pages/StarterKit';
import Feedback from './pages/Feedback';
import Documents from './pages/Documents';
import Essentials from './pages/Essentials';
import Resources from './pages/Resources';
import More from './pages/More';
import Community from './pages/Community';
import ScenariosHub from './pages/ScenariosHub';
import ScenarioArticle from './pages/ScenarioArticle';
import Contributors from './pages/Contributors';
import { BrowseModeProvider } from './context/BrowseModeContext';

/**
 * AnimatedRoutes
 * Wraps Routes with AnimatePresence using location.pathname as the key so that
 * Framer Motion correctly detects route changes and fires exit animations.
 */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
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

        {/* Catch-all: redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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
    <BrowseModeProvider>
      <Router>
        <div className="flex min-h-screen font-sans overflow-x-hidden">
          <ScrollToTop />
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
  );
}

export default App;
