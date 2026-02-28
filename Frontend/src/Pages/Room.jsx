import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../Pages/Room.css";
import BookingModal from "../component/BookingModal";
import RoomCalendar from "../component/RoomCalendar";

export default function Room() {
  const { hotel_id } = useParams();
  const[hotel,setHotel] = useState(null);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // 🔹 Fetch rooms
  const fetchRooms = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/hotels/${hotel_id}/rooms`,
        { credentials: "include" }
      );
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.log(error);
    }
  };


    const fechetHotelDetails = async () => {

      try {
        const res=await fetch(`http://localhost:5000/api/hotels/${hotel_id}`);
        const data=await res.json();
        setHotel(data); 
      } catch (error) {
        console.log(error);
      }
    }

  useEffect(() => {
    fetchRooms();
    fechetHotelDetails();
  }, [hotel_id]);

  // 🔒 Lock room before opening modal
  const handleRoomClick = async (room) => {

  if (loading) return;

  if (room.status !== "AVAILABLE") {
    toast.error("Room not available ❌");
    return;
  }

  try {
    setLoading(true);

    await axios.post(
      "http://localhost:5000/api/room/lock",
      { room_id: room.id },
      { withCredentials: true }
    );

    setSelectedRoom(room);
    setIsModalOpen(true);

  } catch (error) {

    if (error.response?.status === 401 || error.response?.status === 403) {
      toast.error("🔐 Please login before booking");
      return;
    }

    toast.error(
      error.response?.data?.message || "Room already locked ❌"
    );

  } finally {
    setLoading(false);
  }
};

  // 🔓 Unlock if modal closed without booking
  const handleModalClose = async () => {
    try {
      if (selectedRoom) {
        await axios.post(
          "http://localhost:5000/api/room/unlock",
          { room_id: selectedRoom.id },
          { withCredentials: true }
        ) ;
      }
    } catch (error) {
      console.log("Unlock failed");
    }

    setIsModalOpen(false);
    setSelectedRoom(null);
    fetchRooms();
  };

  return (
  <div className="rooms-container">
    <div className="hotel-header">
  <h2>{hotel ? hotel.name : "Loading..."}</h2>
  {hotel && (
    <p className="hotel-location">
      {hotel.location} • {hotel.address}
    </p>
  )}
</div>

    <div className="room-card-list">
      {rooms.map((room) => (
        <div
          key={room.id}
          className={`room-full-card ${
            room.status === "AVAILABLE"
              ? "available"
              : "notavailable"
          }`}
        >
          <div className="room-layout">

            {/* LEFT SIDE (Image + Info) */}
            <div className="room-left">
              <div className="room-image">
                <img
                  src={
                    room.image_url ||
                    "https://images.unsplash.com/photo-1611892440504-42a792e24d32"
                  }
                  alt="Room"
                />
              </div>

              <div className="room-info">
                <h3>Room {room.room_number}</h3>
                <p><b>Type:</b> {room.room_type}</p>
                <p><b>Price:</b> ₹{room.price}</p>
                <p><b>Max Guests:</b> {room.max_guests}</p>
                <p className="description">{room.description}</p>

                <span
                  className={
                    room.status === "AVAILABLE"
                      ? "status-available"
                      : "status-unavailable"
                  }
                >
                  {room.status}
                </span>
              </div>
            </div>

            {/* CENTER (Calendar) */}
            <div className="room-calendar">
              <RoomCalendar roomId={room.id} />
            </div>

            {/* RIGHT (Button) */}
            <div className="room-action">
              <button
                disabled={room.status !== "AVAILABLE"}
                onClick={() => handleRoomClick(room)}
              >
                Book Now
              </button>
            </div>

          </div>
        </div>
      ))}
    </div>

    {selectedRoom && (
      <BookingModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        room={selectedRoom}
        refreshRooms={fetchRooms}
      />
    )}
  </div>
);
}