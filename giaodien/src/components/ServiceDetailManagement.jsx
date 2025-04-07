import React, { useState, useEffect } from 'react';
import {
    getServiceDetails,
    addServiceDetail,
    deleteServiceDetail,
    updateServiceDetail,
} from '../services/serviceDetailService';
import { useParams } from 'react-router-dom';

const ServiceDetailManagement = () => {
    const { eventId, serviceName } = useParams();
    const [details, setDetails] = useState([]);
    const [detail, setDetail] = useState({ name: '', description: '' });
    const [editingDetail, setEditingDetail] = useState(null);

    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        try {
            const data = await getServiceDetails(eventId, serviceName);
            setDetails(data);
        } catch (error) {
            alert('Không thể tải danh sách chi tiết!');
        }
    };

    const handleAddDetail = async (e) => {
        e.preventDefault();
        try {
            await addServiceDetail(eventId, serviceName, detail);
            alert('Thêm chi tiết thành công!');
            setDetail({ name: '', description: '' });
            fetchDetails();
        } catch (error) {
            alert('Không thể thêm chi tiết!');
        }
    };

    const handleDeleteDetail = async (detailName) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa chi tiết "${detailName}" không?`)) {
            try {
                await deleteServiceDetail(eventId, serviceName, detailName);
                alert('Xóa chi tiết thành công!');
                fetchDetails();
            } catch (error) {
                alert('Không thể xóa chi tiết!');
            }
        }
    };

    const handleUpdateDetail = async (e) => {
        e.preventDefault();
        try {
            await updateServiceDetail(eventId, serviceName, editingDetail.name, detail);
            alert('Cập nhật chi tiết thành công!');
            setEditingDetail(null);
            setDetail({ name: '', description: '' });
            fetchDetails();
        } catch (error) {
            alert('Không thể cập nhật chi tiết!');
        }
    };

    const handleEditDetail = (detail) => {
        setEditingDetail(detail);
        setDetail(detail);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-green-50 p-8">
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                    Quản lý chi tiết dịch vụ: {serviceName}
                </h1>
                <p className="text-lg text-gray-600 mt-4">
                    Quản lý các chi tiết cụ thể của dịch vụ trong sự kiện
                </p>
            </div>

            {/* Form thêm/sửa chi tiết */}
            <form
                onSubmit={editingDetail ? handleUpdateDetail : handleAddDetail}
                className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto mb-16"
            >
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                    {editingDetail ? 'Cập nhật chi tiết' : 'Thêm chi tiết mới'}
                </h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Tên chi tiết"
                        value={detail.name}
                        onChange={(e) => setDetail({ ...detail, name: e.target.value })}
                        required
                        disabled={!!editingDetail}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <input
                        type="text"
                        placeholder="Mô tả"
                        value={detail.description}
                        onChange={(e) => setDetail({ ...detail, description: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                </div>

                <div className="flex gap-4 mt-6">
                    <button
                        type="submit"
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all"
                    >
                        {editingDetail ? 'Cập nhật' : 'Thêm chi tiết'}
                    </button>
                    {editingDetail && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingDetail(null);
                                setDetail({ name: '', description: '' });
                            }}
                            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all"
                        >
                            Hủy
                        </button>
                    )}
                </div>
            </form>

            {/* Danh sách chi tiết */}
            <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">Danh sách chi tiết</h3>
                <ul className="space-y-4">
                    {details.map((d, index) => (
                        <li
                            key={index}
                            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                        >
                            <div>
                                <h4 className="text-lg font-bold">{d.name}</h4>
                                <p className="text-gray-600">{d.description || 'Không có mô tả'}</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleEditDetail(d)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDeleteDetail(d.name)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                >
                                    Xóa
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ServiceDetailManagement;
