import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Image as ImageIcon, Loader2 } from "lucide-react";


function App() {
  const [categories, setCategories] = useState([]);
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    category: "",
    location: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Unable to load category list!");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setEventData({ ...eventData, image: files[0] });
    } else {
      setEventData({ ...eventData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      for (const key in eventData) {
        formData.append(key, eventData[key]);
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/event/create`,
        formData,
        {
          headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccessMessage("Event created successfully!");
      setTimeout(() => {
        navigate("/eventlist");
      }, 1500);
    } catch (error) {
      console.error("Error creating event:", error);
      setError(
        error.response?.data?.message || "Unable to create event. Please try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create New Event</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Share your event with the world. Fill in the details below to create an unforgettable experience.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Success/Error Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <p className="text-green-700">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Event Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Event Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={eventData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter a memorable event name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Date and Category Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="date"
                      name="date"
                      value={eventData.date}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={eventData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="location"
                    value={eventData.location}
                    onChange={handleChange}
                    required
                    placeholder="Enter event location"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  placeholder="Describe your event in detail..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Event Image
                </label>
                <div className="relative">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-12 h-12 mb-4 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                      <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
                    loading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Processing...
                    </>
                  ) : (
                    "Create Event"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;