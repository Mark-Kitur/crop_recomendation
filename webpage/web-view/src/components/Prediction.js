// import React, { useState } from "react";
// import api from "../api/api";
// import "../css/Prediction.css";

// const Prediction = () => {
//   const [formData, setFormData] = useState({
//     nitrogen: "",
//     phosphorus: "",
//     potassium: "",
//     temperature: "",
//     humidity: "",
//     ph_value: "",
//     rainfall: "",
//   });
//   const [result, setResult] = useState(null);

//   const handleChange = e => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     const res = await api.post("/data_points", { data_point: formData });
//     setResult(res.data);
//   };

//   return (
//     <div className="page">
//       <h2>Crop Prediction</h2>
//       <form onSubmit={handleSubmit}>
//         {Object.keys(formData).map(field => (
//           <input
//             key={field}
//             name={field}
//             value={formData[field]}
//             onChange={handleChange}
//             placeholder={field.replace("_", " ").toUpperCase()}
//             required
//           />
//         ))}
//         <button type="submit">Predict</button>
//       </form>

//       {result && (
//         <div className="result">
//           <h3>Predicted Crop: {result.predicted_crop}</h3>
//           <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Prediction;
// import React, { useEffect, useState } from "react";
// import api from "../api/api";
// import "../css/Prediction.css";

// const Prediction = () => {
//   const [dataPoints, setDataPoints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);

//   // Fetch all data points for a given farm
//   useEffect(() => {
//     const fetchDataPoints = async () => {
//       try {
//         // Replace `1` with the actual farm ID or a dynamic one
//         const res = await api.get("/farms/1/data_points", {
//           headers: { "Accept": "application/json" },
//         });
//         setDataPoints(res.data);
//       } catch (err) {
//         setError("Failed to fetch data points.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDataPoints();
//   }, []);

//   const handlePredict = async () => {
//     try {
//       setError(null);
//       setResult(null);

//       // You can modify this depending on what your backend expects
//       const res = await api.post("/predict", { data_points: dataPoints });

//       setResult(res.data);
//     } catch (err) {
//       console.error(err);
//       setError("Prediction failed. Please try again.");
//     }
//   };

//   return (
//     <div className="page">
//       <h2>Crop Prediction</h2>

//       {loading ? (
//         <p>Loading data points...</p>
//       ) : error ? (
//         <p className="error">{error}</p>
//       ) : (
//         <>
//           <div className="data-points">
//             <h3>Collected Data Points</h3>
//             {dataPoints.length > 0 ? (
//               <table>
//                 <thead>
//                   <tr>
//                     <th>N</th>
//                     <th>P</th>
//                     <th>K</th>
//                     <th>Temp</th>
//                     <th>Humidity</th>
//                     <th>pH</th>
//                     <th>Rainfall</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {dataPoints.map((dp, i) => (
//                     <tr key={i}>
//                       <td>{dp.nitrogen}</td>
//                       <td>{dp.phosphorus}</td>
//                       <td>{dp.potassium}</td>
//                       <td>{dp.temperature}</td>
//                       <td>{dp.humidity}</td>
//                       <td>{dp.ph_value}</td>
//                       <td>{dp.rainfall}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p>No data points found.</p>
//             )}
//           </div>

//           {dataPoints.length > 0 && (
//             <button onClick={handlePredict}>Predict Crop</button>
//           )}

//           {result && (
//             <div className="result">
//               <h3>Predicted Crop: {result.predicted_crop}</h3>
//               <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Prediction;

// import React, { useEffect, useState, useContext } from "react";
// import api from "../api/api";
// import { AuthContext } from "../context/AuthContext";
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, BarChart, Bar
// } from "recharts";
// import "../css/Prediction.css";

// const Recommendation = () => {
//   const { user } = useContext(AuthContext);
//   const [dataPoints, setDataPoints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // assuming backend exposes GET /farms/:id/data_points
//         const res = await api.get(`/farms/1/data_points`);
//         setDataPoints(res.data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load data points.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [user]);

//   if (loading) return <div className="page">Loading...</div>;
//   if (error) return <div className="page">{error}</div>;

//   // Use the last data point for the “top recommendation”
//   const latest = dataPoints[dataPoints.length - 1];

//   return (
//     <div className="page">
//       <h2>🌱 Crop Recommendation Dashboard</h2>

