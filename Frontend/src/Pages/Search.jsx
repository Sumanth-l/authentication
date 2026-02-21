import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Search() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      const res = await fetch("http://localhost:5000/api/hotels");
      const data = await res.json();

      const filtered = data.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(query.toLowerCase()) ||
          hotel.location.toLowerCase().includes(query.toLowerCase())
      );

      setHotels(filtered);
    };

    if (query) fetchHotels();
  }, [query]);

  return (
    <div style={{ padding: "40px", background: "#0b0b0b", color: "white" }}>
      <h2>Search Results for "{query}"</h2>

      {hotels.map((hotel) => (
        <div key={hotel.id} style={{ marginBottom: "15px" }}>
          <h3>{hotel.name}</h3>
          <p>{hotel.location}</p>
        </div>
      ))}
    </div>
  );
}