// src/pages/OwnerLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useOwnerAuth } from "../context/OwnerAuthContext";

// ✅ Use environment variable or fallback
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.trim() ||
  "https://home-service-backend-3qy2.onrender.com";

const OwnerLogin = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginOwner } = useOwnerAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/owners/auth/login`, {
        phone,
        password,
      });

      if (!res.data || !res.data.token) {
        setError("❌ Invalid response from server");
        return;
      }

      // ✅ Save owner info + token to context & localStorage
      loginOwner(res.data);

      // ✅ Redirect to dashboard
      navigate("/owner/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "❌ Login failed, try again");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
      <h2>🏠 Owner Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            required
            style={{ width: "100%", padding: 6 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{ width: "100%", padding: 6 }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 8,
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default OwnerLogin;
