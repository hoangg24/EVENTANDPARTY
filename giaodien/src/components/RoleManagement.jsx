import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);

  // Fetch roles
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/roles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRoles(res.data);
    } catch (err) {
      toast.error("Failed to load roles!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_API_URL}/roles/${editingRoleId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Role updated!");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/roles`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Role created!");
      }
      fetchRoles();
      resetForm();
    } catch (err) {
      toast.error("Failed to save role.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role) => {
    setFormData({ name: role.name });
    setIsEditing(true);
    setEditingRoleId(role._id);
  };

  const handleDelete = async (roleId) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/roles/${roleId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Role deleted.");
        fetchRoles();
      } catch (err) {
        toast.error("Failed to delete role.");
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "" });
    setIsEditing(false);
    setEditingRoleId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        Role Management
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Role" : "Add Role"}</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter role name"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isEditing ? "Update" : "Add"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Role List */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        {loading ? (
          <p className="text-center text-blue-600">Loading...</p>
        ) : roles.length === 0 ? (
          <p className="text-center text-gray-500 italic">No roles found.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="py-3 px-6">Role Name</th>
                <th className="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-6">{role.name}</td>
                  <td className="py-3 px-6 flex gap-3">
                    <button
                      onClick={() => handleEdit(role)}
                      className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(role._id)}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RoleManagement;
