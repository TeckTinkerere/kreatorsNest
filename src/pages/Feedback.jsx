import { motion } from 'framer-motion';
import { useState } from 'react';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    feedback: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
          Feedback
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          We value your feedback! Please let us know about your experience with our services.
        </p>
      </motion.div>

      <motion.form
        variants={itemVariants}
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg"
      >
        <div className="space-y-6">
          <motion.div
            variants={itemVariants}
            className="space-y-2"
          >
            <label htmlFor="name" className="block text-gray-700 font-medium">
              Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Your name"
              required
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="space-y-2"
          >
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Your email"
              required
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="space-y-2"
          >
            <label htmlFor="service" className="block text-gray-700 font-medium">
              Service Used
            </label>
            <motion.select
              whileFocus={{ scale: 1.02 }}
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            >
              <option value="">Select a service</option>
              <option value="photography">Photography</option>
              <option value="videography">Videography</option>
              <option value="graphic-design">Graphic Design</option>
            </motion.select>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="space-y-2"
          >
            <label htmlFor="feedback" className="block text-gray-700 font-medium">
              Your Feedback
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.02 }}
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              placeholder="Share your experience with us..."
              required
            ></motion.textarea>
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Submit Feedback
          </motion.button>
        </div>
      </motion.form>

      <motion.div
        variants={itemVariants}
        className="mt-12 text-center"
      >
        <p className="text-gray-600">
          Thank you for helping us improve our services!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Feedback; 