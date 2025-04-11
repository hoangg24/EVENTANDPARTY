import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import AboutUs from "./pages/AboutUs.jsx"; // Import the About Us page
import AdminLayout from "./components/AdminLayout.jsx"; // Import AdminLayout
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserManagement from "./components/UserManagement.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import EventManagement from './components/EventManagement.jsx'; 
import ServiceManagement from './components/ServiceManagement.jsx'; 
import Invoice from './components/Invoice.jsx';
import EventList from './components/EventList.jsx';
import EventDetails from './components/EventDetails.jsx';
import InvoiceManagement from './components/InvoiceManagement.jsx';
import InvoiceDetails from './components/InvoiceDetails.jsx';
import CreateEvent from './components/CreateEvent.jsx';
import CategoryManagement from './components/CategoryManagement.jsx';
import PaymentStatus from './components/PaymentStatus.jsx';
import PaymentResult from './components/PaymentResult.jsx';
import ResetPasswordRequest from "./pages/ResetPasswordRequest.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import Blocked from "./pages/Blocked.jsx"
import LocationManagement from './components/LocationManagement.jsx'; 

const LoginSuccess = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const id = params.get('id');
  const username = params.get('username');
  const role = params.get('role');

  if (token && id && username && role) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', id);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    window.location.href = '/';
  }

  return null;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="contact" element={<ContactUs/>}></Route>
        <Route path="events" element={<EventManagement />} />
        <Route path="services" element={<ServiceManagement />} />
        <Route path="events/:eventId/invoices" element={<Invoice />} />
        <Route path="eventlist" element={<EventList />} />
        <Route path="events/:eventId" element={<EventDetails />} />
        <Route path="invoices" element={<InvoiceManagement />} />
        <Route path="invoices/:id" element={<InvoiceDetails />} />
        <Route path="events/create" element={<CreateEvent />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="locations" element={<LocationManagement />} />
        <Route path="payment/status/:orderId" element={<PaymentStatus />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="reset-password-request" element={<ResetPasswordRequest/>}></Route>
        <Route path="reset-password/:token" element={<ResetPassword/>}></Route>
        <Route path="login-success" element={<LoginSuccess />} />
        <Route path="blocked" element={<Blocked />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route path="admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="events" element={<EventManagement />} />
        <Route path="services" element={<ServiceManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="invoices" element={<InvoiceManagement />} />
        <Route path="locations" element={<LocationManagement />} />
      </Route>

      {/* Unauthorized Route */}
      <Route path="unauthorized" element={<Unauthorized />} />
    </Routes>
  );
};

export default App;