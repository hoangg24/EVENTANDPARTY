import { Link, Outlet, NavLink } from "react-router-dom";
import { Users, Calendar, Package, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { name: "Quản lý người dùng", route: "/users", icon: Users },
    { name: "Quản lý sự kiện", route: "/events", icon: Calendar },
    { name: "Quản lý dịch vụ", route: "/services", icon: Package },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-purple-700 to-purple-900 text-white h-screen p-6 shadow-xl transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 
            className={`text-2xl font-bold text-white transition-opacity duration-300 ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
            }`}
          >
            Admin Dashboard
          </h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-purple-800 transition-colors"
          >
            <ChevronRight 
              className={`h-5 w-5 transform transition-transform duration-300 ${
                isSidebarOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        <ul className="space-y-3 flex-1">
          {menuItems.map((item) => (
            <li key={item.route}>
              <NavLink
                to={item.route}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-white text-purple-900 shadow-md' 
                      : 'text-white hover:bg-purple-800'
                  }`
                }
              >
                <item.icon className="h-5 w-5 min-w-[20px]" />
                <span 
                  className={`ml-3 transition-opacity duration-200 ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                  }`}
                >
                  {item.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Chào mừng đến Dashboard
            </h1>
            <div className="flex space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors">
                Cài đặt
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                Đăng xuất
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;