//       {latest && (
//         <div className="recommendation-summary">
//           <h3>Top Recommended Crop:</h3>
//           <p>
//             <strong>{latest.predicted_crop?.toUpperCase() || "Unknown"}</strong>
//           </p>
//           <p>Confidence: {(latest.confidence * 100).toFixed(2)}%</p>
//         </div>
//       )}

//       <h3>Recent Sensor Data</h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={dataPoints}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="id" label={{ value: "Data Point", position: "insideBottomRight", offset: 0 }} />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature (°C)" />
//           <Line type="monotone" dataKey="humidity" stroke="#0073ff" name="Humidity (%)" />
//           <Line type="monotone" dataKey="rainfall" stroke="#28a745" name="Rainfall (mm)" />
//         </LineChart>
//       </ResponsiveContainer>

//       <h3>Soil Nutrient Composition</h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={dataPoints.slice(-5)}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="id" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="nitrogen" fill="#ffc107" name="Nitrogen (N)" />
//           <Bar dataKey="phosphorus" fill="#17a2b8" name="Phosphorus (P)" />
//           <Bar dataKey="potassium" fill="#28a745" name="Potassium (K)" />
//         </BarChart>
//       </ResponsiveContainer>

//       <h3>All Predictions</h3>
//       <table className="data-table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Crop</th>
//             <th>Confidence</th>
//             <th>Temp (°C)</th>
//             <th>Humidity</th>
//             <th>Rainfall</th>
//           </tr>
//         </thead>
//         <tbody>
//           {dataPoints.map(dp => (
//             <tr key={dp.id}>
//               <td>{dp.id}</td>
//               <td>{dp.predicted_crop || "N/A"}</td>
//               <td>{dp.confidence ? (dp.confidence * 100).toFixed(1) + "%" : "N/A"}</td>
//               <td>{dp.temperature}</td>
//               <td>{dp.humidity}</td>
//               <td>{dp.rainfall}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Recommendation;

// import React, { useEffect, useState, useContext } from "react";
// import api from "../api/api";
// import { AuthContext } from "../context/AuthContext";
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, Legend,
//   ResponsiveContainer, CartesianGrid, BarChart, Bar
// } from "recharts";
// import "../css/Prediction.css";

// const Prediction = () => {
//   const { user } = useContext(AuthContext);
//   const [dataPoints, setDataPoints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [predicting, setPredicting] = useState(false);
//   const [result, setResult] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch all existing data points for the farm
//         const res = await api.get(`/my_data_point`, {
//           headers: { Accept: "application/json" },
//         });
//         setDataPoints(res.data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load data points.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [user]);

//   const handlePredict = async () => {
//     try {
//       setPredicting(true);
//       setError(null);

//       // Trigger new prediction using all available data points
//       const res = await api.post("/predict", { data_points: dataPoints });
//       setResult(res.data);

//       // Optional: Refresh data after prediction
//       const refresh = await api.get(`/farms/1/data_points`);
//       setDataPoints(refresh.data);
//     } catch (err) {
//       console.error(err);
//       setError("Prediction failed. Please try again.");
//     } finally {
//       setPredicting(false);
//     }
//   };

//   if (loading) return <div className="page">Loading...</div>;
//   if (error) return <div className="page">{error}</div>;

//   const latest = dataPoints[dataPoints.length - 1];

//   return (
//     <div className="page">
//       <h2>🌾 Crop Prediction Dashboard</h2>

//       {latest && (
//         <div className="prediction-summary">
//           <h3>Most Recent Prediction</h3>
//           <p><strong>Predicted Crop:</strong> {latest.predicted_crop || "Unknown"}</p>
//           <p><strong>Confidence:</strong> {latest.confidence ? (latest.confidence * 100).toFixed(2) + "%" : "N/A"}</p>
//         </div>
//       )}

//       <div className="actions">
//         <button onClick={handlePredict} disabled={predicting}>
//           {predicting ? "Predicting..." : "Run New Prediction"}
//         </button>
//       </div>

//       <h3>Recent Sensor Data</h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={dataPoints}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="id" label={{ value: "Data Point", position: "insideBottomRight", offset: 0 }} />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature (°C)" />
//           <Line type="monotone" dataKey="humidity" stroke="#0073ff" name="Humidity (%)" />
//           <Line type="monotone" dataKey="rainfall" stroke="#28a745" name="Rainfall (mm)" />
//         </LineChart>
//       </ResponsiveContainer>

