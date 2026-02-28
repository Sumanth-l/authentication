import { useState, useEffect, useContext } from "react";
import "../Pages/Hotel.css";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";

export default function Hotel() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const { searchQuery } = useContext(SearchContext);

  const [userLocation, setUserLocation] = useState(null);


useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error) => {
      console.log("Location permission denied");
    }
  );
}, []);

const handlePickNearby = async () => {
  if (!userLocation) {
    toast.error("Location not available ❌");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:5000/api/hotels/nearest?lat=${userLocation.latitude}&lng=${userLocation.longitude}`
    );

    const hotel = await res.json();

    if (!res.ok) {
      toast.error(hotel.message);
      return;
    }

    // Option 1: Redirect to rooms
    navigate(`/hotels/${hotel.id}/rooms`);

    // Option 2 (Alternative):
    // setHotels([hotel]);  // show only nearest

  } catch (error) {
    toast.error("Something went wrong ❌");
  }
};

useEffect(() => {
  const fetchHotels = async () => {

    let url = "http://localhost:5000/api/hotels";

    if (userLocation) {
      url += `?lat=${userLocation.latitude}&lng=${userLocation.longitude}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setHotels(data);
    console.log(data);
  };

  fetchHotels();

}, [userLocation]);

  // Filter using context searchQuery
  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="hotel-container">
      <h1 className="hotel-title">Welcome to BookNow</h1>
      <div className="hotel-grid">
        {filteredHotels.length === 0 ? (
          <p style={{ color: "white" }}>No hotels found</p>
        ) : (
          filteredHotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <h3>{hotel.name}</h3>
              <p><b>Location:</b> {hotel.location}</p>
              <p><b>Address:</b> {hotel.address}</p>
              <p><b>Total Rooms:</b> {hotel.total_rooms}</p>
              {hotel.distance !== undefined && hotel.distance !== null && (
  <p className="distance">
    📍 {hotel.distance < 1
      ? `${(hotel.distance * 1000).toFixed(0)} meters away`
      : `${hotel.distance.toFixed(2)} km away`}
  </p>
)}

              <button
                className="view-btn"
                onClick={() => navigate(`/hotels/${hotel.id}/rooms`)}
              >
                View Rooms
              </button>
            </div>
          ))
        )}
      </div>
      <button className="floating-nearby-btn" onClick={handlePickNearby}>
  <span>📍</span>
  Pick Nearby Hotel
</button>
    </div>
  );
}