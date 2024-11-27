import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/jwt';

const ProtectedRoute = ({ component: Component }: { component: React.ComponentType }) => {
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
        return <Navigate to="/login" />;
    }

    return <Component />;
};

export default ProtectedRoute;
