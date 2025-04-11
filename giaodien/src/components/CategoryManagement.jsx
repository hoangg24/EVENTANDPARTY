import React, { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";
import toast from "react-hot-toast";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Unable to load category list!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, formData);
        toast.success("Category updated successfully!");
      } else {
        await createCategory(formData);
        toast.success("Category added successfully!");
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error("Error adding/updating category:", error);
      toast.error("Unable to add/update category!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name });
    setEditingCategoryId(category._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setLoading(true);
      try {
        await deleteCategory(id);
        toast.success("Category deleted successfully!");
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Unable to delete category!");
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "" });
    setEditingCategoryId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        {editingCategoryId ? "Update Category" : "Add New Category"}
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 mb-10 transition-all duration-300 hover:shadow-xl"
      >
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name
          </label>
          <input
            type="text"
            placeholder="Enter category name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            required
          />
        </div>
        <div className="flex gap-4">
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
            {editingCategoryId ? "Update" : "Add"}
          </button>
          {editingCategoryId && (
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

      {/* Category List */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">
          Category List
        </h3>
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
        ) : categories.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {categories.map((category) => (
              <li
                key={category._id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 hover:bg-gray-50 transition-all duration-200 rounded-lg px-4"
              >
                <div className="mb-4 md:mb-0">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {category.name}
                  </h4>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all"
                    aria-label="Edit category"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                    aria-label="Delete category"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-8 text-gray-500 italic">
            No categories found.
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;