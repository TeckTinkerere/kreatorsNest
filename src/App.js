import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Photography from './pages/Photography';
import Videography from './pages/Videography';
import GraphicDesign from './pages/GraphicDesign';
import Feedback from './pages/Feedback';
import FeaturedFreelancers from './pages/FeaturedFreelancers';
import StarterKit from './pages/StarterKit';
import Caricature from './pages/Caricature';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 md:ml-64">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/photography" element={<Photography />} />
              <Route path="/videography" element={<Videography />} />
              <Route path="/graphic-design" element={<GraphicDesign />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/featured-freelancers" element={<FeaturedFreelancers />} />
              <Route path="/starter-kit" element={<StarterKit />} />
              <Route path="/caricature" element={<Caricature />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;
