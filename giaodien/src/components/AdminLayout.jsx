import React, { useState, useContext } from "react";
import { Link, Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  Package,
  LayoutGrid,
  FileText,
  ChevronLeft,
  Home,
  LogOut,
  Bell,
} from "lucide-react";
import { UserContext } from "../store/UserContext";

const AdminLayout = () => {
  const { user, logout } = useContext(UserContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { name: "User Management", path: "/admin/users", icon: Users },
    { name: "Event Management", path: "/admin/events", icon: Calendar },
    { name: "Service Management", path: "/admin/services", icon: Package },
    { name: "Category Management", path: "/admin/categories", icon: LayoutGrid },
    { name: "Invoice Management", path: "/admin/invoices", icon: FileText },
    { name: "Role Management", path: "/admin/roles", icon: Users }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-72" : "w-20"
        } bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
        text-white shadow-2xl transition-all duration-300 ease-in-out 
        fixed h-screen z-20 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center border-b border-slate-700/30">
          <div
            className={`flex items-center justify-between w-full transition-all duration-300 ${
              isSidebarOpen ? "space-x-3" : "space-x-0"
            }`}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-xl font-bold">A</span>
              </div>
              <h2
                className={`text-xl font-semibold tracking-wide ml-3 transition-all duration-300 ${
                  isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
                }`}
              >
                Admin Portal
              </h2>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              <ChevronLeft
                className={`h-5 w-5 transform transition-transform duration-300 ${
                  isSidebarOpen ? "rotate-0" : "rotate-180"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-xl transition-all duration-200 
                    group relative overflow-hidden ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={`h-5 w-5 min-w-[20px] z-10 ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                      }`} />
                      <span
                        className={`ml-3 font-medium transition-all duration-200 ${
                          isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
                        }`}
                      >
                        {item.name}
                      </span>
                      {/* Hover effect */}
                      <span
                        className={`absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent 
                        transform ${isActive ? "scale-100" : "scale-0"} 
                        transition-transform duration-200 group-hover:scale-100`}
                      />
                      {/* Tooltip for collapsed state */}
                      {!isSidebarOpen && (
                        <span
                          className="absolute left-full ml-2 p-2 bg-slate-900 
                          text-white text-sm rounded-md opacity-0 group-hover:opacity-100 
                          transition-opacity duration-200 whitespace-nowrap shadow-lg"
                        >
                          {item.name}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-72" : "ml-20"
        } p-6 md:p-8`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Welcome back, {user?.username || 'Admin'}
                </h1>
                <p className="mt-1 text-slate-600">
                  Here's what's happening in your admin portal today.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 relative">
                  <Bell className="h-5 w-5 text-slate-600" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Link to="/">
                    <button className="px-4 py-2 text-sm font-medium text-slate-700 
                      bg-white rounded-lg shadow-sm hover:shadow-md border border-slate-200
                      transition-all duration-200 flex items-center space-x-2">
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white 
                      bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg 
                      hover:from-rose-600 hover:to-pink-700 shadow-sm hover:shadow-md
                      transition-all duration-200 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-slate-200">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
