import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Facebook, Youtube, Instagram } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const socialMedia = [
    { platform: 'Facebook', icon: Facebook, url: 'https://facebook.com/kweeen.04' },
    { platform: 'Youtube', icon: Youtube, url: 'https://www.youtube.com/@Kweeen' },
    { platform: 'Instagram', icon: Instagram, url: 'https://instagram.com/kweeen.04' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1528747045269-390fe33c19f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] opacity-10 bg-cover bg-center"></div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto px-4 text-center relative"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            We'd love to hear from you! Let's create something extraordinary together.
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-4 pb-20"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 p-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Send Us a Message</h2>
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-gray-600 text-lg">Thank you! We'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    Send Message
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 p-8 h-full">
              <h2 className="text-3xl font-semibold text-gray-900 mb-8">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">support@eventandparty.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      123 Event Street<br />
                      Celebration City, EV 12345
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex gap-4 justify-center">
                  {socialMedia.map(({ platform, icon: Icon, url }) => (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3 }}
                      className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-200 transition-colors"
                    >
                      <span className="sr-only">{platform}</span>
                      <Icon className="h-5 w-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUs;