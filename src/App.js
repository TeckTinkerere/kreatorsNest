import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import StarterKit from './pages/StarterKit';
import Feedback from './pages/Feedback';
import ResourceHub from './pages/ResourceHub';
import ScenariosHub from './pages/ScenariosHub';
import ScenarioArticle from './pages/ScenarioArticle';

function App() {
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);

  return (
    <Router>
      <div className="flex min-h-screen font-sans overflow-x-hidden">
        <ScrollToTop />
        <Sidebar isDesktopOpen={isDesktopOpen} setIsDesktopOpen={setIsDesktopOpen} />
        <main 
          className={`flex-1 relative min-w-0 max-w-full transition-all duration-300 ease-in-out pt-16 md:pt-0 ${
            isDesktopOpen ? 'md:ml-64' : 'md:ml-20'
          }`}
        >
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/starter-kit" element={<StarterKit />} />
              <Route path="/feedback" element={<Feedback />} />
              
              {/* Dynamic Resource Hub Routes */}
              <Route path="/learning" element={<ResourceHub key="learning" title="Learning" typeDescription="Courses, masterclasses, and step-by-step guides." hubType="Learning" />} />
              <Route path="/tools" element={<ResourceHub key="tools" title="Tools & Software" typeDescription="Boost your workflow with these handpicked applications." hubType="Tools" />} />
              <Route path="/templates" element={<ResourceHub key="templates" title="Templates" typeDescription="Drop-in templates to speed up administrative and design work." hubType="Templates" />} />
              <Route path="/gigs" element={<ResourceHub key="gigs" title="Job Boards & Gigs" typeDescription="Find your next freelance client." hubType="Gigs" />} />
              <Route path="/communities" element={<ResourceHub key="communities" title="Communities" typeDescription="Network, get feedback, and grow with peers." hubType="Communities" />} />
              <Route path="/scenarios" element={<ScenariosHub />} />
              <Route path="/scenarios/:slug" element={<ScenarioArticle />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;
