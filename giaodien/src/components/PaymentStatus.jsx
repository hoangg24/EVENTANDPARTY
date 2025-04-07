import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PaymentStatus = () => {
  const { orderId } = useParams(); // Lấy orderId từ URL
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hàm lấy trạng thái thanh toán
    const fetchPaymentStatus = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/payments/status/${orderId}`);
        setPaymentStatus(response.data); // Lưu trạng thái thanh toán vào state
        setLoading(false);
      } catch (err) {
        console.error('Error fetching payment status:', err); // Log lỗi
        setError(err.response?.data?.message || 'Không thể tải trạng thái thanh toán');
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [orderId]);

  // Hiển thị khi đang tải dữ liệu
  if (loading) {
    return <div className="text-center mt-10">Đang tải trạng thái thanh toán...</div>;
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        Lỗi: {error}
      </div>
    );
  }

  // Kiểm tra nếu không có thông tin thanh toán
  if (!paymentStatus) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Không tìm thấy thông tin thanh toán. Vui lòng thử lại.
      </div>
    );
  }

  // Hiển thị trạng thái thanh toán
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Trạng Thái Thanh Toán</h1>
        <p>
          <strong>Order ID:</strong> {paymentStatus.transactionId}
        </p>
        <p>
          <strong>Số Tiền:</strong> {paymentStatus.amount?.toLocaleString()} VND
        </p>
        <p>
          <strong>Trạng Thái:</strong>{' '}
          <span
            className={`font-semibold ${
              paymentStatus.status === 'Completed'
                ? 'text-green-500'
                : paymentStatus.status === 'Pending'
                ? 'text-yellow-500'
                : 'text-red-500'
            }`}
          >
            {paymentStatus.status === 'Completed'
              ? 'Thành Công'
              : paymentStatus.status === 'Pending'
              ? 'Đang Chờ'
              : 'Thất Bại'}
          </span>
        </p>
        <p className="text-sm text-gray-500 mt-4">
          {paymentStatus.status === 'Completed'
            ? 'Cảm ơn bạn đã thanh toán.'
            : paymentStatus.status === 'Pending'
            ? 'Giao dịch của bạn đang chờ xử lý. Vui lòng đợi trong giây lát.'
            : 'Thanh toán không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ.'}
        </p>
      </div>
    </div>
  );
};

export default PaymentStatus;
