// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProviderDashboard from "./pages/ProviderDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import ProviderProtectedRoute from "./components/ProviderProtectedRoute";
import OwnerProtectedRoute from "./components/OwnerProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* Homepage */}
      <Route path="/" element={<HomePage />} />

      {/* Provider Dashboard (protected) */}
      <Route
        path="/provider/dashboard"
        element={
          <ProviderProtectedRoute>
            <ProviderDashboard />
          </ProviderProtectedRoute>
        }
      />

      {/* Owner Dashboard (protected) */}
      <Route
        path="/owner/dashboard"
        element={
          <OwnerProtectedRoute>
            <OwnerDashboard />
          </OwnerProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
