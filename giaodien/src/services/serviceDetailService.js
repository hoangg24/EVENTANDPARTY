import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3364/api/event';

// Lấy danh sách chi tiết của một dịch vụ
export const getServiceDetails = async (eventId, serviceName) => {
    try {
        const response = await axios.get(`${API_URL}/${eventId}/${serviceName}/details`);
        return response.data.details;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách chi tiết:', error);
        throw error;
    }
};

// Thêm chi tiết vào dịch vụ
export const addServiceDetail = async (eventId, serviceName, data) => {
    try {
        const response = await axios.post(`${API_URL}/${eventId}/${serviceName}/add-detail`, data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi thêm chi tiết dịch vụ:', error);
        throw error;
    }
};

// Xóa chi tiết của dịch vụ
export const deleteServiceDetail = async (eventId, serviceName, detailName) => {
    try {
        const response = await axios.delete(
            `${API_URL}/${eventId}/${serviceName}/remove-detail/${detailName}`
        );
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa chi tiết dịch vụ:', error);
        throw error;
    }
};

// Cập nhật chi tiết của dịch vụ
export const updateServiceDetail = async (eventId, serviceName, detailName, data) => {
    try {
        const response = await axios.put(
            `${API_URL}/${eventId}/${serviceName}/update-detail/${detailName}`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật chi tiết dịch vụ:', error);
        throw error;
    }
};
