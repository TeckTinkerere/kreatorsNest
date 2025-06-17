import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

const Caricature = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const caricatureResources = [
    {
      title: 'Digital Caricature Drawing',
      description: `
        ✏️ Learn: Domestika "Digital Caricature Basics", YouTube - Cartooning Club How to Draw.
        🧰 Tools: Procreate, iPad + Apple Pencil, Medibang Paint, Clip Studio Paint.
        🎯 Gigs: IG caricature commissions, Fiverr birthday avatars, LinkedIn profile cartoons.
        🌐 Communities: r/ArtistLounge, ArtStation, DeviantArt.
        📌 Scenario: A poly student posts caricatures of teachers as a fun CCA thing. Gets 12 paid requests in a week through DMs.
      `,
      price: 'Free & Paid Resources',
      image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=500'
    },
    {
      title: 'Live Caricature Sketching',
      description: `
        🧠 Learn: Skillshare - Live Drawing 101, Urban Sketchers techniques, TikTok tutorials.
        🧰 Tools: Pencil + Copic markers, portable easel, small stool, A4 sketch pad.
        🎯 Gigs: School open houses, corporate team-bonding, art flea markets.
        🌐 Tips: Accept PayNow/GrabPay, print QR sticker, bring waterproof sleeves.
        📌 Scenario: A student artist draws fast sketches at SP events, offering "Free for a smile". Builds a portfolio, starts charging $10 per sketch.
      `,
      price: 'On-site Gear & Tips',
      image: 'https://images.unsplash.com/photo-1600357216511-861c4d2836b4?w=500'
    },
    {
      title: 'Character Branding & Merch',
      description: `
        ✨ Learn: Canva for Merch, Etsy shop setup, Branding with Caricatures (YouTube).
        🧰 Tools: Illustrator, Photoshop, Canva, Redbubble, Shopee Print-on-Demand.
        🎯 Gigs: Personal stickers, cartoon merch, Telegram emotes, IG branding icons.
        🌐 Platforms: Etsy, Shopee, Redbubble, Ko-fi shops.
        📌 Scenario: A youth turns their caricature style into stickers of SG food mascots. Viral reel leads to $300 in orders in 2 weeks.
      `,
      price: 'Start Your Online Store',
      image: 'https://images.unsplash.com/photo-1624001376572-30e0b773ae2e?w=500'
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
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback((newDirection) => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) return caricatureResources.length - 1;
      if (nextIndex >= caricatureResources.length) return 0;
      return nextIndex;
    });
  }, [caricatureResources.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [paginate]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-8 max-w-7xl mx-auto"
    >
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Caricature Resource Hub
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Turn your sketching skills into fun and profitable gigs.
        </p>
      </motion.div>

      {/* Auto Carousel Section */}
      <div className="relative h-[600px] overflow-hidden mb-12">
        <AnimatePresence initial={false} custom={currentIndex}>
          <motion.div
            key={currentIndex}
            custom={currentIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <motion.img
                  src={caricatureResources[currentIndex].image}
                  alt={caricatureResources[currentIndex].title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3">{caricatureResources[currentIndex].title}</h2>
                <p className="text-gray-600 mb-4 whitespace-pre-line text-sm">{caricatureResources[currentIndex].description.trim()}</p>
                <div className="flex items-center justify-between">
                  <p className="text-blue-600 font-semibold">{caricatureResources[currentIndex].price}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Explore Kits
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {caricatureResources.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <motion.button
          onClick={() => paginate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-blue-600 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ‹
        </motion.button>
        <motion.button
          onClick={() => paginate(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-blue-600 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ›
        </motion.button>
      </div>

      <motion.div
        variants={itemVariants}
        className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Draw Faces. Make Money.</h2>
        <p className="mb-6">Your art can entertain, inspire, and earn — start now with the right tools.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          View All Caricature Resources
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Caricature;
