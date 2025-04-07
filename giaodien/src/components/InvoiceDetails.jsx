import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Receipt, ArrowLeft, Calendar, MapPin, Package, CreditCard, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchInvoiceDetails();
  }, [id]);

  const fetchInvoiceDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoice(response.data);
      setStatus(response.data.status);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      alert('Failed to load invoice details!');
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_URL}/invoices/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Invoice status updated successfully!');
      fetchInvoiceDetails();
    } catch (error) {
      console.error('Error updating invoice status:', error);
      alert('Failed to update invoice status!');
    }
  };

  const canEditInvoice = localStorage.getItem('role') === 'admin';

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'Canceled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Canceled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)} // Changed to navigate back
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="flex items-center">
            <Receipt className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Invoice Details
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="text-gray-500 font-medium">Loading invoice details...</p>
          </div>
        ) : invoice ? (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            {/* Event Information */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 text-white">
              <h2 className="text-2xl font-bold mb-4">{invoice.event.name}</h2>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 opacity-75" />
                  <span>{new Date(invoice.event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 opacity-75" />
                  <span>{invoice.event.location}</span>
                </div>
              </div>
            </div>

            {/* Services and Status */}
            <div className="p-6 grid gap-6 md:grid-cols-2">
              {/* Services */}
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <Package className="w-5 h-5 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Services</h3>
                </div>
                <div className="space-y-3">
                  {invoice.services.map((service) => (
                    <div
                      key={service.service._id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{service.service.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {service.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {service.price.toLocaleString()} VND
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and Total */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-4">
                    <CreditCard className="w-5 h-5 text-indigo-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Payment Status</h3>
                  </div>
                  <div className={`p-4 rounded-lg border ${getStatusColor(status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getStatusIcon(status)}
                        <span className="ml-2 font-medium">{status}</span>
                      </div>
                      {canEditInvoice && (
                        <select
                          className="ml-4 px-3 py-1.5 rounded-md border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Canceled">Canceled</option>
                        </select>
                      )}
                    </div>
                    {canEditInvoice && (
                      <button
                        onClick={handleUpdateStatus}
                        className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
                      >
                        Update Status
                      </button>
                    )}
                  </div>
                </div>

                {/* Total Amount */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {invoice.totalAmount.toLocaleString()} VND
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Invoice Not Found</h3>
            <p className="text-gray-600">The requested invoice could not be found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetails;