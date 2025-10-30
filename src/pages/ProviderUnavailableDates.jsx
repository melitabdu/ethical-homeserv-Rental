// src/pages/ProviderUnavailableDates.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useProviderAuth } from "../context/ProviderAuthContext";
import "./ProviderUnavialbleDates.css";

const BACKEND_BASE =
  process.env.REACT_APP_API_BASE_URL?.trim() ||
  "https://home-service-backend-3qy2.onrender.com";

const API_BASE_URL = `${BACKEND_BASE}/api/providers/unavailable-dates`;

const ProviderUnavailableDates = () => {
  const { token } = useProviderAuth();
  const [dates, setDates] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [message, setMessage] = useState("");

  const normalizeDate = (date) => new Date(date).toISOString().split("T")[0];

  // Fetch provider's unavailable dates
  const fetchUnavailableDates = async () => {
    if (!token) return;
    try {
      const res = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDates(res.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    }
  };

  // Fetch provider's booked dates
  const fetchBookedDates = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BACKEND_BASE}/api/bookings/provider`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const booked = res.data.map((b) => normalizeDate(b.date));
      setBookedDates(booked);
    } catch (err) {
      console.error("Booked fetch error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchUnavailableDates();
    fetchBookedDates();
  }, [token]);

  const isUnavailable = (date) => {
    const norm = normalizeDate(date);
    return bookedDates.includes(norm) || dates.some((d) => normalizeDate(d.date) === norm);
  };

  const handleAddDate = async () => {
    if (!newDate) return alert("Please select a date");
    if (isUnavailable(newDate)) return alert("This date is already booked or unavailable");

    try {
      const res = await axios.post(
        API_BASE_URL,
        { date: newDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDates((prev) => [...prev, res.data]);
      setNewDate("");
      setMessage("✅ Date added successfully");
    } catch (err) {
      console.error("Add error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "❌ Failed to add date");
    }
  };

  const handleDeleteDate = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDates((prev) => prev.filter((d) => d._id !== id));
      setMessage("🗑️ Date removed");
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "❌ Failed to delete date");
    }
  };

  return (
    <div className="unavailable-dates-card">
      <h3>📅 Manage Unavailable Dates</h3>
      {message && <p className="form-message">{message}</p>}

      <div className="date-input-section">
        <input
          type="date"
          value={newDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <button onClick={handleAddDate}>➕ Add</button>
      </div>

      <ul className="dates-list">
        {dates.map((item) => {
          const booked = bookedDates.includes(normalizeDate(item.date));
          return (
            <li key={item._id} className={`date-item ${booked ? "inactive" : ""}`}>
              <span>{new Date(item.date).toLocaleDateString()}</span>
              <button onClick={() => handleDeleteDate(item._id)} disabled={booked}>
                ❌
              </button>
            </li>
          );
        })}
      </ul>

      <div className="info-text">
        <p>⚠️ Booked or unavailable dates are blocked (inactive).</p>
      </div>
    </div>
  );
};

export default ProviderUnavailableDates;
