import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";

const PaymentResult = () => {
  const query = new URLSearchParams(useLocation().search);
  const navigate = useNavigate(); // Hook for navigation
  const resultCode = query.get("resultCode");
  const message = query.get("message");
  const orderId = query.get("orderId");
  const amount = query.get("amount");
  const transId = query.get("transId");
  const responseTime = query.get("responseTime");
  const extraData = query.get("extraData");
  const signature = query.get("signature");

  useEffect(() => {
    if (resultCode === "0") {
      axios
        .post(`${import.meta.env.VITE_API_URL}/payments/momo/notify`, {
          orderId,
          resultCode: parseInt(resultCode, 10),
          amount: parseInt(amount, 10),
          message,
          transId: parseInt(transId, 10),
          responseTime: parseInt(responseTime, 10),
          extraData,
          signature,
        })
        .then((response) => {
          console.log("IPN notification sent successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error sending IPN notification:", error);
        });
    }
  }, [resultCode, orderId, amount, message, transId, responseTime, extraData, signature]);

  const formattedAmount = amount
    ? new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount)
    : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 hover:scale-[1.02]">
        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          {resultCode === "0" ? (
            <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 animate-pulse" />
          )}
        </div>

        {/* Title */}
        <h1
          className={`text-2xl font-bold text-center mb-4 ${
            resultCode === "0" ? "text-green-600" : "text-red-600"
          }`}
        >
          {resultCode === "0" ? "Thanh Toán Thành Công!" : "Thanh Toán Thất Bại!"}
        </h1>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">{message}</p>

        {/* Payment Details */}
        {(orderId || amount || transId) && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            {orderId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Mã đơn hàng:</span>
                <span className="font-medium">{orderId}</span>
              </div>
            )}
            {amount && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Số tiền:</span>
                <span className="font-medium text-blue-600">{formattedAmount}</span>
              </div>
            )}
            {transId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Mã giao dịch:</span>
                <span className="font-medium">{transId}</span>
              </div>
            )}
          </div>
        )}

        {/* Back to Invoices Button */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/invoices")}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Xem hóa đơn
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;