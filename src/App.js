import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import StarterKit from './pages/StarterKit';
import Feedback from './pages/Feedback';
import Downloads from './pages/Downloads';
import ResourceHub from './pages/ResourceHub';
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
        <Route path="/downloads" element={<Downloads />} />

        {/* Dynamic Resource Hub Routes */}
        <Route path="/learning" element={<ResourceHub title="Learning" typeDescription="Courses, masterclasses, and step-by-step guides." hubType="Learning" />} />
        <Route path="/tools" element={<ResourceHub title="Tools & Software" typeDescription="Boost your workflow with these handpicked applications." hubType="Tools" />} />
        <Route path="/templates" element={<ResourceHub title="Templates" typeDescription="Drop-in templates to speed up administrative and design work." hubType="Templates" />} />
        <Route path="/gigs" element={<ResourceHub title="Job Boards & Gigs" typeDescription="Find your next freelance client." hubType="Gigs" />} />
        <Route path="/communities" element={<ResourceHub title="Communities" typeDescription="Network, get feedback, and grow with peers." hubType="Communities" />} />

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
            className={`flex-1 relative min-w-0 max-w-full transition-all duration-300 ease-in-out pt-16 md:pt-0 ${
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
