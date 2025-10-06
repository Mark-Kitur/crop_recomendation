import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../css/Auth.css";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleSubmit = async e => {
      e.preventDefault();
      if (!email || !password) {
        alert("Please enter both email and password");
        return;
      }
  
      try {
        setLoading(true);
        await login(email, password);
        navigate("/");
      } catch (err) {
        alert("Invalid email or password");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
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
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import "../css/Auth.css";

// const Login = () => {
//   const { login } = useContext(AuthContext);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async e => {
//     e.preventDefault();
//     if (!email || !password) {
//       alert("Please enter both email and password");
//       return;
//     }

//     try {
//       setLoading(true);
//       await login(email, password);
//       navigate("/");
//     } catch (err) {
//       alert("Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page">
//       <h2>Login</h2>
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
//         <button type="submit" disabled={loading}>
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
