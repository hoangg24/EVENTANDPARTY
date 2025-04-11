import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/locations`;

export const getLocations = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createLocation = async (locationData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_URL}`, locationData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updateLocation = async (id, locationData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}/${id}`, locationData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteLocation = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};