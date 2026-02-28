import { useState, useEffect, useContext } from "react";
import "../Pages/Hotel.css";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function Hotel() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const { searchQuery } = useContext(SearchContext);
  const [userLocation, setUserLocation] = useState(null);
  const[loading,setLoading]=useState(true);

  // 📍 Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        console.log("Location permission denied");
      }
    );
  }, []);

  // 📍 Pick nearest hotel
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

      navigate(`/hotels/${hotel.id}/rooms`);
    } catch (error) {
      toast.error("Something went wrong ❌");
    }
  };

  // 🔄 Fetch hotels
  useEffect(() => {
  const fetchHotels = async () => {
    try {
      setLoading(true);

      let url = "http://localhost:5000/api/hotels";

      if (userLocation) {
        url += `?lat=${userLocation.latitude}&lng=${userLocation.longitude}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      setHotels(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  fetchHotels();
}, [userLocation]);

  return (
    <div className="hotel-container">
      <h1 className="hotel-title">Welcome to BookNow</h1>

      {/* 🔥 Stagger Animation Grid */}
    <motion.div
  className="hotel-grid"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.4 }}
>
        {loading ? (
  <div className="loading-state">
    <div className="loader"></div>
    <p>Loading hotels...</p>
  </div>
) : hotels.length === 0 ? (
  <p style={{ color: "white" }}>No hotels found</p>
) : (
          hotels.map((hotel) => (
           <motion.div
  key={hotel.id}
  className="hotel-card"
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
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
            </motion.div>
          ))
        )}
      </motion.div>

      {/* 🔥 Floating Zepto-style CTA */}
      <button
        className="floating-nearby-btn"
        onClick={handlePickNearby}
      >
        📍 Pick Nearby Hotel
      </button>
    </div>
  );
}