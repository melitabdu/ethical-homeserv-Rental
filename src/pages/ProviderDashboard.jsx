// src/pages/ProviderDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import socket from "../socket";
import { useProviderAuth } from "../context/ProviderAuthContext";
import ProviderUnavailableDates from "./ProviderUnavailableDates";
import "./ProviderDashboard.css";

// ✅ Safe API base URL (env + fallback)
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.trim() ||
  "https://home-service-backend-3qy2.onrender.com";

const ProviderDashboard = () => {
  const { token, logoutProvider } = useProviderAuth();
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Fetch provider's bookings
  const fetchBookings = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/bookings/provider`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("❌ Fetch error:", err.message);
      setMessage("❌ Failed to fetch bookings");
    }
  }, [token]);

  // ✅ Update booking status
  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/bookings/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(`✅ Booking marked as ${status}`);
      fetchBookings();
    } catch (err) {
      console.error("Status update error:", err.message);
      setMessage("❌ Failed to update status");
    }
  };

  // ✅ Delete rejected/completed booking
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this rejected/completed booking?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("🗑️ Booking deleted");
      fetchBookings();
    } catch (err) {
      console.error("Delete error:", err.message);
      setMessage("❌ Delete failed");
    }
  };

  // ✅ Fetch initial bookings when token changes
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // ✅ Socket event listeners (real-time updates)
  useEffect(() => {
    socket.on("booking-confirmed", fetchBookings);
    socket.on("booking-updated", fetchBookings);
    socket.on("booking-deleted", fetchBookings);
    socket.on("booking-paid", fetchBookings);

    return () => {
      socket.off("booking-confirmed", fetchBookings);
      socket.off("booking-updated", fetchBookings);
      socket.off("booking-deleted", fetchBookings);
      socket.off("booking-paid", fetchBookings);
    };
  }, [fetchBookings]);

  return (
    <div className="provider-dashboard">
      <h2>🛠️ Provider Dashboard</h2>
      {message && <p className="status-msg">{message}</p>}

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.customer?.name || b.customerName || "N/A"}</td>
                  <td>
                    {b.paid && b.customerPhone ? (
                      <>
                        📞 {b.customerPhone}
                        <br />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(b.customerPhone);
                            alert("Phone number copied!");
                          }}
                          className="copy-btn"
                        >
                          📋 Copy Phone
                        </button>
                      </>
                    ) : (
                      "🔒 Hidden until payment"
                    )}
                  </td>
                  <td>
                    {b.address}
                    {b.paid && b.address && (
                      <div style={{ marginTop: "6px" }}>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            b.address
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="map-link"
                        >
                          📍 See on Map
                        </a>
                      </div>
                    )}
                  </td>
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                  <td>{b.status}</td>
                  <td>
                    {b.status === "request" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(b._id, "confirmed")}
                          className="action-btn confirm"
                        >
                          ✅ Confirm
                        </button>
                        <button
                          onClick={() => handleStatusChange(b._id, "rejected")}
                          className="action-btn reject"
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}

                    {(b.status === "confirmed" ||
                      b.status === "processing") && (
                      <select
                        value={b.status}
                        onChange={(e) =>
                          handleStatusChange(b._id, e.target.value)
                        }
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                      </select>
                    )}

                    {(b.status === "rejected" ||
                      b.status === "completed") && (
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="action-btn delete"
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Unavailable Dates Section */}
      <ProviderUnavailableDates />

      {/* Navigation buttons */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={fetchBookings} className="back-btn">
          🔄 Refresh
        </button>
        <button onClick={logoutProvider} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default ProviderDashboard;
