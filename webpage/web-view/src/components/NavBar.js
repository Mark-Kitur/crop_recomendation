import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <h2 className="site-name">🌾 CropIQ</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/recommendation">Recommendation</Link>
        <Link to="/prediction">Prediction</Link>
        {user ? (
          <button className="login-signout-btn" onClick={logout}>Logout</button>
        ) : (
          <>
            <button className="login-signout-btn" onClick={() => navigate("/login")}>Login</button>
            <button className="login-signout-btn" onClick={() => navigate("/signup")}>Signup</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;