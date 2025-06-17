import { motion } from 'framer-motion';

const Photography = () => {
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

  const photographyResources = [
    {
      title: 'Portrait Photography',
      image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=500',
      categories: {
        '📚 Learn': [
          { name: 'Jessica Kobeissi (YouTube)', url: 'https://www.youtube.com/user/jessicakphoto' },
          { name: 'SLR Lounge', url: 'https://www.slrlounge.com/' },
          { name: 'Skillshare Portrait Classes', url: 'https://www.skillshare.com/browse/portrait-photography' },
        ],
        '📸 Tools': [
          { name: 'Canon EOS M50', url: 'https://www.usa.canon.com/shop/p/eos-m50-mark-ii' },
          { name: 'Sony a6400', url: 'https://electronics.sony.com/imaging/interchangeable-lens-cameras/aps-c/p/ilce6400-b' },
          { name: 'Lightroom Presets (Free/Paid)', url: 'https://www.lightroompresets.com/' },
        ],
        '🌐 Communities': [
          { name: 'r/photography', url: 'https://www.reddit.com/r/photography/' },
          { name: 'Portrait Shooters SG (FB)', url: 'https://www.facebook.com/groups/portraitshootersingapore/' },
        ],
        '🎯 Gigs': [
          { name: 'Graduation Shoots (SP/NYP)', url: '#' },
          { name: 'CCA Headshots', url: '#' },
        ],
        '📌 Scenario': [
          { name: 'Campus Portrait Hustle', url: '#' },
        ]
      },
      price: 'Starter Kits & Pose Guides'
    },
    {
      title: 'Event Photography',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500',
      categories: {
        '📚 Learn': [
          { name: 'Mango Street (YT)', url: 'https://www.youtube.com/c/MangoStreet' },
          { name: 'CreativeLive Events', url: 'https://www.creativelive.com/photography/event' },
        ],
        '📸 Tools': [
          { name: '24-70mm Lenses', url: 'https://www.the-digital-picture.com/Reviews/Canon-EF-24-70mm-f-2.8-L-USM-Lens-Review.aspx' },
          { name: 'Flash Diffusers', url: 'https://www.bhphotovideo.com/c/buy/Flash-Diffusers/ci/1207/N/4077634454' },
        ],
        '🌐 Communities': [
          { name: 'Event Photogs Asia (FB)', url: 'https://www.facebook.com/groups/eventphotographersasia/' },
        ],
        '🎯 Gigs': [
          { name: 'School Events', url: '#' },
          { name: 'Private Community Parties', url: '#' },
        ],
        '📌 Scenario': [
          { name: 'Shoot for Free, Build Portfolio', url: '#' },
        ]
      },
      price: 'Event Checklists + Contracts'
    },
    {
      title: 'Commercial Photography',
      image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=500',
      categories: {
        '📚 Learn': [
          { name: 'Fstoppers', url: 'https://fstoppers.com/' },
          { name: 'Karl Taylor Education', url: 'https://www.karltayloreducation.com/' },
        ],
        '📸 Tools': [
          { name: 'Lightboxes (Amazon)', url: 'https://www.amazon.com/portable-photo-studio-lightbox/s?k=portable+photo+studio+lightbox' },
          { name: 'Tether Tools', url: 'https://tethertools.com/' },
        ],
        '🌐 Communities': [
          { name: 'r/ProductPhotography', url: 'https://www.reddit.com/r/ProductPhotography/' },
        ],
        '🎯 Gigs': [
          { name: 'Shopee Product Sets', url: '#' },
          { name: 'Café Menu Shoots', url: '#' },
        ],
        '📌 Scenario': [
          { name: 'Lightbox + Thrift Gig Workflow', url: '#' },
        ]
      },
      price: 'Lighting Kits & Gig Sites'
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-8 max-w-7xl mx-auto"
    >
      {/* Title */}
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Photography Resource Hub
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Explore tools, techniques, and gig paths for freelance photographers.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {photographyResources.map((resource, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all"
          >
            <div className="h-48 overflow-hidden relative">
              <motion.img
                src={resource.image}
                alt={resource.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-5 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">{resource.title}</h2>
              {Object.entries(resource.categories).map(([section, links], idx) => (
                <div key={idx}>
                  <h3 className="font-medium text-gray-700">{section}</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {links.map((item, i) => (
                      <li key={i}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4">
                <span className="text-sm font-medium text-blue-600">{resource.price}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Learning
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        variants={itemVariants}
        className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Shoot. Share. Succeed.
        </h2>
        <p className="mb-6 text-white/90">
          Whether you're just starting out or looking to go pro, these tools help you build your brand from scratch.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Browse All Freelancer Tools
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Photography;
