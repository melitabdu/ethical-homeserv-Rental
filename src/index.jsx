// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ProviderAuthProvider } from "./context/ProviderAuthContext";
import { OwnerAuthProvider } from "./context/OwnerAuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Wrap with both providers, independent */}
      <ProviderAuthProvider>
        <OwnerAuthProvider>
          <App />
        </OwnerAuthProvider>
      </ProviderAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
