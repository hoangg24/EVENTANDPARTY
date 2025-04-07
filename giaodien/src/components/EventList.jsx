import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Tag, Users, Clock, Globe, Lock, Search } from "lucide-react";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    date: "",
    category: "",
    location: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchUserInfo = () => {
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("userId");
    setUserRole(role);
    setUserId(id);
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/event`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Unable to load event list!");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(
        response.data.length > 0
          ? response.data
          : [{ _id: "default", name: "No Category" }]
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([{ _id: "default", name: "No Category" }]);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prev => ({ ...prev, [name]: value }));
  };

  const filteredEvents = events.filter(event => {
    const nameMatch = !searchCriteria.name || 
      event.name?.toLowerCase().includes(searchCriteria.name.toLowerCase());
    const dateMatch = !searchCriteria.date || 
      new Date(event.date).toISOString().slice(0,10) === searchCriteria.date;
    const categoryMatch = !searchCriteria.category || 
      event.category?.name?.toLowerCase().includes(searchCriteria.category.toLowerCase());
    const locationMatch = !searchCriteria.location || 
      event.location?.toLowerCase().includes(searchCriteria.location.toLowerCase());
    
    return nameMatch && dateMatch && categoryMatch && locationMatch;
  });

  const handleUpdateStatus = async (eventId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/event/${eventId}/status`,
        { isPublic: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, isPublic: response.data.event.isPublic }
            : event
        )
      );
    } catch (error) {
      console.error("Error updating event status:", error);
    }
  };

  const handleNavigateToInvoiceDetails = (eventId) => {
    navigate(`/events/${eventId}/invoices`);
  };

  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
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
        stiffness: 100,
        damping: 12
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover and join amazing events happening around you
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={searchCriteria.name}
                onChange={handleSearchChange}
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                name="date"
                value={searchCriteria.date}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                name="category"
                value={searchCriteria.category}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="location"
                value={searchCriteria.location}
                onChange={handleSearchChange}
                placeholder="Search by location..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1],
                transition: { 
                  rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity }
                }
              }}
              className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-xl font-medium text-gray-600 dark:text-gray-300"
            >
              Discovering amazing events...
            </motion.p>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-3xl shadow-xl"
          >
            <div className="text-red-500 mb-6">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  transition: { duration: 2, repeat: Infinity }
                }}
              >
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </motion.div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Unable to Load Events</h3>
            <p className="text-gray-600 dark:text-gray-300">{error}</p>
          </motion.div>
        ) : filteredEvents.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-8"
          >
            {filteredEvents.map((event) => (
              <motion.div
                key={event._id}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden transform-gpu hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img
                    src={event.image 
                        ? `${import.meta.env.VITE_API_IMAGE}${event.image}`
                      : "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    }
                    alt={event.name}
                    className="w-full object-cover"
                  />
                  <div className="absolute top-6 right-6 z-20">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full
                        ${event.isPublic 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-rose-500 text-white'
                        }
                        shadow-lg
                      `}
                    >
                      {event.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      <span className="font-medium">{event.isPublic ? 'Public' : 'Private'}</span>
                    </motion.div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <h3 className="text-4xl font-bold text-white mb-4">{event.name}</h3>
                    <div className="flex flex-wrap gap-6 text-white/90">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span>{formatTime(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2 px-4 py-2 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full">
                      <Tag className="w-4 h-4" />
                      <span className="font-medium">{event.category?.name || "No Category"}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{event.capacity || "Unlimited"} attendees</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                    {event.description || "No description available."}
                  </p>

                  <div className="flex flex-wrap gap-4 justify-end">
                    {(userRole === "admin" || event.createdBy?.toString() === userId) && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleNavigateToInvoiceDetails(event._id)}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          Create Invoice
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleUpdateStatus(event._id, event.isPublic)}
                          className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          {event.isPublic ? "Make Private" : "Make Public"}
                        </motion.button>
                      </>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleViewDetails(event._id)}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-16"
          >
            <div className="w-32 h-32 bg-violet-50 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
              {(searchCriteria.name || searchCriteria.date || searchCriteria.category || searchCriteria.location) ? (
                <Search className="w-16 h-16 text-violet-500 dark:text-violet-400" />
              ) : (
                <Calendar className="w-16 h-16 text-violet-500 dark:text-violet-400" />
              )}
            </div>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              {(searchCriteria.name || searchCriteria.date || searchCriteria.category || searchCriteria.location) 
                ? "No Matching Events" 
                : "No Events Found"}
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {(searchCriteria.name || searchCriteria.date || searchCriteria.category || searchCriteria.location)
                ? "No events match your search criteria. Try different filters!"
                : "Start creating amazing events to see them listed here!"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventList;