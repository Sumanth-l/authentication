import { useState,useEffect} from "react";
import '../Pages/Hotel.css'
import { useNavigate } from "react-router-dom";


export default function Hotel(){

    const navigate=useNavigate();

    const[hotels,setHotels]=useState([]);

    useEffect(()=>{
     const fetchHotels=async()=>{
    const res=await fetch("http://localhost:5000/api/hotels")
    const data=await res.json();
    setHotels(data);
     }      
    fetchHotels();
    },[])

return (
    <div className="hotel-container"> 
        <h1 className="hotel-title">Welcome to BookNow Hotel</h1>
         <div className="hotel-grid">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="hotel-card">
            <h3>{hotel.name}</h3>
            <p><b>Location:</b> {hotel.location}</p>
            <p><b>Address:</b> {hotel.address}</p>
            <p><b>Total Rooms:</b> {hotel.total_rooms}</p>

            <button className="view-btn" onClick={() => navigate(`/hotels/${hotel.id}/rooms`)}>View Rooms</button>
          </div>
        ))}
      </div>
    </div>
)

}