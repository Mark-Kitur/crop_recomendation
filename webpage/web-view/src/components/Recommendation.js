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
    <div className="recommendation-page">
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