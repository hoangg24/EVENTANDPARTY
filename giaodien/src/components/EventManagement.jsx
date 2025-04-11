import React, { useState, useEffect } from "react";
import { getEvents, deleteEvent } from "../services/eventService";
import { useNavigate } from "react-router-dom";
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

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Unable to load event list!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setLoading(true);
      try {
        await deleteEvent(id);
        toast.success("Event deleted successfully!");
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Unable to delete event!");
      } finally {
        setLoading(false);
      }
    }
  };

  // Prepare data for the chart
  const eventCategories = events.reduce((acc, event) => {
    const category = event.category?.name || "Uncategorized";
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {});

  const chartData = Object.keys(eventCategories).map((category) => ({
    name: category,
    count: eventCategories[category],
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Event List */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Event List</h3>
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
        ) : events.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {events.map((event) => (
              <li
                key={event._id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 hover:bg-gray-50 transition-all duration-200 rounded-lg px-4"
              >
                <div className="mb-4 md:mb-0">
                  <h4 className="font-semibold text-lg text-gray-800">
                    {event.name}
                  </h4>
                  <p className="text-gray-600">
                    Date: {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    Category: {event.category?.name}
                  </p>
                  <p className="text-gray-600">Location: {event.location}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewDetails(event._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                    aria-label="View event details"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                    aria-label="Delete event"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-8 text-gray-500 italic">
            No events found.
          </p>
        )}
      </div>

      {/* Event Analysis */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4 mt-8">
        Event Analysis
      </h3>
      <div className="bg-white shadow-lg rounded-xl p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EventManagement;