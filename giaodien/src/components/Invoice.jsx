import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Receipt, 
  Package, 
  ChevronLeft, 
  FileCheck, 
  AlertCircle,
  DollarSign,
  Loader2
} from 'lucide-react';

const Invoice = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canCreateInvoice, setCanCreateInvoice] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const eventData = response.data;
      setEvent(eventData);

      const tempInvoice = {
        event: {
          name: eventData.name,
          date: eventData.date,
          location: eventData.location,
        },
        services: eventData.services.map((service) => ({
          name: service.service.name,
          price: service.service.price,
          quantity: service.quantity,
        })),
        totalAmount: eventData.services.reduce(
          (total, service) => total + service.service.price * service.quantity,
          0
        ),
      };

      setInvoice(tempInvoice);

      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('role');
      const hasPermission =
        userRole === 'admin' || eventData.isPublic || eventData.createdBy === userId;

      setCanCreateInvoice(hasPermission);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event details:', error);
      alert('Failed to load event details!');
      setLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/invoices/create`,
        { eventId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Invoice created successfully!');
      navigate('/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice!');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-indigo-600 hover:text-indigo-800 transition-all duration-300 group"
        >
          <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-lg font-medium">Back to Events</span>
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-4">
            <Receipt className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Invoice Preview
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="text-gray-600 font-medium">Generating invoice preview...</p>
          </div>
        ) : event && invoice ? (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden transform transition-all hover:shadow-2xl">
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6">
              <h3 className="text-2xl font-bold mb-2">{invoice.event.name}</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 opacity-75" />
                  <span>
                    {new Date(invoice.event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 opacity-75" />
                  <span>{invoice.event.location?.name}</span>
                </div>
              </div>
            </div>

            {/* Services List */}
            <div className="px-8 py-6">
              <div className="flex items-center mb-6">
                <Package className="w-6 h-6 text-indigo-600 mr-2" />
                <h4 className="text-xl font-semibold text-gray-800">Services</h4>
              </div>
              
              <div className="space-y-4 mb-8">
                {invoice.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-800">{service.name}</h5>
                      <p className="text-sm text-gray-600">Quantity: {service.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(service.price)}</p>
                      <p className="text-sm text-gray-600">
                        Total: {formatCurrency(service.price * service.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Amount */}
              <div className="border-t border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-center bg-indigo-50 p-6 rounded-xl">
                  <div className="flex items-center">
                    <DollarSign className="w-6 h-6 text-indigo-600 mr-2" />
                    <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                  </div>
                  <span className="text-2xl font-bold text-indigo-600">
                    {formatCurrency(invoice.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                {canCreateInvoice ? (
                  <button
                    onClick={handleCreateInvoice}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                  >
                    <FileCheck className="w-5 h-5 mr-2" />
                    Create Official Invoice
                  </button>
                ) : (
                  <div className="flex items-center text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <p className="text-sm">
                      You don't have permission to create an invoice for this event.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium">No invoice information found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoice;