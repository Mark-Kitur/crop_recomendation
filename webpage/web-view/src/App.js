import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Recommendation from "./components/Recommendation";
import Prediction from "./components/Prediction";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

const App = () => (
  <AuthProvider>
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/recommendation" element={<PrivateRoute><Recommendation /></PrivateRoute>} />
          <Route path="/prediction" element={<PrivateRoute><Prediction /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  </AuthProvider>
);

export default App;