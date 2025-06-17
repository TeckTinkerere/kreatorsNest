import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const categories = [
    {
      title: "Photography",
      icon: "📸",
      link: "/photography",
      color: "from-blue-100 to-blue-200",
      description: "Tools, communities, and gigs for visual storytellers.",
    },
    {
      title: "Videography",
      icon: "🎥",
      link: "/videography",
      color: "from-purple-100 to-purple-200",
      description: "Learn to shoot, edit, and freelance in video content.",
    },
    {
      title: "Graphic Design",
      icon: "🎨",
      link: "/graphic-design",
      color: "from-pink-100 to-pink-200",
      description: "Design assets, job boards, and upskilling for creatives.",
    },
    {
      title: "Caricature",
      icon: "🖌️",
      link: "/caricature",
      color: "from-orange-100 to-orange-200",
      description: "Turn sketches into side-income with niche gigs.",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-8 max-w-7xl mx-auto"
    >
      {/* Heading */}
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to KreatorNest
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Your all-in-one freelancing hub – explore resources by creative field and jumpstart your journey.
        </p>
      </motion.div>

      {/* Category Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
      >
        {categories.map(({ title, icon, link, color, description }) => (
          <motion.div
            key={title}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
          >
            <Link to={link} className="block">
              <div className={`h-44 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-br ${color}`}>
                <span className="text-5xl">{icon}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
              <p className="text-sm text-gray-600">{description}</p>
              <span className="inline-block mt-4 text-blue-600 font-medium hover:underline">
                Explore →
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        variants={itemVariants}
        className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Ready to Build Your Freelance Path?
        </h2>
        <p className="mb-6 text-white/90">
          Access tools, tutorials, and communities – all in one place. Join now and start creating!
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Join Now
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Home;
