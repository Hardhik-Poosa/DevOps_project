import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return isAuthenticated && user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
