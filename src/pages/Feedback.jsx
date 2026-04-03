import { motion } from "framer-motion";

const Feedback = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 min-h-screen flex flex-col"
    >
      <div className="text-center mt-10">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          We Value Your Feedback
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Help us make KreatorNest the ultimate platform for freelancers. Drop your thoughts, feature requests, or bugs below!
        </p>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-grow bg-white rounded-3xl p-4 md:p-8 shadow-sm border border-gray-100 flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -z-10 opacity-50"></div>
        
        {/*
          To the User/Admin: 
          Copy and paste your Google Form embed URL into the src attribute below.
          You can get this by clicking "Send" on your Google Form > "Embed HTML" < > > Copy the URL only.
        */}
        <div className="w-full h-full min-h-[600px] flex items-center justify-center">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSfpNX_3OWzXz7zcF3uipcyp28I6T_vquZz7YxpXb0XNYRCHSA/viewform?embedded=true"
            width="640"
            height="1201"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Feedback Form"
          >
            Loading…
          </iframe>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Feedback;