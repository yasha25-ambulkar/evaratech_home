import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, UserRole } from '../../store/authStore';

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
    redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    allowedRoles,
    redirectTo = '/login'
}) => {
    const { isAuthenticated, user, isLoading } = useAuthStore();

    if (isLoading) {
        return null; // Or a smaller loading spinner
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
