import { motion } from 'framer-motion';

const GraphicDesign = () => {
  // const convertUrlsToLinks = (text) => {
  //   const urlRegex = /(https?:\/\/[^\s]+)/g;
  //   return text.split(urlRegex).map((part, index) => {
  //     if (part.match(urlRegex)) {
  //       return (
  //         <a
  //           key={index}
  //           href={part}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="text-blue-600 hover:text-blue-800 underline"
  //         >
  //           {part}
  //         </a>
  //       );
  //     }
  //     return part;
  //   });
  // };




  
  const designResources = [
    {
      title: 'Brand Identity 🔥',
      image: 'https://images.unsplash.com/photo-1617006523259-f77e8b38f95a?w=500',
      icon: '🎨',
      price: '⚡ Logo Kits + Client Decks',
      categories: {
        '🎓 Learn': [
          { name: 'The Futur', url: 'https://www.thefutur.com/' },
          { name: 'LogoCore', url: 'https://logocore.com/' },
          { name: 'Envato Tuts+', url: 'https://tutsplus.com/' }
        ],
        '🛠️ Tools': [
          { name: 'Figma', url: 'https://www.figma.com/' },
          { name: 'Looka AI', url: 'https://looka.com/' },
          { name: 'Adobe Illustrator', url: 'https://www.adobe.com/products/illustrator.html' }
        ],
        '👥 Communities': [
          { name: 'r/logodesign', url: 'https://www.reddit.com/r/logodesign/' },
          { name: 'Behance', url: 'https://www.behance.net/' },
          { name: 'Indie Hackers', url: 'https://www.indiehackers.com/design' }
        ],
        '💼 Gigs': [
          { name: '99designs', url: 'https://99designs.com/' },
          { name: 'Upwork Branding', url: 'https://www.upwork.com/' }
        ],
        '📌 Scenario': [
          { name: 'Rebrand a CCA project showcase', url: '#' }
        ]
      }
    },
    {
      title: 'Print Design 🧾',
      image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500',
      icon: '🖨️',
      price: '🖼️ Layout Templates & Assets',
      categories: {
        '📚 Learn': [
          { name: 'Canva Design School', url: 'https://designschool.canva.com/' },
          { name: 'Printful Tutorials', url: 'https://www.youtube.com/@Printful' }
        ],
        '🛠 Tools': [
          { name: 'Canva', url: 'https://www.canva.com/' },
          { name: 'Vecteezy', url: 'https://www.vecteezy.com/' },
          { name: 'Adobe InDesign', url: 'https://www.adobe.com/products/indesign.html' }
        ],
        '👫 Communities': [
          { name: 'r/printdesign', url: 'https://www.reddit.com/r/printdesign/' },
          { name: 'Moo Print Club', url: 'https://www.moo.com/' }
        ],
        '💼 Gigs': [
          { name: 'Fiverr Flyer Kits', url: 'https://www.fiverr.com/' },
          { name: 'Local SME Posters', url: '#' }
        ],
        '📌 Scenario': [
          { name: 'Event poster from campus to client', url: '#' }
        ]
      }
    },
    {
      title: 'Digital Design 💻',
      image: 'https://images.unsplash.com/photo-1627398238202-b5aa77f891aa?w=500',
      icon: '💡',
      price: '📱 UI Packs + Client‑Ready Assets',
      categories: {
        '📚 Learn': [
          { name: 'DesignCourse (YT)', url: 'https://www.youtube.com/@DesignCourse' },
          { name: 'Flux Academy (YT)', url: 'https://www.youtube.com/@FluxAcademy' }
        ],
        '🛠 Tools': [
          { name: 'Adobe XD', url: 'https://www.adobe.com/products/xd.html' },
          { name: 'Figma', url: 'https://www.figma.com/' },
          { name: 'LottieFiles', url: 'https://lottiefiles.com/' }
        ],
        '👨‍👩‍👧‍👦 Communities': [
          { name: 'Design Buddies (Discord)', url: 'https://discord.gg/designbuddies' },
          { name: 'r/web_design', url: 'https://www.reddit.com/r/web_design/' },
          { name: 'Dribbble', url: 'https://dribbble.com/' }
        ],
        '💼 Gigs': [
          { name: 'Instagram Carousel Packs', url: '#' },
          { name: 'UI Wireframe Jobs', url: '#' }
        ],
        '📌 Scenario': [
          { name: 'Social media carousel + animated Lottie preview', url: '#' }
        ]
      }
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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 md:p-8 max-w-7xl mx-auto">
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Graphic Design Resource Hub
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Logos, posters, carousels & client-ready assets — build your design brand.
        </p>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {designResources.map((res, i) => (
          <motion.div key={i} variants={itemVariants} whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
              <motion.img src={res.image} alt={res.title} className="w-full h-full object-cover" whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl">
                {res.icon}
              </motion.div>
            </div>
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">{res.title}</h2>
              {Object.entries(res.categories).map(([sec, arr], idx) => (
                <div key={idx}>
                  <h3 className="font-medium text-gray-700">{sec}</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {arr.map((item, j) => (
                      <li key={j}>
                        {item.url !== '#' ? (
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {item.name}
                          </a>
                        ) : (
                          <span className="text-gray-500">{item.name}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="flex items-center justify-between pt-4">
                <span className="text-blue-600 font-semibold">{res.price}</span>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Try These →
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Design = Impact + Income 🚀</h2>
        <p className="mb-6">Craft compelling visuals, launch your portfolio, and secure your first freelance clients.</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Browse All Design Tools
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default GraphicDesign;
