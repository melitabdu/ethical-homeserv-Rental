import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OwnerLoginModal from "./OwnerLoginModal";
import ProviderLoginModal from "./ProviderLoginModal";
import logo from "../assets/logonav.png";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [showOwnerLogin, setShowOwnerLogin] = useState(false);
  const [showProviderLogin, setShowProviderLogin] = useState(false);

  return (
    <div className="homepage-container">
      {/* Navbar-style top bar */}
      <nav className="homepage-nav">
        <div className="nav-left">
          <img src={logo} alt="App Logo" className="homepage-logo" />
          <span className="homepage-brand">At Your Service</span>
        </div>

        <div className="nav-right">
          <button
            className="homepage-btn owner-btn"
            onClick={() => setShowOwnerLogin(true)}
          >
            Owner Login
          </button>
          <button
            className="homepage-btn provider-btn"
            onClick={() => setShowProviderLogin(true)}
          >
            Provider Login
          </button>
        </div>
      </nav>

      <div className="homepage-content">
        <h1>Welcome to At Your Service</h1>
        <p>Connecting service providers and owners with ease.</p>
      </div>

      {/* Owner Login Modal */}
      {showOwnerLogin && (
        <OwnerLoginModal
          isOpen={showOwnerLogin}
          onClose={() => setShowOwnerLogin(false)}
          onSuccess={() => navigate("/owner/dashboard")}
        />
      )}

      {/* Provider Login Modal */}
      {showProviderLogin && (
        <ProviderLoginModal
          isOpen={showProviderLogin}
          onClose={() => setShowProviderLogin(false)}
          onSuccess={() => navigate("/provider/dashboard")}
        />
      )}
    </div>
  );
};

export default HomePage;