//       <h3>Soil Nutrient Composition</h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={dataPoints.slice(-5)}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="id" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="nitrogen" fill="#ffc107" name="Nitrogen (N)" />
//           <Bar dataKey="phosphorus" fill="#17a2b8" name="Phosphorus (P)" />
//           <Bar dataKey="potassium" fill="#28a745" name="Potassium (K)" />
//         </BarChart>
//       </ResponsiveContainer>

//       <h3>All Predictions</h3>
//       <table className="data-table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Crop</th>
//             <th>Confidence</th>
//             <th>Temp (°C)</th>
//             <th>Humidity</th>
//             <th>Rainfall</th>
//           </tr>
//         </thead>
//         <tbody>
//           {dataPoints.map((dp) => (
//             <tr key={dp.id}>
//               <td>{dp.id}</td>
//               <td>{dp.predicted_crop || "N/A"}</td>
//               <td>{dp.confidence ? (dp.confidence * 100).toFixed(1) + "%" : "N/A"}</td>
//               <td>{dp.temperature}</td>
//               <td>{dp.humidity}</td>
//               <td>{dp.rainfall}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {result && (
//         <div className="result">
//           <h3>🧠 New Prediction Result</h3>
//           <p><strong>Predicted Crop:</strong> {result.predicted_crop}</p>
//           <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Prediction;

// import React, { useEffect, useState, useContext } from "react";
// import api from "../api/api";
// import { AuthContext } from "../context/AuthContext";
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, Legend,
//   ResponsiveContainer, CartesianGrid, BarChart, Bar
// } from "recharts";
// import "../css/Prediction.css";

// const Prediction = () => {
//   const { user } = useContext(AuthContext);
//   const [dataPoints, setDataPoints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [predicting, setPredicting] = useState(false);
//   const [result, setResult] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await api.get("/my_data_point", {
//           headers: { Accept: "application/json" },
//         });

//         // Ensure dataPoints is always an array
//         const data = Array.isArray(res.data) ? res.data : [res.data];
//         setDataPoints(data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load data points.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [user]);

//   const handlePredict = async () => {
//     try {
//       setPredicting(true);
//       setError(null);

//       // Send the latest available data for prediction
//       const latestData = dataPoints[dataPoints.length - 1];
//       const res = await api.post("/predict", { data_points: [latestData] });
//       setResult(res.data);

//       // Refresh data
//       const refresh = await api.get("/my_data_point");
//       const refreshedData = Array.isArray(refresh.data) ? refresh.data : [refresh.data];
//       setDataPoints(refreshedData);
//     } catch (err) {
//       console.error(err);
//       setError("Prediction failed. Please try again.");
//     } finally {
//       setPredicting(false);
//     }
//   };

//   if (loading) return <div className="page">Loading...</div>;
//   if (error) return <div className="page error">{error}</div>;

//   const latest = dataPoints[dataPoints.length - 1];
//   const multipleData = dataPoints.length > 1;

//   return (
//     <div className="page">
//       <h2>🌾 Crop Prediction Dashboard</h2>

//       {latest && (
//         <div className="prediction-summary">
//           <h3>Current Farm Data</h3>
//           <p><strong>Temperature:</strong> {latest.temperature}°C</p>
//           <p><strong>Humidity:</strong> {latest.humidity}%</p>
//           <p><strong>Rainfall:</strong> {latest.rainfall} mm</p>
//           <p><strong>pH:</strong> {latest.ph_value}</p>
//           <p><strong>Predicted Crop:</strong> {latest.predicted_crop || "Unknown"}</p>
//           <p><strong>Confidence:</strong> {latest.confidence ? (latest.confidence * 100).toFixed(2) + "%" : "N/A"}</p>
//         </div>
//       )}

//       <div className="actions">
//         <button onClick={handlePredict} disabled={predicting}>
//           {predicting ? "Predicting..." : "Run New Prediction"}
//         </button>
//       </div>

//       {multipleData && (
//         <>
//           <h3>Recent Sensor Data (Trends)</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={dataPoints}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="id" label={{ value: "Data Point", position: "insideBottomRight", offset: 0 }} />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature (°C)" />
//               <Line type="monotone" dataKey="humidity" stroke="#0073ff" name="Humidity (%)" />
//               <Line type="monotone" dataKey="rainfall" stroke="#28a745" name="Rainfall (mm)" />
//             </LineChart>
//           </ResponsiveContainer>
//         </>
//       )}

