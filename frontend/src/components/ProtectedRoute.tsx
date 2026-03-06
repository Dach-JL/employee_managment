import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface ProtectedRouteProps {
    allowedRoles?: ('admin' | 'employee')[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { token, user } = useAuthStore();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
