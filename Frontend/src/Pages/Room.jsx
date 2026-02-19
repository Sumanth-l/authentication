import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Pages/Room.css";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    const res = await axios.get("http://localhost:5000/api/rooms", {
      withCredentials: true,
    });
    setRooms(res.data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ✅ click handler
  const handleRoomClick = async (room_id, status) => {
    if (status !== "AVAILABLE") {
      alert("Room not available ❌");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/room/lock",
        { room_id },
        { withCredentials: true }
      );

      alert(res.data.message);

      // refresh rooms after locking
      fetchRooms();
    } catch (error) {
      alert(error.response?.data?.message || "Lock failed");
    }
  };

  return (
    <div className="rooms-container">
      <h2>Available Rooms</h2>

      <div className="rooms-grid">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => handleRoomClick(room.id, room.status)}
            className={`room-card ${
              room.status === "AVAILABLE" ? "available" : "notavailable"
            }`}
          >
            <h3>Room {room.room_number}</h3>
            <p>{room.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
