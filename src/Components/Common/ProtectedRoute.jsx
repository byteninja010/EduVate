import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ACCOUNT_TYPE } from '../../utils/constants';

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  allowedAccountTypes = [], 
  redirectTo = '/login' 
}) => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const location = useLocation();

  // If authentication is not required, render children
  if (!requireAuth) {
    return children;
  }

  // Check if user is authenticated
  if (!token) {
    // Redirect to login with return URL
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If no specific account types are required, just check authentication
  if (allowedAccountTypes.length === 0) {
    return children;
  }

  // Check if user's account type is allowed
  if (!user || !allowedAccountTypes.includes(user.accountType)) {
    // Redirect to unauthorized page or dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has the right account type
  return children;
};

export default ProtectedRoute;
