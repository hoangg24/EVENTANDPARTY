import React, { useState, useEffect } from "react";
import {
    getLocations,
    createLocation,
    updateLocation,
    deleteLocation,
} from "../services/locationService";

const LocationManagement = () => {
    const [locations, setLocations] = useState([]);
    const [formData, setFormData] = useState({ name: "", address: "", city: "", country: "" });
    const [editingLocationId, setEditingLocationId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getLocations();
          setLocations(data);
        } catch (error) {
          console.error("Error fetching locations:", error.message);
          if (error.response && error.response.status === 401) {
            setError("Unauthorized. Please log in again.");
            navigate("/login"); // Chuyển hướng đến trang đăng nhập
          } else {
            setError("Unable to load location list!");
          }
        } finally {
          setLoading(false);
        }
      };
      
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!formData.name.trim() || !formData.address.trim() || !formData.city.trim() || !formData.country.trim()) {
          alert("Please fill out all fields");
          return;
        }
      
        setLoading(true);
        setError(null);
        try {
          if (editingLocationId) {
            await updateLocation(editingLocationId, formData);
            alert("Location updated successfully!");
          } else {
            await createLocation(formData);
            alert("Location added successfully!");
          }
          resetForm();
          fetchLocations();
        } catch (error) {
          console.error("Error adding/updating location:", error.message);
          if (error.response && error.response.status === 401) {
            alert("Unauthorized. Please log in again.");
            navigate("/login"); // Chuyển hướng đến trang đăng nhập
          } else {
            alert("Unable to add/update location!");
          }
        } finally {
          setLoading(false);
        }
      };

    const handleEdit = (location) => {
        setFormData({ name: location.name, address: location.address, city: location.city, country: location.country });
        setEditingLocationId(location._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this location?")) {
            setLoading(true);
            try {
                await deleteLocation(id);
                alert("Location deleted successfully!");
                fetchLocations();
            } catch (error) {
                console.error("Error deleting location:", error.message);
                alert("Unable to delete location!");
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({ name: "", address: "", city: "", country: "" });
        setEditingLocationId(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
                {editingLocationId ? "Update Location" : "Add New Location"}
            </h2>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-xl p-6 mb-10 transition-all duration-300 hover:shadow-xl"
            >
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        placeholder="Enter location name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                        type="text"
                        placeholder="Enter address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                        type="text"
                        placeholder="Enter city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                        type="text"
                        placeholder="Enter country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-400 flex items-center"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
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
                        {editingLocationId ? "Update" : "Add"}
                    </button>
                    {editingLocationId && (
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

            {/* Location List */}
            <div className="bg-white shadow-lg rounded-xl p-6">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">Location List</h3>
                {loading ? (
                    <div className="flex justify-center py-8">
                        <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
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
                ) : locations.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {locations.map((location) => (
                            <li
                                key={location._id}
                                className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 hover:bg-gray-50 transition-all duration-200 rounded-lg px-4"
                            >
                                <div className="mb-4 md:mb-0">
                                    <h4 className="text-lg font-semibold text-gray-800">
                                        {location.name} - {location.city}, {location.country}
                                    </h4>
                                    <p className="text-gray-600">{location.address}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleEdit(location)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all"
                                        aria-label="Edit location"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(location._id)}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                                        aria-label="Delete location"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center py-8 text-gray-500 italic">No locations found.</p>
                )}
            </div>
        </div>
    );
};

export default LocationManagement;