//       {latest && (
//         <>
//           <h3>Soil Nutrient Composition</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={[latest]}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="id" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="nitrogen" fill="#ffc107" name="Nitrogen (N)" />
//               <Bar dataKey="phosphorus" fill="#17a2b8" name="Phosphorus (P)" />
//               <Bar dataKey="potassium" fill="#28a745" name="Potassium (K)" />
//             </BarChart>
//           </ResponsiveContainer>
//         </>
//       )}

//       {multipleData && (
//         <>
//           <h3>All Predictions</h3>
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Crop</th>
//                 <th>Confidence</th>
//                 <th>Temp (°C)</th>
//                 <th>Humidity</th>
//                 <th>Rainfall</th>
//               </tr>
//             </thead>
//             <tbody>
//               {dataPoints.map((dp) => (
//                 <tr key={dp.id}>
//                   <td>{dp.id}</td>
//                   <td>{dp.predicted_crop || "N/A"}</td>
//                   <td>{dp.confidence ? (dp.confidence * 100).toFixed(1) + "%" : "N/A"}</td>
//                   <td>{dp.temperature}</td>
//                   <td>{dp.humidity}</td>
//                   <td>{dp.rainfall}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}

//       {result && (
//         <div className="result">
//           <h3>🧠 New Prediction Result</h3>
//           <p><strong>Predicted Crop:</strong> {result.predicted_crop}</p>
//           <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Prediction;

import React, { useEffect, useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid, BarChart, Bar
} from "recharts";
import "../css/Prediction.css";

const Prediction = () => {
  const { user } = useContext(AuthContext);
  const [dataPoints, setDataPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/my_data_point", {
          headers: { Accept: "application/json" },
        });
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setDataPoints(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load data points.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handlePredict = async () => {
    try {
      setPredicting(true);
      setError(null);

      const latestData = dataPoints[dataPoints.length - 1];
      const res = await api.post("/predict", { data_points: [latestData] });

      // Replace old prediction result with the new one
      const refreshed = Array.isArray(res.data) ? res.data : [res.data];
      setDataPoints(refreshed);
    } catch (err) {
      console.error(err);
      setError("Prediction failed. Please try again.");
    } finally {
      setPredicting(false);
    }
  };

  if (loading) return <div className="page">Loading...</div>;
  if (error) return <div className="page error">{error}</div>;

  const latest = dataPoints[dataPoints.length - 1];
  const multipleData = dataPoints.length > 1;

  return (
    <div className="page prediction-page">
      <h2>🌾 Crop Prediction Dashboard</h2>

      {latest && (
        <div className="prediction-summary card">
          <h3>Current Farm Data</h3>
          <div className="prediction-grid">
            <p><strong>Temperature:</strong> {latest.temperature}°C</p>
            <p><strong>Humidity:</strong> {latest.humidity}%</p>
            <p><strong>Rainfall:</strong> {latest.rainfall} mm</p>
            <p><strong>pH:</strong> {latest.ph_value}</p>
            <p><strong>Predicted Crop:</strong> {latest.predicted_crop || "Unknown"}</p>
            <p><strong>Confidence:</strong> {latest.confidence ? (latest.confidence * 100).toFixed(2) + "%" : "N/A"}</p>
          </div>
        </div>
      )}

      <div className="actions">
        <button onClick={handlePredict} disabled={predicting} className="predict-btn">
          {predicting ? "Predicting..." : "Run New Prediction"}
        </button>
      </div>

      {multipleData && (
        <>
          <h3>Recent Sensor Data (Trends)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataPoints}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature (°C)" />
              <Line type="monotone" dataKey="humidity" stroke="#0073ff" name="Humidity (%)" />
              <Line type="monotone" dataKey="rainfall" stroke="#28a745" name="Rainfall (mm)" />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}

      {latest && (
        <>
          <h3>Soil Nutrient Composition</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[latest]} barSize={40} barGap={15}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="nitrogen" fill="#ffc107" name="Nitrogen (N)" />
              <Bar dataKey="phosphorus" fill="#17a2b8" name="Phosphorus (P)" />
              <Bar dataKey="potassium" fill="#28a745" name="Potassium (K)" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default Prediction;