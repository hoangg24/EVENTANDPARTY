import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/invoices`;

// Tạo hóa đơn
export const createInvoice = async (data) => {
    const response = await axios.post(`${API_URL}/create`, data);
    return response.data;
};

// Lấy tất cả hóa đơn
export const getAllInvoices = async () => {
    const response = await axios.get(`${API_URL}`);
    return response.data;
};

// Lấy chi tiết hóa đơn
export const getInvoiceById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
