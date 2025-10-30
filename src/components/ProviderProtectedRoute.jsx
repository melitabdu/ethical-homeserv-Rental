// src/components/ProviderProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useProviderAuth } from "../context/ProviderAuthContext";

const ProviderProtectedRoute = ({ children }) => {
  const { token } = useProviderAuth();

  if (!token) {
    return <Navigate to="/" replace />; // redirect if not logged in
  }

  return children;
};

export default ProviderProtectedRoute;
