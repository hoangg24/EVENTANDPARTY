import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Loader2 } from 'lucide-react';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/reset-password-request`, { email });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100 p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Mail className="h-7 w-7 text-white" />
          </motion.div>
          <h2 className="mt-6 text-4xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 tracking-wide">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {/* Email Field */}
            <div className="relative group">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5 transition-all duration-300 group-focus-within:text-indigo-600"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-300 hover:border-indigo-300 text-gray-900 placeholder-gray-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Send Reset Link"
            )}
          </motion.button>

          {/* Message Display */}
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mt-2 text-center text-sm font-medium ${
                message.includes('error') || message.includes('failed')
                  ? 'text-red-600 bg-red-50 p-2 rounded-lg'
                  : 'text-green-600 bg-green-50 p-2 rounded-lg'
              }`}
            >
              {message}
            </motion.p>
          )}
        </form>

        {/* Return to Login */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
          >
            Back to Login
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordRequest;