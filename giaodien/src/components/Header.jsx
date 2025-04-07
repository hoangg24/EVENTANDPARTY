import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../store/UserContext.jsx";
import { motion } from "framer-motion";
import { Calendar, LogOut, Plus, List, FileText, Settings } from "lucide-react";

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = user ? [
    {
      to: "/events/create",
      label: "Create Event",
      icon: <Plus className="w-4 h-4" />,
    },
    {
      to: "/eventlist",
      label: "Event List",
      icon: <List className="w-4 h-4" />,
    },
    {
      to: "/invoices",
      label: "Invoice List",
      icon: <FileText className="w-4 h-4" />,
    },
    ...(user.role === "admin" ? [{
      to: "/admin/users",
      label: "Admin",
      icon: <Settings className="w-4 h-4" />,
    }] : []),
  ] : [];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 shadow-lg backdrop-blur-sm sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center h-20">
          {/* Logo & Navigation Links */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="relative w-10 h-10">
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
                <Calendar className="h-10 w-10 text-white relative z-10" />
              </div>
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 tracking-tight group-hover:from-purple-200 group-hover:to-white transition-all duration-300">
                EANDP
              </span>
            </Link>

            {/* Navigation Links */}
            {user && (
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center space-x-2 text-purple-100 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-6">
            {user ? (
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center shadow-lg relative overflow-hidden group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="text-base font-bold text-white relative z-10">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </motion.div>
                  <span className="text-sm font-medium text-purple-100 hidden sm:block">
                    {user.username}
                  </span>
                </div>
                {/* Logout Button */}
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg font-medium shadow-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-purple-900 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Link
                  to="/login"
                  className="text-purple-100 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Login
                </Link>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-white text-purple-900 rounded-lg font-medium shadow-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-purple-900 transition-all duration-200"
                  >
                    Register
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;