import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
    role: string | string[];
    children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ role, children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <p style={{ textAlign: 'center' }}>Cargando...</p>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/home" />;
    }

    return children;
};

export default PrivateRoute;
