// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import "../Pages/Room.css";
// import { toast } from "react-toastify";


// export default function Room() {
//   const [rooms, setRooms] = useState([]);
//   const { hotel_id } = useParams();

//   const fetchrooms = async () => {
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/hotels/${hotel_id}/rooms`,
//         {
//           method: "GET",
//           credentials: "include",
//         }
//       );

//       const data = await res.json();
//       setRooms(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchrooms();
//   }, [hotel_id]);

//   const handleRoomClick = async (room_id, status) => {
//     if (status !== "AVAILABLE") {
//       toast.error("Room not available ❌");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/room/lock",
//         { room_id },
//         { withCredentials: true }
//       );

//       const next=await fetch(`http://localhost:5000/api/hotels/${hotel_id}/rooms/${room_id}`,{
//         method:"GET",
//         credentials:"include"
//       })
//     ;
     
//       // refresh rooms after locking
//       fetchrooms();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Lock failed");

//     }
//   };

//   return (
//     <div className="rooms-container">
//       <h2 className="rooms-title">Rooms for Hotel ID: {hotel_id}</h2>

//       <div className="rooms-grid">
//         {rooms.map((room) => (
//           <div
//             key={room.id}
//             onClick={() => handleRoomClick(room.id, room.status)}
//             className={`room-card ${
//               room.status === "AVAILABLE" ? "available" : "notavailable"
//             }`}
//           >
//             <h3>Room {room.room_number}</h3>
//             <p>{room.status}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../Pages/Room.css";

export default function Room() {
  const { hotel_id } = useParams();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch all rooms of this hotel
  const fetchRooms = async () => {
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
    fetchRooms();
  }, [hotel_id]);

  // 🔹 Handle room click
  const handleRoomClick = async (room_id, status) => {
    if (loading) return;
    
    if (status !== "AVAILABLE") {
      toast.error("Room not available ❌");
      return;
    }

    try {
      setLoading(true);

      
      await axios.post(
        "http://localhost:5000/api/room/lock",
        { room_id },
        { withCredentials: true }
      );


      toast.success("Room locked successfully ✅");
      fetchRooms();

    } catch (error) {
      toast.error(error.response?.data?.message || "Lock failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rooms-container">
  <h2 className="rooms-title">Rooms for Hotel ID: {hotel_id}</h2>

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
        {/* LEFT SIDE IMAGE */}
        <div className="room-image">
          <img
            src={
              room.image_url ||
              "https://images.unsplash.com/photo-1611892440504-42a792e24d32"
            }
            alt="Room"
          />
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div className="room-info">
          <h3>Room {room.room_number}</h3>

          <p><b>Type:</b> {room.room_type}</p>
          <p><b>Price:</b> ₹{room.price}</p>
          <p><b>Max Guests:</b> {room.max_guests}</p>
          <p className="description">{room.description}</p>

          <div className="room-footer">
            <span
              className={
                room.status === "AVAILABLE"
                  ? "status-available"  
                  : "status-unavailable"
              }
            >
              {room.status}
            </span>

            <button
              disabled={room.status !== "AVAILABLE"}
              onClick={() =>
                handleRoomClick(room.id, room.status)
              }
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
  );
}