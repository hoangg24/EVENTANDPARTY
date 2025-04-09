import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showForm, setShowForm] = useState(false); // New state variable

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Unable to load user list!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        setLoading(true);
        await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Unable to delete user!");
      } finally {
        setLoading(false);
      }
    }
  };

  // Toggle block user
  const handleToggleBlockUser = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/block/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert(response.data.message);
      fetchUsers();
    } catch (error) {
      console.error("Error toggling user block:", error);
      alert("Unable to toggle user block status!");
    } finally {
      setLoading(false);
    }
  };

  // Submit form (create/update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/users/${editingUserId}`,
          formData,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        alert("User information updated successfully!");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/users`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alert("New user added successfully!");
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Unable to save user information!");
    } finally {
      setLoading(false);
    }
  };

  // Edit user
  const handleEditUser = (user) => {
    setFormData({ username: user.username, email: user.email, role: user.role });
    setIsEditing(true);
    setEditingUserId(user._id);
    setShowForm(true); // Show the form when editing
  };

  // Reset form
  const resetForm = () => {
    setFormData({ username: "", email: "", role: "user" });
    setIsEditing(false);
    setEditingUserId(null);
    setShowForm(false); // Hide the form after resetting
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        User Management
      </h1>

      {/* Conditionally render the form */}
      {showForm && (
        <form
          onSubmit={handleSubmitForm}
          className="bg-white shadow-lg rounded-xl p-6 mb-8 transition-all duration-300 hover:shadow-xl"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            {isEditing ? "Update User" : "Add User"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                required
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                required
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-400 flex items-center"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  />
                </svg>
              ) : null}
              {isEditing ? "Update" : "Add"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* User List */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              />
            </svg>
          </div>
        ) : error ? (
          <p className="text-center py-8 text-red-600 font-medium">{error}</p>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                  <th className="py-4 px-6">Username</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                .filter((user) => user.role !== "admin")
                .map((user) => (
                  <tr
                    key={user._id}
                    className="border-t hover:bg-gray-50 transition-all"
                  >
                    <td className="py-4 px-6">{user.username}</td>
                    <td className="py-4 px-6">{user.email}</td>
                    <td className="py-4 px-6 capitalize">{user.role}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="py-4 px-6 flex gap-3">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600 transition-all"
                        aria-label="Edit user"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleBlockUser(user._id)}
                        className={`px-4 py-1 rounded-lg text-white transition-all ${
                          user.isBlocked
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                        aria-label={user.isBlocked ? "Unblock user" : "Block user"}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 transition-all"
                        aria-label="Delete user"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500 italic">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserManagement;