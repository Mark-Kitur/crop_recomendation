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
        const updated = { ...latestData, ...res.data };
        setDataPoints([...dataPoints.slice(0, -1), updated]);
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
    <div className="prediction-page">
        <h2>🌾 Crop Prediction Dashboard</h2>
        <div className="prediction-container">
            {latest && (
                <div className="prediction-summary prediction-card">
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
                <ResponsiveContainer width="70%" height={300}>
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
                <ResponsiveContainer width="70%" height={250}>
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
    </div>
  );
};

export default Prediction;