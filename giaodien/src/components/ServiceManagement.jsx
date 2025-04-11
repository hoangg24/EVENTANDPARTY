import React, { useState, useEffect } from "react";
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
} from "../services/serviceService";
import { getServiceUsage } from "../services/eventService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [serviceUsage, setServiceUsage] = useState([]); // New state for service usage data
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    quantity: 0,
    price: 0,
  });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
    fetchServiceUsage();
  }, []);

  const fetchServiceUsage = async () => {
    try {
      const data = await getServiceUsage();
      const formattedData = Object.keys(data).map((key) => ({
        name: key,
        quantity: data[key].quantity,
        price: data[key].price,
      }));
      setServiceUsage(formattedData);
    } catch (error) {
      console.error("Error fetching service usage:", error);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
      setError("Unable to load service list!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingServiceId) {
        await updateService(editingServiceId, serviceForm);
        toast.success("Service updated successfully!");
      } else {
        await createService(serviceForm);
        toast.success("Service added successfully!");
      }
      resetForm();
      fetchServices();
    } catch (error) {
      console.error("Error adding/updating service:", error);
      toast.error("Unable to add/update service!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setLoading(true);
      try {
        await deleteService(id);
        toast.success("Service deleted successfully!");
        fetchServices();
      } catch (error) {
        console.error("Error deleting service:", error);
        toast.error("Unable to delete service!");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (service) => {
    setServiceForm({
      name: service.name,
      description: service.description,
      quantity: service.quantity,
      price: service.price,
    });
    setEditingServiceId(service._id);
  };

  const resetForm = () => {
    setServiceForm({ name: "", description: "", quantity: 0, price: 0 });
    setEditingServiceId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        Service Management
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 mb-10 transition-all duration-300 hover:shadow-xl"
      >
        <h3 className="text-xl font-semibold text-gray-700 mb-6">
          {editingServiceId ? "Update Service" : "Add New Service"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Name
            </label>
            <input
              type="text"
              placeholder="Enter service name"
              value={serviceForm.name}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, name: e.target.value })
              }
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              placeholder="Enter quantity"
              value={serviceForm.quantity}
              onChange={(e) =>
                setServiceForm({
                  ...serviceForm,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
              required
              min="0"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter service description"
              value={serviceForm.description}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, description: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (VNĐ)
            </label>
            <input
              type="text"
              placeholder="Enter price"
              value={serviceForm.price}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setServiceForm({
                  ...serviceForm,
                  price: parseFloat(value) || 0,
                });
              }}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex gap-4 mt-6">
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
            {editingServiceId ? "Update" : "Add"}
          </button>
          {editingServiceId && (
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

      {/* Service List */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-10">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">
          Service List
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
        ) : services.length > 0 ? (
          <ul className="space-y-4">
            {services.map((service) => (
              <li
                key={service._id}
                className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 transition-all duration-200"
              >
                <div className="mb-4 md:mb-0">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {service.name}
                  </h4>
                  <p className="text-gray-600">{service.description}</p>
                  <p className="text-gray-700">
                    Quantity: {service.quantity} - Price:{" "}
                    {service.price.toLocaleString()} VNĐ
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(service)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all"
                    aria-label="Edit service"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                    aria-label="Delete service"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-8 text-gray-500 italic">
            No services found.
          </p>
        )}
      </div>

      {/* Bar Chart */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-10">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">
          Service Usage Chart
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={serviceUsage}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#8884d8"
              label={{ value: "Quantity", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#82ca9d"
              label={{
                value: "Price (VNĐ)",
                angle: 90,
                position: "insideRight",
              }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border rounded shadow">
                      <p className="font-semibold">{label}</p>
                      <p style={{ color: "#8884d8" }}>
                        Quantity: {payload[0].value}
                      </p>
                      <p style={{ color: "#82ca9d" }}>
                        Price: {payload[1].value.toLocaleString()} VNĐ
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="quantity"
              fill="#8884d8"
              name="Quantity"
              barSize={30}
            />
            <Bar
              yAxisId="right"
              dataKey="price"
              fill="#82ca9d"
              name="Price (VNĐ)"
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ServiceManagement;