import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/event`;


// Hàm để lấy token từ localStorage và thêm vào header
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  if (!token) {
    throw new Error("Không có token! Vui lòng đăng nhập lại.");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`, // Thêm token vào header
    },
  };
};

// Lấy danh sách sự kiện
export const getEvents = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sự kiện:", error);
    throw error;
  }
};

// Tạo sự kiện mới với danh sách dịch vụ
export const createEvent = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/create`,
      data,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo sự kiện:", error);
    throw error;
  }
};

// Xóa sự kiện
export const deleteEvent = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa sự kiện:", error);
    throw error;
  }
};

// Thêm hoặc cập nhật dịch vụ vào sự kiện
export const addServiceToEvent = async (eventId, serviceData) => {
  try {
    const response = await axios.put(
      `${API_URL}/${eventId}/add-service`,
      serviceData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm dịch vụ vào sự kiện:", error);
    throw error;
  }
};

// Cập nhật thông tin sự kiện
export const updateEvent = async (eventId, updatedData) => {
  try {
    const response = await axios.put(
      `${API_URL}/${eventId}`,
      updatedData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật sự kiện:", error);
    throw error;
  }
};

export const getServiceUsage = async () => {
  try {
      const response = await axios.get(`${API_URL}/service-usage`);
      return response.data;
  } catch (error) {
      console.error('Error fetching service usage:', error);
      throw error;
  }
};