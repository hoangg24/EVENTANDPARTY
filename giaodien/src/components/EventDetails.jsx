import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Info,
  Tag,
  ChevronLeft,
  Plus,
  Edit,
  Trash2,
  Package,
  Save,
} from "lucide-react";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isEditingService, setIsEditingService] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState(1);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    category: "",
    image: null,
  });

  useEffect(() => {
    fetchEventDetails();
    fetchServices();
    fetchCategories();
    fetchUserInfo();
  }, [eventId]);

  const fetchUserInfo = () => {
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("userId");
    setUserRole(role);
    setUserId(id);
  };

  const fetchEventDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/event/${eventId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvent(response.data);
      setFormData({
        name: response.data.name,
        date: response.data.date.split("T")[0], // Format for input type="date"
        location: response.data.location,
        description: response.data.description,
        category: response.data.category._id,
        image: null,
      });
    } catch (error) {
      console.error("Error fetching event details:", error);
      alert("Unable to load event details!");
      navigate("/eventlist");
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/services`);
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
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

  const canEditEvent = event?.createdBy === userId || userRole === "admin";

  const handleAddService = async () => {
    if (!selectedService || quantity < 1) {
      alert("Please select a service and enter a valid quantity!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/event/${eventId}/add-service`,
        { serviceId: selectedService, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Service added successfully!");
      fetchEventDetails();
      setSelectedService("");
      setQuantity(1);
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to add service!");
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/event/${eventId}/remove-service/${serviceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Service removed successfully!");
      fetchEventDetails();
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to remove service!");
    }
  };

  const handleEditService = async () => {
    if (editingQuantity < 1) {
      alert("Quantity must be greater than 0!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/event/${eventId}/update-service/${isEditingService}`,
        { quantity: editingQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Service updated successfully!");
      setIsEditingService(null);
      fetchEventDetails();
    } catch (error) {
      console.error("Error editing service:", error);
      alert("Failed to update service!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      if (formData.name !== event.name) data.append("name", formData.name);
      if (formData.date !== event.date.split("T")[0])
        data.append("date", formData.date);
      if (formData.location !== event.location)
        data.append("location", formData.location);
      if (formData.description !== event.description)
        data.append("description", formData.description);
      if (formData.category !== event.category._id)
        data.append("category", formData.category);
      if (formData.image) data.append("image", formData.image);

      if (data.entries().next().done) {
        alert("No changes detected!");
        return;
      }

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/event/update-partial/${eventId}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Event updated successfully!");
      setIsEditingEvent(false);
      fetchEventDetails();
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-indigo-600 hover:text-indigo-800 transition-all duration-300 group"
        >
          <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-lg font-medium">Back to Event List</span>
        </button>

        {event ? (
          <>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold">{event.name}</h2>
                  {canEditEvent && !isEditingEvent && (
                    <button
                      onClick={() => setIsEditingEvent(true)}
                      className="p-2 text-white hover:bg-indigo-700 rounded-lg transition-all duration-200"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-6 mt-4">
                  <div className="flex items-center bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                    <Calendar className="w-5 h-5 mr-3 text-indigo-200" />
                    <span className="font-medium">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 space-y-6">
                {isEditingEvent ? (
                  <form onSubmit={handleUpdateEvent} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location.name}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">
                          Category
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="" disabled>
                            Select Category
                          </option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        rows="4"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Image
                      </label>
                      {event.image && (
                        <img
                          src={`${import.meta.env.API_IMAGE}${event.image}`}
                          alt={event.name}
                          className="w-32 h-32 object-cover rounded-lg mb-2"
                        />
                      )}
                      <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="w-full p-3 border border-gray-200 rounded-lg"
                        accept="image/*"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
                      >
                        <Save className="w-5 h-5 inline mr-2" /> Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingEvent(false)}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {event.image && (
                      <div className="relative w-full rounded-xl overflow-hidden shadow-lg">
                        <div className="aspect-w-16 aspect-h-9">
                          <img
                            src={`${import.meta.env.API_IMAGE}${event.image}`}
                            alt={event.name}
                            className="w-full h-auto object-contain bg-gray-100"
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                      <MapPin className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-indigo-900 mb-1">
                          Location
                        </h3>
                        <p className="text-indigo-700 leading-relaxed">
                          {event.location.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <Info className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-purple-900 mb-1">
                          Description
                        </h3>
                        <p className="text-purple-700 leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <Tag className="w-5 h-5 text-gray-600" />
                      <p className="text-gray-700">{event.category.name}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {canEditEvent && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <div className="flex items-center mb-6">
                  <Plus className="w-6 h-6 text-indigo-600 mr-2" />
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Add a Service
                  </h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full sm:flex-1 p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a Service</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name} - {service.description} -{" "}
                        {service.price.toLocaleString()} VND
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value)))
                    }
                    min="1"
                    className="w-24 p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Qty"
                  />
                  <button
                    onClick={handleAddService}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
                  >
                    Add Service
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <Package className="w-6 h-6 text-indigo-600 mr-2" />
                <h3 className="text-2xl font-semibold text-gray-800">
                  Service List
                </h3>
              </div>
              {event.services.length > 0 ? (
                <ul className="space-y-4">
                  {event.services.map((s) => (
                    <li
                      key={s._id}
                      className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {s.service.name}
                          </h4>
                          <p className="text-gray-600">
                            {s.service.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {s.quantity}
                          </p>
                        </div>
                        {canEditEvent && (
                          <div className="flex gap-2">
                            {isEditingService === s.service._id ? (
                              <>
                                <input
                                  type="number"
                                  value={editingQuantity}
                                  onChange={(e) =>
                                    setEditingQuantity(
                                      Math.max(1, parseInt(e.target.value))
                                    )
                                  }
                                  className="w-20 p-2 border border-gray-200 rounded-lg"
                                />
                                <button
                                  onClick={handleEditService}
                                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setIsEditingService(null)}
                                  className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setIsEditingService(s.service._id);
                                    setEditingQuantity(s.quantity);
                                  }}
                                  className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteService(s.service._id)
                                  }
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                  <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg">
                    No services added yet.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="text-gray-500 font-medium">
              Loading event details...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;