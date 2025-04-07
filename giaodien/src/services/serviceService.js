import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/services`;

// Lấy danh sách tất cả dịch vụ
export const getAllServices = async () => {
    try {
        const response = await axios.get(`${API_URL}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách dịch vụ:', error.response?.data || error.message);
        throw error;
    }
};

// Lấy dịch vụ theo ID
export const getServiceById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy dịch vụ theo ID:', error.response?.data || error.message);
        throw error;
    }
};

// Tạo dịch vụ mới
export const createService = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/create`, data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo dịch vụ mới:', error.response?.data || error.message);
        throw error;
    }
};

// Cập nhật dịch vụ
export const updateService = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật dịch vụ:', error.response?.data || error.message);
        throw error;
    }
};

// Xóa dịch vụ
export const deleteService = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa dịch vụ:', error.response?.data || error.message);
        throw error;
    }
};

