import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./BookingModal.css";

const BookingModal = ({ isOpen, onClose, room, refreshRooms }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    check_in: "",
    check_out: "",
    guests: 1,
    payment_method: "CASH",
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen || !room) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!room.id) {
      toast.error("Room ID missing ❌");
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        room_id: room.id,   // ✅ FIXED HERE
        ...formData,
      };

      const res = await axios.post(
        "http://localhost:5000/api/booking/create",
        bookingData,
        { withCredentials: true }
      );

      toast.success(res.data.message);

      refreshRooms();   // refresh availability
      onClose();

    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Book Room {room.room_number}</h2>
        <p>Price: ₹{room.price}</p>

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              required
              value={formData.full_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Check-in Date</label>
            <input
              type="date"
              name="check_in"
              required
              value={formData.check_in}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Check-out Date</label>
            <input
              type="date"
              name="check_out"
              required
              value={formData.check_out}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Guests</label>
            <input
              type="number"
              name="guests"
              min="1"
              required
              value={formData.guests}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
            >
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className={loading ? "btn-confirm disabled" : "btn-confirm"}>
              {loading ? "Confirming..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;