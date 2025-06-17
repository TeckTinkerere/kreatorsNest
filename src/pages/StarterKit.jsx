import { motion } from "framer-motion";
import AdviceCarousel from "../components/carousel";

const StarterKit = () => {
  const resources = [
    {
      title: "Getting Started Guide",
      description: "Essential tips and best practices for new freelancers. Learn about setting up your business, finding clients, and managing projects effectively.",
      type: "PDF Guide",
      icon: "📚",
      color: "from-blue-500 to-blue-600",
      link: "https://www.upwork.com/resources/guide-to-freelancing"
    },
    {
      title: "Portfolio Templates",
      description: "Professional templates to showcase your work. Includes customizable layouts for photography, videography, and graphic design portfolios.",
      type: "Templates",
      icon: "🎨",
      color: "from-purple-500 to-purple-600",
      link: "https://www.behance.net/galleries/templates"
    },
    {
      title: "Pricing Calculator",
      description: "Tool to help you set competitive rates based on your skills, experience, and market demand. Includes project estimation templates.",
      type: "Tool",
      icon: "💰",
      color: "from-green-500 to-green-600",
      link: "https://www.freelancecalculator.com"
    },
    {
      title: "Contract Templates",
      description: "Legal templates for client agreements, including scope of work, payment terms, and intellectual property rights.",
      type: "Documents",
      icon: "📄",
      color: "from-red-500 to-red-600",
      link: "https://www.hellobonsai.com/contract-templates"
    },
  ];

  const additionalResources = [
    {
      title: "Marketing Guide",
      description: "Learn how to market your services effectively through social media, networking, and personal branding.",
      icon: "📢",
      link: "https://www.freelancersunion.org/resources/marketing-guide"
    },
    {
      title: "Client Communication Templates",
      description: "Professional email and message templates for proposals, follow-ups, and project updates.",
      icon: "✉️",
      link: "https://www.hubspot.com/email-templates"
    },
    {
      title: "Tax Guide for Freelancers",
      description: "Essential tax information and tips for managing your finances as a freelancer.",
      icon: "📊",
      link: "https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center"
    },
  ];

  const freelancingTips = [
    {
      title: "Setting Your Rates",
      tips: [
        "Research market rates for your skills and experience",
        "Consider your costs and desired income",
        "Factor in non-billable time",
        "Start with a competitive rate and adjust based on demand"
      ]
    },
    {
      title: "Finding Clients",
      tips: [
        "Build a strong online presence",
        "Join freelancing platforms",
        "Network in industry events",
        "Ask for referrals from satisfied clients"
      ]
    },
    {
      title: "Managing Projects",
      tips: [
        "Use project management tools",
        "Set clear milestones and deadlines",
        "Communicate regularly with clients",
        "Document everything in writing"
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-2 md:px-4 py-4 max-w-5xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-6">
        <h1 className="text-xl md:text-3xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Freelancer Starter Kit
        </h1>
        <p className="text-sm md:text-base text-gray-700 max-w-xl mx-auto leading-relaxed">
          Essential resources and tools designed to jumpstart your freelancing career with confidence and professionalism.
        </p>
      </motion.div>

      {/* Highlight Banner */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-md p-3 mb-6 text-white text-center shadow-md"
      >
        <p className="text-sm md:text-base font-semibold max-w-xl mx-auto">
          Everything you need to get started — from contracts and pricing calculators to marketing and invoicing templates.
        </p>
      </motion.div>

      {/* Main Resources */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6"
      >
        {resources.map((resource, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col"
          >
            <div
              className={`p-3 bg-gradient-to-r ${resource.color} text-white flex justify-between items-center`}
            >
              <h2 className="text-base font-semibold leading-snug">{resource.title}</h2>
              <span className="text-xl select-none">{resource.icon}</span>
            </div>
            <div className="p-3 flex flex-col flex-grow">
              <p className="text-gray-700 mb-3 flex-grow leading-relaxed text-xs md:text-sm">{resource.description}</p>
              <div className="flex items-center justify-between">
                <span className="bg-gray-100 text-gray-900 px-2 py-0.5 rounded-full text-xs font-medium tracking-wide select-none">
                  {resource.type}
                </span>
                <motion.a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-sm hover:from-blue-700 hover:to-purple-700 transition-colors duration-300"
                >
                  Download
                </motion.a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Freelancing Tips */}
      <motion.div
        variants={itemVariants}
        className="mb-6"
      >
        <h2 className="text-lg font-bold mb-3 text-center">Essential Freelancing Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {freelancingTips.map((section, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-md p-3 shadow-sm"
            >
              <h3 className="text-base font-semibold mb-2 text-blue-600">{section.title}</h3>
              <ul className="space-y-1">
                {section.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start">
                    <span className="text-green-500 mr-1.5 text-xs">•</span>
                    <span className="text-gray-700 text-xs">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Advice Carousel Section */}
      <AdviceCarousel />

      {/* Additional Resources */}
      <motion.div
        variants={itemVariants}
        className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md p-4 text-white shadow-md"
      >
        <h2 className="text-lg font-bold mb-3 text-center">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {additionalResources.map((resource, index) => (
            <motion.a
              key={index}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-md p-3 flex flex-col items-center text-center cursor-pointer"
            >
              <div className="text-2xl mb-2">{resource.icon}</div>
              <h3 className="text-base font-semibold mb-1">{resource.title}</h3>
              <p className="text-white/80 leading-relaxed text-xs">{resource.description}</p>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* CTA Footer */}
      <motion.div
        variants={itemVariants}
        className="mt-6 text-center"
      >
        <p className="text-gray-700 text-sm mb-3">
          Need personalized help or have questions about your freelancing journey?
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold shadow-sm hover:from-blue-700 hover:to-purple-700 transition-colors duration-300"
        >
          Contact Support
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default StarterKit;
