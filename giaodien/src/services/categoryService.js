import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/categories`;

// Lấy danh sách Category
export const getCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Lấy chi tiết một Category
export const getCategoryById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Thêm mới Category
export const createCategory = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// Cập nhật Category
export const updateCategory = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

// Xóa Category
export const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
