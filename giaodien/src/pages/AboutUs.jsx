import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Calendar, Heart } from 'lucide-react';

const AboutUs = () => {
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
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const teamMembers = [
    { name: "Jane Doe", role: "Founder & Creative Director" },
    { name: "John Smith", role: "Event Operations Lead" },
    { name: "Emily Chen", role: "Customer Experience Manager" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] opacity-10 bg-cover bg-center"></div>
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
            About Our Journey
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Crafting extraordinary experiences since 2023
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
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 p-8 md:p-12">
          {/* Mission Statement */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-6 w-6 text-purple-600" />
              <h2 className="text-3xl font-semibold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              At Event and Party, we're passionate about transforming your visions into unforgettable moments. 
              Our dedication to excellence ensures every event is a masterpiece of creativity and precision.
            </p>
          </motion.div>

          {/* Our Story */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                  <h2 className="text-3xl font-semibold text-gray-900">Our Story</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Founded in 2023 by a team of visionary event planners, Event and Party emerged from a shared 
                  dream to revolutionize event experiences. From intimate gatherings to grand celebrations, 
                  we've grown into a trusted name in event planning excellence.
                </p>
              </div>
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Team celebration"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-8">
              <Users className="h-6 w-6 text-purple-600" />
              <h2 className="text-3xl font-semibold text-gray-900">Our Team</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-purple-50 rounded-xl p-6 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-200 flex items-center justify-center">
                    <Users className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Values */}
          <motion.div variants={itemVariants} className="mt-12">
            <div className="flex items-center gap-3 mb-8">
              <Star className="h-6 w-6 text-purple-600" />
              <h2 className="text-3xl font-semibold text-gray-900">Our Values</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Creativity", desc: "Innovative solutions for unique events" },
                { title: "Excellence", desc: "Uncompromising quality in every detail" },
                { title: "Passion", desc: "Heartfelt dedication to your experience" },
              ].map((value, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 text-center"
        >
          <a 
            href="/contact" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-semibold"
          >
            Get in Touch
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutUs;