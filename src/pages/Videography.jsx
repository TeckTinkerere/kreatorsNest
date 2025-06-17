import { motion } from 'framer-motion';

const Videography = () => {
  const videoResources = [
    {
      title: 'Event Videography',
      description: `
📚 Learn: [Full Time Filmmaker](https://fulltimefilmmaker.com), [Parker Walbeck YouTube](https://www.youtube.com/@ParkerWalbeck), [Wedding Film School](https://www.youtube.com/c/WeddingFilmSchool).
🎥 Tools: DJI Ronin SC, Sony A7C, lapel mics, ND filters.
🌐 Communities: r/videography, SG Videographers Club on Facebook.
🎯 Gigs: Poly open houses, proposals, orientation highlights.
📌 Scenario: Student uses a gimbal and CapCut Pro to film a friend’s proposal. The clip goes semi-viral on TikTok, leading to paid gigs from classmates.
      `,
      price: 'Free & Paid Learning Kits',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500'
    },
    {
      title: 'Commercial Production',
      description: `
📚 Learn: [Justin Odisho](https://www.youtube.com/user/JustinOdisho), [Film Riot](https://www.youtube.com/user/filmriot), Skillshare promo classes.
🎥 Tools: Tripod, 3-point lighting kit, Zoom H1 recorder, DaVinci Resolve.
🌐 Platforms: [Upwork](https://upwork.com), [Fiverr](https://fiverr.com), [StudioBinder](https://www.studiobinder.com).
🎯 Gigs: Reels for F&B brands, digital menus, startup pitches.
📌 Scenario: A student works with a food-based CCA, creates a 1-min promo reel, then sells similar clips to hawker stalls at $200/package.
      `,
      price: 'Client Brief & Promo Templates',
      image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=500'
    },
    {
      title: 'Music Videos',
      description: `
📚 Learn: [Lyrical Lemonade](https://www.youtube.com/@lyricallemonade), [ShotDeck](https://shotdeck.com), Vimeo BTS.
🎥 Tools: Colored LED panels, slow-mo features, lens filters.
🌐 Platforms: YouTube Shorts, IG Reels, BandLab for sound collabs.
🎯 Gigs: Dance crews, indie bands, school TikTok trends.
📌 Scenario: Student teams up with music club rappers, shoots reels on weekends, and builds a mini portfolio on Spotify Canvas & Reels.
      `,
      price: 'Beat Sync Kits & Lighting Gear',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
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
          Videography Resource Hub
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Craft videos that connect — from school events to viral edits.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {videoResources.map((resource, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <motion.img
                src={resource.image}
                alt={resource.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <span className="text-2xl">▶️</span>
                </motion.div>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-3">{resource.title}</h2>
              <p className="text-gray-600 mb-4 whitespace-pre-line text-sm">
                {resource.description.trim()}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-blue-600 font-semibold">{resource.price}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Kit
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Start With What You Have</h2>
        <p className="mb-6">
          No fancy gear? No problem. Start with your phone, edit with free tools, and tell your story frame by frame.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Explore All Video Resources
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Videography;
