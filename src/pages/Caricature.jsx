import { motion } from "framer-motion";

const Caricature = () => {
  // Function to convert URLs to clickable links
  const convertUrlsToLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const resources = [
    {
      title: "Digital Caricature Drawing",
      description: `
✏️ **Learn:**  
[Domestika: Digital Caricature](https://www.domestika.org/en/courses/1171-digital-caricature-from-sketch-to-painting)  
[Cartooning Club on YouTube](https://www.youtube.com/user/DrawKidsDraw)

🧰 **Tools:** Procreate · iPad + Apple Pencil · Clip Studio Paint · Medibang

🎯 **Gigs:** IG birthday avatars · [Fiverr gigs](https://www.fiverr.com/search/gigs?query=caricature) · LinkedIn cartoon PFPs

🌐 **Communities:** [r/ArtistLounge](https://www.reddit.com/r/ArtistLounge) · [ArtStation](https://www.artstation.com) · [DeviantArt](https://www.deviantart.com)

📌 **Scenario:** A poly student draws profs for fun. Gets 12 paid requests via DMs in one week!
      `.trim(),
      video: "https://www.youtube.com/embed/mMzp_bgihDU",
      color: "from-orange-400 to-pink-500",
    },
    {
      title: "Live Caricature Sketching",
      description: `
🧠 **Learn:**  
[Skillshare: Live Drawing 101](https://www.skillshare.com/classes/Live-Caricature-Drawing/123456789)  
[Urban Sketching Tips](https://www.urbansketchers.org/) · TikTok speed sketch tutorials

🧰 **Tools:** Pencil · Copic markers · A4 pad · Portable easel + stool

🎯 **Gigs:** School open houses · Art flea · Corporate sketch booths

🌐 **Tips:** Accept PayNow · Print QR sticker · Waterproof sleeves

📌 **Scenario:** Draws "Free if you smile" at SP open house. Gains traction, starts charging $10/sketch.
      `.trim(),
      video: "https://www.youtube.com/embed/bPz1zteoxRc",
      color: "from-teal-500 to-green-500",
    },
    {
      title: "Character Branding & Merch",
      description: `
✨ **Learn:**  
[YouTube: Merch with Canva](https://www.youtube.com/watch?v=EKuI8qz_lmI)  
[Redbubble Setup](https://www.redbubble.com) · [Shopee Print-on-Demand](https://shopee.sg/)

🧰 **Tools:** Canva · Illustrator · Photoshop · Redbubble · Ko-fi

🎯 **Gigs:** Stickers · Telegram emotes · Etsy mascot merch

🌐 **Platforms:** [Etsy](https://www.etsy.com) · [Redbubble](https://www.redbubble.com) · [Ko-fi](https://ko-fi.com)

📌 **Scenario:** Sells SG food mascot stickers via viral IG Reel. Gets $300 in 2 weeks.
      `.trim(),
      video: "https://www.youtube.com/embed/sO4te2QNsHY",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"
      >
        Caricature Resource Hub
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {resources.map((res, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-2xl shadow-lg overflow-hidden border border-gray-200 bg-white"
          >
            <div className={`p-1 bg-gradient-to-r ${res.color}`}>
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {res.title}
                  </h2>
                  <p className="whitespace-pre-line text-sm text-gray-700">
                    {res.description.split('**').map((part, index) => 
                      index % 2 === 0 ? convertUrlsToLinks(part) : <strong key={index}>{convertUrlsToLinks(part)}</strong>
                    )}
                  </p>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={res.video}
                      title={res.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Caricature;
