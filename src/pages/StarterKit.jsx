import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { resourceData } from "../data/resources";
import ResourceCard from "../components/ResourceCard";

const StarterKit = () => {
  // Map roles directly to our resources categories
  const roles = [
    { label: "Visual Communication", filter: "Visual Communication" },
    { label: "Motion Graphics", filter: "Motion Graphics" },
    { label: "UX/UI & Web Design", filter: "UX/UI & Web Design" },
    { label: "Animation & 3D Arts", filter: "Animation & 3D Arts" },
    { label: "Media Production", filter: "Media Production" }
  ];
  
  const [activeRole, setActiveRole] = useState(roles[0].filter);

  // Filter resources to get the starter kit for that role
  // We showcase up to 8 top resources across different types
  const currentResources = resourceData
    .filter(r => r.category === activeRole)
    .slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto space-y-12"
    >
      <div className="text-center mt-10 mb-16">
        <p className="text-sm font-semibold tracking-widest text-primary-600 uppercase mb-4">
          Curated Essentials
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-organic-charcoal mb-6 leading-tight tracking-tight">
          The Starter Kit
        </h1>
        <p className="text-lg md:text-xl text-organic-clay max-w-2xl mx-auto leading-relaxed">
          Absolute beginner? Choose your discipline below to get the essential toolkit. Engineered specifically to meet industry standards.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {roles.map(role => {
          const isActive = activeRole === role.filter;
          return (
            <button
              key={role.label}
              onClick={() => setActiveRole(role.filter)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                isActive 
                ? "bg-primary-600 text-white border-primary-600 shadow-md transform scale-105" 
                : "bg-white text-organic-charcoal border-organic-stone hover:bg-primary-50"
              }`}
            >
              {role.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-organic-stone relative overflow-hidden min-h-[400px]">
        {/* Subtle background noise */}
        <div className="absolute inset-0 noise-bg z-0 opacity-20 pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-serif font-bold mb-8 text-organic-charcoal border-b border-organic-stone pb-6">
            Essential Toolkit for: <span className="text-primary-600 italic font-normal">{activeRole}</span>
          </h2>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {currentResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {currentResources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-organic-cream rounded-2xl border border-organic-stone">
                  <span className="text-5xl block mb-4">🌱</span>
                  <h3 className="text-2xl font-serif font-bold text-organic-charcoal">We are curating this kit!</h3>
                  <p className="text-organic-clay mt-2">Check back later for fresh tools tailored to your role.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default StarterKit;

