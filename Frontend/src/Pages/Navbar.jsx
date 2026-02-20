import { useNavigate } from "react-router-dom";
import "../Pages/Navbar.css";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate=useNavigate();
  return (
    <nav className="navbar">
      
      <div className="left-section">
        <div className="logo">
          <img src={logo} alt="BookNow" onClick={()=>navigate('/')}/>
        </div>
      </div>

      <ul className="nav-right">
        <li className="nav-btn" onClick={()=>navigate('/login')}>Login</li>
      </ul>

    </nav>
  );
}
