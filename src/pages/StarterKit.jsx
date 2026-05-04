import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { resourceData } from "../data/resources";
import { useRecommendations } from "../hooks/useRecommendations";
import ResourceCard from "../components/ResourceCard";
import { BookOpen, Wrench, FileText, Briefcase, ChevronRight, Star, Sparkles } from "lucide-react";

const StarterKit = () => {
  const roles = [
    { 
      label: "Visual Communication", 
      filter: "Visual Communication",
      persona: "The Visual Storyteller",
      mission: "Crafting memorable identities and impact through high-end graphic design and branding.",
      focus: ["Branding", "Typography", "Layout"]
    },
    { 
      label: "Motion Graphics", 
      filter: "Motion Graphics",
      persona: "The Kinetic Artist",
      mission: "Bringing static designs to life through purposeful movement and cinematic timing.",
      focus: ["After Effects", "Rhythm", "2D/3D Animation"]
    },
    { 
      label: "UX/UI & Web Design", 
      filter: "UX/UI & Web Design",
      persona: "The Digital Architect",
      mission: "Designing seamless human-computer interactions that are both beautiful and functional.",
      focus: ["Interface Design", "Prototyping", "User Logic"]
    },
    { 
      label: "Animation & 3D Arts", 
      filter: "Animation & 3D Arts",
      persona: "The World Builder",
      mission: "Sculpting immersive 3D environments and characters from imagination to render.",
      focus: ["Modeling", "Texturing", "Spatial Design"]
    },
    { 
      label: "Media Production", 
      filter: "Media Production",
      persona: "The Multi-Hyphenate",
      mission: "Mastering the full lifecycle of content creation, from set to post-production.",
      focus: ["Directing", "Workflow", "Delivery"]
    },
    { 
      label: "Photography", 
      filter: "Photography",
      persona: "The Light Chaser",
      mission: "Capturing moments that define brands and stories through technical precision and soul.",
      focus: ["Lighting", "Composition", "Retouching"]
    },
    { 
      label: "Video Editing", 
      filter: "Video Editing",
      persona: "The Narrative Crafter",
      mission: "Piecing together the puzzle of raw footage into compelling, high-impact stories.",
      focus: ["Pacing", "Storytelling", "Color Grading"]
    },
    { 
      label: "Videography", 
      filter: "Videography",
      persona: "The Cinematographer",
      mission: "Engineering visual sequences that command attention and evoke deep emotion.",
      focus: ["Camera Ops", "Cinematics", "Technical Gear"]
    }
  ];
  
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const activeRole = roles[activeRoleIndex];
  const { trackInteraction } = useRecommendations();

  const phaseResources = useMemo(() => {
    const roleResources = resourceData.filter(r => r.category === activeRole.filter);
    return {
      learning: roleResources.filter(r => r.type === "Learning").slice(0, 2),
      tools: roleResources.filter(r => r.type === "Tools").slice(0, 2),
      templates: roleResources.filter(r => r.type === "Templates").slice(0, 2),
      gigs: roleResources.filter(r => r.type === "Gigs").slice(0, 2)
    };
  }, [activeRole.filter]);

  const allRoleResources = useMemo(() => {
    return resourceData.filter(r => r.category === activeRole.filter);
  }, [activeRole.filter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const phases = [
    { 
      id: 'foundations', 
      title: 'Foundations', 
      icon: BookOpen, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      resources: phaseResources.learning, 
      perk: "Use Pinterest to build your first reference board.",
      desc: 'Master the theory and core principles.' 
    },
    { 
      id: 'workshop', 
      title: 'The Workshop', 
      icon: Wrench, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50', 
      resources: phaseResources.tools, 
      perk: "Access Free Tiers (Figma/Blender) or Student Adobe CC.",
      desc: 'Equip yourself with industry-standard tools.' 
    },
    { 
      id: 'blueprint', 
      title: 'The Blueprint', 
      icon: FileText, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      resources: phaseResources.templates, 
      perk: "Start your professional portfolio on Behance for free.",
      desc: 'Standardize your workflow and showcase your work.' 
    },
    { 
      id: 'launchpad', 
      title: 'The Launchpad', 
      icon: Briefcase, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      resources: phaseResources.gigs, 
      perk: "Host high-quality project showreels on Vimeo.",
      desc: 'Find your first project and start earning.' 
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-8 lg:p-12 max-w-[1000px] mx-auto min-h-screen relative"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-[100px] -z-10 opacity-40"></div>

      {/* Header Section */}
      <motion.div variants={itemVariants} className="text-center md:text-left mb-12 pt-10">
        <p className="text-sm font-semibold tracking-widest text-primary-600 uppercase mb-4">
          The Launch Sequence
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-organic-charcoal mb-6 leading-tight tracking-tight">
          Starter <span className="italic text-primary-600">Kits</span>.
        </h1>
        <p className="text-lg text-organic-clay max-w-xl leading-relaxed">
          A streamlined path from beginner to job-ready. No noise, just the essential industry-standard steps.
        </p>
      </motion.div>

      {/* Role Selector Tabs */}
      <motion.div variants={itemVariants} className="flex overflow-x-auto hide-scrollbar gap-2 mb-12 pb-4 -mx-4 px-4 md:mx-0 md:px-0 sticky top-0 bg-surface/80 backdrop-blur-md z-40 border-b border-organic-stone/20">
        {roles.map((role, idx) => {
          const isActive = activeRoleIndex === idx;
          return (
            <button
              key={role.label}
              onClick={() => setActiveRoleIndex(idx)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                isActive 
                  ? "bg-organic-charcoal text-white border-organic-charcoal shadow-md" 
                  : "bg-white text-organic-clay border-organic-stone hover:bg-organic-stone/20"
              }`}
            >
              {role.label}
            </button>
          );
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeRole.filter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-16"
        >
          {/* Persona Highlight - Narrow Layout */}
          <section className="bg-white rounded-[32px] p-6 md:p-10 border border-organic-stone shadow-sm relative overflow-hidden max-w-3xl">
            <div className="absolute inset-0 noise-bg opacity-20 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary-600 mb-3">
                <Sparkles size={14} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Persona Profile</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-organic-charcoal mb-4">
                {activeRole.persona}
              </h2>
              <p className="text-base text-organic-clay font-light leading-relaxed mb-6">
                {activeRole.mission}
              </p>
              <div className="flex flex-wrap gap-2">
                {activeRole.focus.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-organic-stone/30 text-organic-charcoal text-[9px] font-bold uppercase tracking-wider border border-organic-stone/50">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Vertical Journey Roadmap - Streamlined Single Column */}
          <section className="max-w-2xl">
            <div className="space-y-10 relative">
              {/* Vertical Connector Line */}
              <div className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-primary-600 to-organic-stone/30"></div>

              {phases.map((phase, idx) => (
                <div key={phase.id} className="flex gap-8 relative group">
                  {/* Timeline Marker */}
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-organic-stone z-10 flex items-center justify-center group-hover:border-primary-600 transition-colors shadow-sm shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div>
                  </div>

                  {/* Content Area */}
                  <div className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded tracking-tighter">PHASE {idx + 1}</span>
                      <h4 className="text-lg md:text-xl font-serif text-organic-charcoal">{phase.title}</h4>
                    </div>
                    
                    <p className="text-sm text-organic-clay mb-4 font-light leading-relaxed">
                      {phase.desc}
                    </p>
                    
                    {/* Launch Perk - Balanced focus */}
                    <div className="bg-primary-50/50 border border-primary-100 rounded-xl p-3 mb-5 inline-flex items-center gap-2">
                      <Star size={12} className="text-primary-600" />
                      <span className="text-[10px] md:text-xs font-semibold text-primary-700">{phase.perk}</span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {phase.resources.map(res => (
                        <a 
                          key={res.id}
                          href={res.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackInteraction(res.category)}
                          className="flex items-center gap-3 text-xs font-semibold text-organic-charcoal hover:text-primary-600 transition-colors group/link"
                        >
                          <div className="w-6 h-6 rounded-full bg-organic-stone/20 flex items-center justify-center group-hover/link:bg-primary-50 transition-colors">
                            <ChevronRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
                          </div>
                          <span className="border-b border-transparent group-hover/link:border-primary-600 pb-0.5">{res.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Extended Directory Section */}
          <section className="pt-20 border-t border-organic-stone/30">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-serif text-organic-charcoal mb-2">Extended Directory</h3>
                <p className="text-sm text-organic-clay">The complete curated toolkit for {activeRole.filter}.</p>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-organic-clay px-3 py-1 bg-organic-stone/20 rounded-full border border-organic-stone/40">
                {allRoleResources.length} Resources
              </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {allRoleResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} onInteract={trackInteraction} />
              ))}
            </div>
          </section>
        </motion.div>
      </AnimatePresence>

      {/* Footer CTA */}
      <motion.div 
        variants={itemVariants}
        className="mt-40 mb-20 p-10 md:p-20 bg-organic-charcoal rounded-[32px] text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 noise-bg opacity-10"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
            The Nest is <span className="italic text-primary-400">Your</span> Workshop.
          </h2>
          <p className="text-organic-sand text-base md:text-lg mb-10 max-w-xl mx-auto font-light leading-relaxed">
            Every professional was once a beginner. Start with the Foundations, build your Workshop, and launch your career today.
          </p>
          <a 
            href="mailto:hello@kreatornest.com" 
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-organic-charcoal rounded-full font-bold text-base hover:bg-primary-50 transition-all shadow-xl shadow-white/5"
          >
            <span>Apply to Contribute</span>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StarterKit;
