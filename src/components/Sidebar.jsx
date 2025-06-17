import { Link, useLocation } from 'react-router-dom';
import {
  Home, Camera, Video, Palette, MessageSquare,
  Users, Package, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import whitelogo from '../assets/whitelogo.png';

const navItems = [
  { path: '/', icon: <Home size={20} />, label: 'Home' },  
  { path: '/starter-kit', icon: <Package size={20} />, label: 'Starter Kit' },
  { path: '/photography', icon: <Camera size={20} />, label: 'Photography' },
  { path: '/videography', icon: <Video size={20} />, label: 'Videography' },  
  { path: '/caricature', icon: <Users size={20} />, label: 'Caricature' },
  { path: '/graphic-design', icon: <Palette size={20} />, label: 'Graphic Design' },
  { path: '/featured-freelancers', icon: <Users size={20} />, label: 'Featured Freelancers' },
  { path: '/feedback', icon: <MessageSquare size={20} />, label: 'Feedback' }
];

const sidebarVariants = {
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 25
    }
  },
  closed: {
    x: "-100%",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 25
    }
  }
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Lock body scroll on mobile when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white shadow-lg md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="mobile-sidebar"
            role="navigation"
            aria-label="Main Sidebar"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-6 z-40 shadow-lg md:hidden"
          >
            {/* Branding */}
            <motion.div
              className="flex items-center gap-3 mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <img 
                src={whitelogo} 
                alt="KreatorNest Logo" 
                className="w-8 h-8 object-contain" 
              />
              <h1 className="text-2xl font-extrabold tracking-wide">
                KreatorNest
              </h1>
            </motion.div>

            {/* Navigation */}
            <nav>
              <ul className="space-y-3">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.li
                      key={item.path}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 w-64 h-screen bg-gray-900 text-white p-6 z-30">
        <div className="flex items-center gap-3 mb-10">
          <img 
            src={whitelogo} 
            alt="KreatorNest Logo" 
            className="w-8 h-8 object-contain" 
          />
          <h1 className="text-2xl font-extrabold tracking-wide">KreatorNest</h1>
        </div>
        <nav className="flex-1">
          <ul className="space-y-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
