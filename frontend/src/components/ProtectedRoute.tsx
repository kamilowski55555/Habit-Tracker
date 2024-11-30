import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/jwt'; // Assuming this is your auth check logic

interface ProtectedRouteProps {
    element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const token = localStorage.getItem('token');

    // Redirect to login if token is missing or expired
    if (!token || isTokenExpired(token)) {
        return <Navigate to="/login" replace />;
    }

    return element;
};

export default ProtectedRoute;
