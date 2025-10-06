import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../css/Auth.css";

const Signup = () => {
    const { signup } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [deviceUid, setDeviceUid] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleSubmit = async e => {
      e.preventDefault();
      if (!email || !password || !deviceUid) {
        alert("Please fill in all fields");
        return;
      }
  
      try {
        setLoading(true);
        await signup(email, password, deviceUid);
        navigate("/");
      } catch (err) {
        alert("Signup failed");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
          type="text"
          placeholder="Device UID (e.g., esp8266-1234abcd)"
          value={deviceUid}
          onChange={e => setDeviceUid(e.target.value)}
          disabled={loading}
        />
          <button type="submit">Signup</button>
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import "../css/Auth.css";

// const Signup = () => {
//   const { signup } = useContext(AuthContext);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [deviceUid, setDeviceUid] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async e => {
//     e.preventDefault();
//     if (!email || !password || !deviceUid) {
//       alert("Please fill in all fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       await signup(email, password, deviceUid);
//       navigate("/");
//     } catch (err) {
//       alert("Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page">
//       <h2>Create Account</h2>
//       <form onSubmit={handleSubmit} className="auth-form">
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           disabled={loading}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           disabled={loading}
//         />
//         <input
//           type="text"
//           placeholder="Device UID (e.g., esp8266-1234abcd)"
//           value={deviceUid}
//           onChange={e => setDeviceUid(e.target.value)}
//           disabled={loading}
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? "Signing up..." : "Signup"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Signup;