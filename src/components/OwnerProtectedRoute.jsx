// src/components/OwnerProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useOwnerAuth } from "../context/OwnerAuthContext";

const OwnerProtectedRoute = ({ children }) => {
  const { token } = useOwnerAuth();

  if (!token) {
    return <Navigate to="/" replace />; // redirect if not logged in
  }

  return children;
};

export default OwnerProtectedRoute;
