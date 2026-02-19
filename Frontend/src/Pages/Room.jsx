import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../Pages/Room.css";

export default function Room() {
  const [rooms, setRooms] = useState([]);
  const { hotel_id } = useParams();

  const fetchrooms = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/hotels/${hotel_id}/rooms`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchrooms();
  }, [hotel_id]);

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
      fetchrooms();
    } catch (error) {
      alert(error.response?.data?.message || "Lock failed");
    }
  };

  return (
    <div className="rooms-container">
      <h2 className="rooms-title">Rooms for Hotel ID: {hotel_id}</h2>

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
}
