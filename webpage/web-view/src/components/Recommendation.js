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

// import React, { useEffect, useState } from "react";
// import api from "../api/api";
// import "../css/Recommendation.css";

// const Recommendation = () => {
//   const [crops, setCrops] = useState([]);
//   const [selectedCrop, setSelectedCrop] = useState("");
//   const [recommendations, setRecommendations] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch all available crops
//   useEffect(() => {
//     const fetchCrops = async () => {
//       try {
//         const res = await api.get("/recommendations");
//         setCrops(res.data);
//       } catch (error) {
//         console.error("Failed to fetch crops:", error);
//       }
//     };
//     fetchCrops();
//   }, []);

//   // Fetch recommendations for selected crop
//   const handleSelect = async (e) => {
//     const crop = e.target.value;
//     setSelectedCrop(crop);
//     if (!crop) return;

//     setLoading(true);
//     try {
//       const res = await api.get(`/recommendations/${crop}`);
//       setRecommendations(res.data);
//     } catch (error) {
//       console.error("Error fetching recommendations:", error);
//       setRecommendations(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page">
//       <h2>Crop Recommendations</h2>

//       <div className="dropdown-section">
//         <label>Select a Crop:</label>
//         <select value={selectedCrop} onChange={handleSelect}>
//           <option value="">-- Choose a Crop --</option>
//           {crops.map((crop) => (
//             <option key={crop} value={crop}>
//               {crop}
//             </option>
//           ))}
//         </select>
//       </div>

//       {loading && <p className="loading">Loading recommendations...</p>}

//       {recommendations && (
//         <div className="recommendations">
//           <h3>Recommendations for {selectedCrop}</h3>
//           <ul>
//             {Object.entries(recommendations).map(([key, advice]) => (
//               <li key={key}>
//                 <strong>{key}:</strong> {advice}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Recommendation;

import React, { useState } from "react";
import api from "../api/api";
import "../css/Recommendation.css";

const Recommendation = () => {
  const crops = [
    "Apple",
    "Banana",
    "Blackgram",
    "ChickPea",
    "Coconut",
    "Coffee",
    "Cotton",
    "Grapes",
    "Jute",
    "KidneyBeans",
    "Lentil",
    "Maize",
    "Mango",
    "MothBeans",
    "MungBean",
    "Muskmelon",
    "Orange",
    "Papaya",
    "PigeonPeas",
    "Pomegranate",
    "Rice",
    "Watermelon",
  ];

  const [selectedCrop, setSelectedCrop] = useState("");
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (e) => {
    const crop = e.target.value;
    setSelectedCrop(crop);
    if (!crop) return;

    setLoading(true);
    try {
      // Fetch recommendation data for the selected crop
      const res = await api.get(`/recommendations/${crop}`);
      setRecommendations(res.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendations(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>🌿 Crop Recommendations</h2>

      <div className="dropdown-section">
        <label>Select a Crop:</label>
        <select value={selectedCrop} onChange={handleSelect}>
          <option value="">-- Choose a Crop --</option>
          {crops.map((crop) => (
            <option key={crop} value={crop}>
              {crop}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="loading">Loading recommendations...</p>}

      {recommendations && (
        <div className="recommendations">
            <h3>Recommendations for {recommendations.crop}</h3>

            {/* <div className="data-section">
            <h4>🌡 Latest Sensor Data</h4>
            <ul>
                {Object.entries(recommendations.latest_data || {}).map(([key, value]) => (
                <li key={key}>
                    <strong>{key}:</strong> {value}
                </li>
                ))}
            </ul>
            </div> */}

            <div className="advice-section">
            <h4>💡 Recommended Actions</h4>
            <ul>
                {Object.entries(recommendations.recommendations || {}).map(([key, advice]) => (
                <li key={key}>
                    <strong>{key}:</strong> {advice}
                </li>
                ))}
            </ul>
            </div>
        </div>
        )}
    </div>
  );
};

export default Recommendation;