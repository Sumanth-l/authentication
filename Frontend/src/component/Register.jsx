import { useState } from "react";
import "../component/Register.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.name || !user.email || !user.password) {
      toast.error("⚠️ Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("🎉 Registration successful!");
        setUser({ name: "", email: "", password: "" });

        setTimeout(() => {
          navigate("/login");
        }, 1500);

      } else {
        toast.error(data.message || "Registration failed ❌");
      }

    } catch (error) {
      console.log(error);
      toast.error("Server error. Please try again ❌");
    }
  };

  return (
    <div className="register-page">

      {/* LEFT SIDE */}
      <div className="register-left">
        <h3 className="brand">BookNow</h3>

        <h1>Create your account</h1>
        <p>
          Join BookNow to book hotels, events, and services easily.
          Create an account and start booking instantly.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="register-right">
        <div className="register-card">

          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />

            <button type="submit" className="register-btn">
              Sign Up
            </button>
          </form>

        </div>
      </div>

    </div>
  );
};

export default Register;