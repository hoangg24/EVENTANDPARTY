import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Receipt, Trash2, Eye, CreditCard, Search, RefreshCw } from 'lucide-react';

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/invoices`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setInvoices(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load invoice list! Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`);
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;

    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_API_URL}/invoices/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Invoice deleted successfully!");
      setInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice._id !== invoiceId)
      );
    } catch (error) {
      alert("Unable to delete invoice! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (invoice) => {
    if (invoice.status === "Paid") {
      alert("This invoice has already been paid!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/momo/create`,
        { invoiceId: invoice._id },
        {
          headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.payUrl) {
        window.location.href = response.data.payUrl;
      } else {
        alert("Unable to create payment transaction. Please try again later.");
      }
    } catch (error) {
      alert("An error occurred during payment!");
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => 
    (invoice.event?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Canceled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Receipt className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Invoice Management
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by event name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-full sm:w-64"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <button
              onClick={fetchInvoices}
              className="flex items-center justify-center px-4 py-2 bg-white text-indigo-600 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-all duration-200"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
              <p className="text-gray-500 font-medium">Loading invoices...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                <span className="text-2xl">!</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Invoices</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : filteredInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {invoice.event?.name || "Not specified"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {invoice.totalAmount?.toLocaleString()} VND
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                          {invoice.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewInvoice(invoice._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors duration-200"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                        <button
                          onClick={() => handlePayment(invoice)}
                          disabled={invoice.status === "Paid"}
                          className={`inline-flex items-center px-3 py-1.5 rounded-md transition-colors duration-200 ${
                            invoice.status === "Paid"
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          }`}
                        >
                          <CreditCard className="w-4 h-4 mr-1" />
                          Pay
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Receipt className="w-16 h-16 text-gray-300" />
              <p className="text-gray-500 font-medium">No invoices found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagement;