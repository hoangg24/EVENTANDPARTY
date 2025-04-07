import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import {
  BookOpen,
  Brain,
  Trophy,
  Users,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Calendar,
  MapPin,
  Music,
} from "lucide-react";
import { UserContext } from "../store/UserContext";
import { useState } from "react";

const Home = () => {
  const { user } = useContext(UserContext);
  const [currentSlide, setCurrentSlide] = useState(0);

  const events = [
    {
      title: "Summer Music Festival",
      description: "Experience the magic of live music under the stars with world-renowned artists.",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      date: "Aug 15-17, 2025",
      location: "Central Park",
      category: "Music",
      icon: <Music className="w-5 h-5" />,
      cta: "Get Early Bird Tickets",
      link: "/events/summer-festival",
    },
    {
      title: "Culinary Masters Showcase",
      description: "A gastronomic journey featuring Michelin-starred chefs and exclusive wine tastings.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      date: "Sept 22-24, 2025",
      location: "Grand Plaza",
      category: "Food & Wine",
      icon: <Star className="w-5 h-5" />,
      cta: "Reserve Your Experience",
      link: "/events/food-expo",
    },
    {
      title: "Future Tech Summit 2025",
      description: "Join industry leaders and innovators shaping the future of technology.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      date: "Oct 10-12, 2025",
      location: "Innovation Center",
      category: "Technology",
      icon: <Brain className="w-5 h-5" />,
      cta: "Secure Your Spot",
      link: "/events/tech-conference",
    },
  ];

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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % events.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] opacity-20 bg-cover bg-center"></div>
        <motion.div
          className="container mx-auto px-4 pt-32 pb-40 relative"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="text-center mb-16 space-y-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                Discover Amazing Events
              </span>
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                Create Unforgettable
                <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Moments
                </span>
              </h1>
            </motion.div>
            <motion.p
              className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-200 leading-relaxed"
              variants={itemVariants}
            >
              {user
                ? `Welcome back, ${user.username}! Ready to discover your next amazing event?`
                : "Your journey to extraordinary experiences starts here. Join us and make every moment count."}
            </motion.p>
            {!user && (
              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4 mt-12"
                variants={itemVariants}
              >
                <Link
                  to="/login"
                  className="group flex items-center justify-center px-8 py-4 bg-white text-purple-900 rounded-full hover:bg-purple-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-semibold"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="group flex items-center justify-center px-8 py-4 bg-purple-700/30 backdrop-blur-sm text-white rounded-full hover:bg-purple-700/40 transform hover:scale-105 transition-all duration-300 border border-purple-500/30 text-lg font-semibold"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#fafafa] to-transparent"></div>
      </div>

      {/* Features Grid */}
      <motion.div
        className="container mx-auto px-4 -mt-20 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Brain className="h-8 w-8 text-purple-600" />,
              title: "Smart Planning",
              text: "AI-powered event suggestions tailored to your preferences",
            },
            {
              icon: <Trophy className="h-8 w-8 text-purple-600" />,
              title: "Premium Experiences",
              text: "Access to exclusive events and VIP opportunities",
            },
            {
              icon: <BookOpen className="h-8 w-8 text-purple-600" />,
              title: "Expert Insights",
              text: "Curated recommendations from industry experts",
            },
            {
              icon: <Users className="h-8 w-8 text-purple-600" />,
              title: "Community",
              text: "Connect with like-minded event enthusiasts",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Featured Events */}
      <div className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 mb-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 text-white">
              Featured Events
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover our handpicked selection of unmissable events that promise to deliver extraordinary experiences.
            </p>
          </motion.div>
        </div>
        
        <div className="relative w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="relative h-[70vh] min-h-[600px]"
            >
              <img
                src={events[currentSlide].image}
                alt={events[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium flex items-center gap-2">
                        {events[currentSlide].icon}
                        {events[currentSlide].category}
                      </span>
                    </div>
                    <h3 className="text-5xl font-bold mb-4 text-white max-w-4xl">
                      {events[currentSlide].title}
                    </h3>
                    <p className="text-gray-200 text-xl mb-6 max-w-2xl">
                      {events[currentSlide].description}
                    </p>
                    <div className="flex items-center gap-6 mb-8 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {events[currentSlide].date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {events[currentSlide].location}
                      </div>
                    </div>
                    <Link
                      to={events[currentSlide].link}
                      className="inline-flex items-center px-8 py-4 bg-white text-purple-900 rounded-full hover:bg-purple-50 transition-all duration-300 text-lg font-semibold"
                    >
                      {events[currentSlide].cta}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index
                    ? "bg-white scale-125"
                    : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531685250784-7569952593d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <motion.div
          className="container mx-auto px-4 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { end: 1000, suffix: "+", label: "Premium Events" },
              { end: 50000, suffix: "+", label: "Happy Attendees" },
              { end: 20, suffix: "+", label: "Cities" },
              { end: 100000, suffix: "+", label: "Tickets Sold" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="space-y-4"
                variants={itemVariants}
              >
                <div className="text-5xl font-bold text-white">
                  <CountUp
                    start={0}
                    end={stat.end}
                    duration={3}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-purple-200 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        className="bg-white py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
            <h3 className="text-4xl font-bold mb-6 text-gray-900">
              Ready to Create Your Perfect Event?
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              Join thousands of event planners and attendees who trust us to create extraordinary experiences. 
              Let's make your next event unforgettable together.
            </p>
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-300 text-lg font-semibold"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-300 text-lg font-semibold"
              >
                Start Planning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;