import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import unauthorizedImage from '../assets/unauthorized.jpg'; // Ensure you have this image

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100 p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 flex flex-col items-center text-center"
      >
        {/* Icon Header */}
        <motion.div
          className="h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 shadow-lg mb-6"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Lock className="h-8 w-8 text-white" />
        </motion.div>

        {/* Image */}
        <motion.img
          src={unauthorizedImage}
          alt="Unauthorized access"
          className="w-64 mb-6 rounded-lg shadow-md"
          variants={imageVariants}
        />

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
          403 - Access Denied
        </h1>

        {/* Message */}
        <p className="text-lg text-gray-600 mb-8 max-w-sm">
          Sorry, you don’t have permission to access this page. Please return to the homepage.
        </p>

        {/* Button */}
        <motion.button
          onClick={handleGoHome}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
        >
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Unauthorized;