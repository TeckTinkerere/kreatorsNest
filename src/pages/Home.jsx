import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRecommendations } from "../hooks/useRecommendations";
import ResourceCard from "../components/ResourceCard";

const Home = () => {
  const { recommendations, isReady } = useRecommendations();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  const curatedSections = [
    { title: "Learning", subtitle: "Deep Dives", icon: "📚", link: "/learning", span: "lg:col-span-8", height: "h-64 md:h-80" },
    { title: "Tools", subtitle: "Software", icon: "🛠️", link: "/tools", span: "lg:col-span-4", height: "h-64 md:h-80" },
    { title: "Templates", subtitle: "Plug & Play", icon: "📄", link: "/templates", span: "lg:col-span-4", height: "h-64" },
    { title: "Gigs", subtitle: "Opportunities", icon: "💼", link: "/gigs", span: "lg:col-span-4", height: "h-64" },
    { title: "Communities", subtitle: "Network", icon: "💬", link: "/communities", span: "lg:col-span-4", height: "h-64" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto space-y-20 overflow-hidden"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="pt-10 md:pt-20 pb-8 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-[100px] -z-10 opacity-60"></div>
        <p className="text-sm font-semibold tracking-widest text-primary-600 uppercase mb-4 pl-1">
          The Freelancer's Companion
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-organic-charcoal leading-[1.1] mb-6 max-w-4xl">
          Crafting tools & knowledge for the <span className="italic text-primary-600">modern creative</span>.
        </h1>
        <p className="text-lg md:text-xl text-organic-clay max-w-2xl leading-relaxed">
          Break out of the generic templates. Access curated, high-quality resources engineered specifically for early-career independent workers.
        </p>
      </motion.div>

      {/* Recommendations Section */}
      {isReady && recommendations.length > 0 && (
        <motion.div variants={itemVariants} className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-serif text-organic-charcoal">Recommended</h2>
              <p className="text-organic-clay mt-2">Curated from your recent reading history.</p>
            </div>
            <Link to="/tools" className="text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors">
              View all resources →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Asymmetric Bento Grid for Hubs */}
      <motion.div variants={containerVariants} className="relative z-10 pb-20">
        <h2 className="text-3xl font-serif text-organic-charcoal mb-8">Directories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
          {curatedSections.map((section) => (
            <Link key={section.title} to={section.link} className={`${section.span} block`}>
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className={`relative bg-white rounded-3xl p-8 border border-organic-stone shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-end ${section.height} overflow-hidden`}
              >
                <div className="absolute inset-0 noise-bg opacity-30 group-hover:opacity-10 transition-opacity"></div>
                {/* Background wash on hover */}
                <div className="absolute inset-0 bg-primary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="text-4xl">{section.icon}</div>
                  <div>
                    <p className="text-sm tracking-widest text-primary-600 uppercase font-semibold mb-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      {section.subtitle}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-serif text-organic-charcoal leading-tight">
                      {section.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
          {/* Static scenario block */}
          <Link to="/scenarios" className="col-span-1 md:col-span-2 lg:col-span-12 block">
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-organic-charcoal text-organic-cream rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 group hover:shadow-lg transition-all"
            >
              <div className="max-w-2xl">
                <span className="text-sm font-semibold tracking-widest text-organic-clay uppercase">Real-world Studies</span>
                <h3 className="text-3xl md:text-4xl font-serif mt-3 mb-4">Case Scenarios</h3>
                <p className="text-organic-sand text-lg">Learn how other professionals handle complex pricing, ghosting clients, and legal battles.</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-2xl group-hover:bg-white group-hover:text-primary-600 transition-colors shrink-0">
                →
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default Home;
