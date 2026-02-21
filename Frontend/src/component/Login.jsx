import React, { useState,useContext } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";


const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const {setLogin } = useContext(AuthContext);

  



  const navigate=useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/user/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "include",   
  body: JSON.stringify(user)
});

      const data = await res.json();

      if (res.ok) {
        setLogin(data.user);
        toast.success(data.message);
         navigate('/')
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-left">
        <h3 className="brand">BookNow</h3>

        <h1>Sign in to BookNow</h1>
        <p>
          Book your hotels, events, and services easily with BookNow.
          Fast, simple, and secure booking platform.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-card">

          <button className="social-btn">Sign in with Google</button>
          <button className="social-btn">Sign in with Twitter</button>

          <hr />

          <form onSubmit={handleSubmit}>
            <label>Email address</label>
            <input
              type="email"
              placeholder="Email address"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />

            <a href="#" className="forgot">
              Forgot password?
            </a>

            <div className="remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </div>

            <button type="submit" className="signin-btn">
              Sign in
            </button>
          </form>
        </div>

        <p className="signup">
          Not a member? <Link to="/register">Sign up now</Link>
        </p>
      </div>

    </div>
  );
};

export default Login;
