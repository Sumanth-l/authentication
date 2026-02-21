import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../Pages/Navbar.css";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const { login, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      
      <div className="left-section">
        <div className="logo">
          <img
            src={logo}
            alt="BookNow"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      <ul className="nav-right">
        {login ? (
          <>
            <li className="nav-user">
              Welcome, {login.email}
            </li>
            <li
              className="nav-btn"
              onClick={async () => {
                await logout();
                navigate("/login");
              }}
            >
              Logout
            </li>
          </>
        ) : (
          <li
            className="nav-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </li>
        )}
      </ul>

    </nav>
  );
}