import { motion } from 'framer-motion';
import kelvinImage from '../assets/kelvin.jpg';

const FeaturedFreelancers = () => {
  const freelancers = [
    {
      name: 'Ji Loong (Kelvin)',
      role: 'Photographer',
      experience: '3 years',
      rating: '4.9',
      image: kelvinImage,
      portfolio: '15+ Projects',
      skills: ['Portrait', 'Wedding', 'Commercial', 'Events']
    },
    // {
    //   name: 'Michael Chen',
    //   role: 'Videographer',
    //   experience: '6 years',
    //   rating: '4.8',
    //   image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
    //   portfolio: '20+ Projects',
    //   skills: ['Documentary', 'Commercial', 'Music Videos']
    // },
    // {
    //   name: 'Emma Davis',
    //   role: 'Graphic Designer',
    //   experience: '5 years',
    //   rating: '4.9',
    //   image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500',
    //   portfolio: '25+ Projects',
    //   skills: ['Branding', 'UI/UX', 'Print']
    // },
    // {
    //   name: 'James Wilson',
    //   role: 'Photographer',
    //   experience: '10 years',
    //   rating: '5.0',
    //   image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500',
    //   portfolio: '30+ Projects',
    //   skills: ['Fashion', 'Editorial', 'Portrait']
    // }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-8 max-w-7xl mx-auto"
    >
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Featured Freelancers
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Meet our top-rated creative professionals
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
      >
        {freelancers.map((freelancer, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="relative">
              <motion.img
                src={freelancer.image}
                alt={freelancer.name}
                className="w-full h-48 object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-xl font-semibold">{freelancer.name}</h2>
                <p className="text-sm opacity-90">{freelancer.role}</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600">Experience: {freelancer.experience}</p>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{freelancer.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{freelancer.portfolio}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {freelancer.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                View Profile
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Creative Community</h2>
        <p className="mb-6">Are you a creative professional? Apply to become a featured freelancer.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Apply Now
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default FeaturedFreelancers; 