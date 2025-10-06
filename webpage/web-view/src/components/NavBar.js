import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <h2>🌾 SmartCrop</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/recommendation">Recommendation</Link>
        <Link to="/prediction">Prediction</Link>
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;