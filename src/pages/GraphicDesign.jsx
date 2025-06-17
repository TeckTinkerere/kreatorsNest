import { motion } from 'framer-motion';

const GraphicDesign = () => {
  const designResources = [
    {
      title: 'Brand Identity 🔥',
      description: `
🎓 Learn: [The Futur](https://www.thefutur.com/), [LogoCore](https://logocore.com), [Envato Tuts+](https://tutsplus.com).
🎨 Tools: Figma (logo systems), Looka (AI mockups), Illustrator (deep dive).
👥 Communities: r/logodesign, Behance, Indie Hackers.
💼 Gigs: Logo + visual systems for student startups, brand boards for CCAs, Telegram commissions.
📌 Scenario: You’re hired by an SP club to rebrand their whole vibe. You sketch ideas in Figma, get peer reviews on Discord, and showcase the full case study on Behance. It leads to 2 DMs.
      `,
      price: '⚡ Logo Kits + Client Decks',
      image: 'https://images.unsplash.com/photo-1617006523259-f77e8b38f95a?w=500',
      icon: '🎨'
    },
    {
      title: 'Print Design 🧾',
      description: `
📚 Learn: [Canva Design School](https://designschool.canva.com), [Printful YouTube](https://www.youtube.com/@Printful).
🛠 Tools: Canva (easy mockups), Vecteezy (vectors), InDesign (pro layout).
👫 Communities: Moo Print Club, r/printdesign.
💼 Gigs: Poly event posters, F&B menus, merch tag design.
📌 Scenario: A Year 2 student designs fresh posters for an event. Uses Canva Pro, prints samples with school printers, tests them around campus, then wins a S$300 side deal.
      `,
      price: '🖼️ Layout Templates & Assets',
      image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500',
      icon: '🖨️'
    },
    {
      title: 'Digital Design 💻',
      description: `
📚 Learn: [DesignCourse](https://www.youtube.com/@DesignCourse), [Flux YouTube](https://www.youtube.com/@FluxAcademy).
🛠 Tools: Adobe XD (mockups), Figma (UI kits), LottieFiles (animations).
👨‍👩‍👧‍👦 Communities: Discord - Design Buddies, r/web_design, Dribbble.
💼 Gigs: Instagram post packs, carousel templates, UI kit delivery.
📌 Scenario: Student lands a freelance gig to create IG carousels for a small biz. Uses Figma for layout, exports as Canva templates, and automates post previews with Lottie.
      `,
      price: '📱 UI Packs + Client-Ready Assets',
      image: 'https://images.unsplash.com/photo-1627398238202-b5aa77f891aa?w=500',
      icon: '💡'
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
          Graphic Design Resource Hub
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Logos, prints, carousels & clients — turn your creativity into paid work.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {designResources.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <motion.img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl"
              >
                {item.icon}
              </motion.div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
              <p className="text-gray-600 mb-4 whitespace-pre-line text-sm">{item.description.trim()}</p>
              <div className="flex items-center justify-between">
                <p className="text-blue-600 font-semibold">{item.price}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try These →
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
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Design isn’t just art — it’s value 💸</h2>
        <p className="mb-6">
          Whether you're designing for passion, portfolio, or pay — this hub gives you tools to thrive.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          See All Kits
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default GraphicDesign;
