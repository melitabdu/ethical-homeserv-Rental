import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const [newDate, setNewDate] = useState(null);
  const [message, setMessage] = useState("");

  // 🧠 Normalize a date to yyyy-mm-dd (for backend consistency)
  const normalizeDate = (date) => new Date(date).toISOString().split("T")[0];

  // 📥 Fetch provider's unavailable dates
  const fetchUnavailableDates = async () => {
    if (!token) return;
    try {
      const res = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDates(res.data);
    } catch (err) {
      console.error("Fetch unavailable dates error:", err.response?.data || err.message);
    }
  };

  // 📥 Fetch provider's booked dates (from bookings)
  const fetchBookedDates = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BACKEND_BASE}/api/bookings/provider`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const booked = res.data.map((b) => normalizeDate(b.date));
      setBookedDates(booked);
    } catch (err) {
      console.error("Fetch booked dates error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchUnavailableDates();
    fetchBookedDates();
  }, [token]);

  // ❌ Check if a date is already booked or unavailable
  const isUnavailable = (date) => {
    const norm = normalizeDate(date);
    return bookedDates.includes(norm) || dates.some((d) => normalizeDate(d.date) === norm);
  };

  // ➕ Add a new unavailable date
  const handleAddDate = async () => {
    if (!newDate) return alert("Please select a date");
    if (isUnavailable(newDate)) return alert("This date is already booked or unavailable");

    try {
      const res = await axios.post(
        API_BASE_URL,
        { date: normalizeDate(newDate) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDates((prev) => [...prev, res.data]);
      setNewDate(null);
      setMessage("✅ Date added successfully");
    } catch (err) {
      console.error("Add date error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "❌ Failed to add date");
    }
  };

  // 🗑️ Delete an unavailable date
  const handleDeleteDate = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDates((prev) => prev.filter((d) => d._id !== id));
      setMessage("🗑️ Date removed successfully");
    } catch (err) {
      console.error("Delete date error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "❌ Failed to delete date");
    }
  };

  return (
    <div className="unavailable-dates-card">
      <h3>📅 Manage Unavailable Dates</h3>
      {message && <p className="form-message">{message}</p>}

      {/* --- Add New Date Section --- */}
      <div className="date-input-section">
        <DatePicker
          selected={newDate}
          onChange={(date) => setNewDate(date)}
          minDate={new Date()}
          placeholderText="Select a date"
          dateFormat="yyyy-MM-dd"
          className="datepicker-input"
        />
        <button onClick={handleAddDate}>➕ Add</button>
      </div>

      {/* --- List of Unavailable Dates --- */}
      <ul className="dates-list">
        {dates.map((item) => {
          const norm = normalizeDate(item.date);
          const booked = bookedDates.includes(norm);
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
