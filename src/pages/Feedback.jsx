import { motion } from 'framer-motion';
import { useState } from 'react';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
    priority: 'normal'
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
          Resource Hub Support
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Have a question, suggestion, or need help? We're here to assist you with any inquiries about our freelancer resources.
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
            <label htmlFor="category" className="block text-gray-700 font-medium">
              Category
            </label>
            <motion.select
              whileFocus={{ scale: 1.02 }}
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            >
              <option value="">Select a category</option>
              <option value="suggestion">Suggestion</option>
              <option value="filter-request">Filter Request</option>
              <option value="enquiry">General Enquiry</option>
              <option value="question">Question</option>
              <option value="error">Error Report</option>
              <option value="other">Other</option>
            </motion.select>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="space-y-2"
          >
            <label htmlFor="subject" className="block text-gray-700 font-medium">
              Subject
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Brief description of your inquiry"
              required
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="space-y-2"
          >
            <label htmlFor="priority" className="block text-gray-700 font-medium">
              Priority Level
            </label>
            <motion.select
              whileFocus={{ scale: 1.02 }}
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </motion.select>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="space-y-2"
          >
            <label htmlFor="message" className="block text-gray-700 font-medium">
              Message
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.02 }}
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              placeholder="Please provide details about your inquiry..."
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
            Submit Inquiry
          </motion.button>
        </div>
      </motion.form>

      <motion.div
        variants={itemVariants}
        className="mt-12 text-center"
      >
        <p className="text-gray-600">
          We'll get back to you as soon as possible. Thank you for helping us improve our resource hub!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Feedback;