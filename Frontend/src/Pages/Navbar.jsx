import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../Pages/Navbar.css";
import logo from "../assets/logo.png";
import {SearchContext} from "../context/SearchContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { login, logout } = useContext(AuthContext);
  const [query, setQuery] = useState("");

  

const { setSearchQuery } = useContext(SearchContext);

const handleSearch = (e) => {
  e.preventDefault();
  setSearchQuery(query);
};

  return (
    <nav className="navbar">

      {/* LEFT LOGO */}
      <div className="left-section">
        <div className="logo">
          <img
            src={logo}
            alt="BookNow"
            onClick={() => navigate("/")}
          />
        </div>
      </div>

      {/* 🔎 CENTER SEARCH BAR */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search hotels, cities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {/* RIGHT LOGIN/LOGOUT */}
      <ul className="nav-right">
        {login ? (
          <li
            className="nav-btn"
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
          >
            Logout
          </li>
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