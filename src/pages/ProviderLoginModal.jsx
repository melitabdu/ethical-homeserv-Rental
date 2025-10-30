import React, { useState } from "react";
import axios from "axios";
import { useProviderAuth } from "../context/ProviderAuthContext";
import { useNavigate } from "react-router-dom";

// ✅ Use environment variable with fallback (for safety)
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.trim() ||
  "https://home-service-backend-3qy2.onrender.com";

const ProviderLogin = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginProvider } = useProviderAuth();
  const navigate = useNavigate();

  console.log("🔍 API_BASE_URL:", API_BASE_URL); // Debug check

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/providers/auth/login`, {
        phone,
        password,
      });

      // ✅ Save token to context
      loginProvider(res.data.token);

      alert(`Welcome, ${res.data.name}`);
      navigate("/provider/dashboard"); // Make sure route matches your App.jsx
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "❌ Login failed, try again");
    }
  };

  return (
    <div className="login-page">
      <h2>Provider Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default ProviderLogin;
