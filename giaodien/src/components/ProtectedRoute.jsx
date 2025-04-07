import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../store/UserContext.jsx';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useContext(UserContext);

    // Nếu đang loading thì không render gì
    if (loading) {
        return <div>Loading...</div>;
    }

    // Nếu không có user hoặc vai trò không phù hợp
    if (!user || user.role !== requiredRole) {
        return <Navigate to="/unauthorized" />;
    }

    // Nếu user có quyền, render children (component được bảo vệ)
    return children;
};

export default ProtectedRoute;
