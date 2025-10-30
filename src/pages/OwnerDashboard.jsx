// src/pages/OwnerDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import api from "../api"; // centralized axios instance
import { useOwnerAuth } from "../context/OwnerAuthContext";
import "./OwnerDashboard.css";

// ✅ Updated API base URL for deployed backend
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.trim() ||
  "https://home-service-backend-3qy2.onrender.com";

const OwnerDashboard = () => {
  const { token, logoutOwner } = useOwnerAuth();
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch owner's bookings
  const fetchBookings = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get(`${API_BASE_URL}/api/rental-bookings/owner`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setMessage("❌ Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ✅ Socket.IO real-time updates
  useEffect(() => {
    if (!token) return;

    const socket = io(API_BASE_URL, {
      auth: { token },
    });

    socket.on("newBooking", (newBooking) => {
      setBookings((prev) => [newBooking, ...prev]);
    });

    socket.on("bookingUpdated", (updatedBooking) => {
      setBookings((prev) =>
        prev.map((b) => (b._id === updatedBooking._id ? updatedBooking : b))
      );
    });

    socket.on("bookingDeleted", (deletedBookingId) => {
      setBookings((prev) => prev.filter((b) => b._id !== deletedBookingId));
    });

    return () => socket.disconnect();
  }, [token]);

  // ✅ Update booking status
  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await api.patch(
        `${API_BASE_URL}/api/rental-bookings/owner/${bookingId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
      );
      setMessage(`✅ Booking ${status}`);
    } catch (err) {
      console.error("❌ Update error:", err);
      setMessage(err.response?.data?.message || "❌ Failed to update booking");
    }
  };

  // ✅ Delete booking
  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      await api.delete(`${API_BASE_URL}/api/rental-bookings/owner/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      setMessage("🗑️ Booking deleted");
    } catch (err) {
      console.error("❌ Delete error:", err);
      setMessage(err.response?.data?.message || "❌ Failed to delete booking");
    }
  };

  // ✅ Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  if (loading) return <p className="loading-text">Loading bookings...</p>;

  return (
    <div className="owner-dashboard">
      <header className="dashboard-header">
        <h2>📋 Owner Dashboard</h2>
        <button onClick={logoutOwner} className="logout-btn">
          🚪 Logout
        </button>
      </header>

      {message && <p className="info-message">{message}</p>}

      {bookings.length === 0 ? (
        <p className="empty-text">No bookings found.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => {
            const customer = booking.renterContact || {};
            return (
              <div key={booking._id} className="booking-card">
                <h3>🏠 {booking.propertyId?.title || "Property"}</h3>

                <p><strong>Status:</strong> {booking.status}</p>
                <p>
                  <strong>Payment:</strong>{" "}
                  {booking.paymentStatus === "paid" ? "✅ Paid" : "❌ Unpaid"}
                </p>
                <p>
                  <strong>Dates:</strong>{" "}
                  {new Date(booking.startDate).toLocaleDateString()} -{" "}
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
                <p><strong>Total Price:</strong> ${booking.totalPrice}</p>

                <div className="customer-info">
                  <h4>Customer Info:</h4>
                  {booking.paymentStatus === "paid" ? (
                    <>
                      <p>👤 {customer.fullName}</p>
                      <p>📞 {customer.phone}</p>
                      <p>🏠 {customer.address}</p>
                      <p>📧 {customer.email}</p>
                      <p>📝 <strong>Notes:</strong> {customer.notes || "No notes provided"}</p>
                    </>
                  ) : (
                    <p className="hidden-info">🔒 Hidden until payment is confirmed</p>
                  )}
                </div>

                <div className="actions">
                  {booking.status === "pending" && (
                    <select
                      onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Update Status</option>
                      <option value="owner_confirm">✅ Confirm</option>
                      <option value="rejected">❌ Reject</option>
                    </select>
                  )}

                  {["rejected", "completed"].includes(booking.status) && (
                    <button
                      onClick={() => handleDelete(booking._id)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
