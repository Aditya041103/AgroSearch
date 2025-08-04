import React, { useState } from "react";

export default function InfoPage() {
  const [cropName, setCropName] = useState("");
  const [data, setData] = useState({});
  const crops = ["Wheat", "Rice", "Corn", "Barley", "Oats"];

  const handleSubmit = async () => {
    if (!cropName.trim()) return alert("Please select a crop");

    try {
      const response = await fetch(`http://localhost:5000/api/details?crop=${encodeURIComponent(cropName)}`)
        .then(res => res.json())
        .catch(err => console.log("Error fetching data:", err));
      setData(response);
    } catch (error) {
      console.log("Error fetching data:", error);
      setData({});
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-green-700 p-6">
          <h1 className="text-4xl font-bold text-white text-center">🌾 Crop Info</h1>
        </div>

        {/* Input Section */}
        <div className="p-8 bg-gray-900">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              name="crop"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select a crop</option>
              {crops.map((crop, index) => (
                <option key={index} value={crop}>{crop}</option>
              ))}
            </select>

            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Find
            </button>
          </div>
        </div>

        {/* Data Display */}
        {data?.details ? (
          <div className="p-8 bg-gray-900">
            {/* Crop Details */}
            <div className="bg-gray-700 p-6 rounded-lg mb-6 shadow">
              <h2 className="text-2xl font-bold text-green-400 mb-4">Crop Details</h2>
              <p><strong className="text-green-300">Scientific Name:</strong> {data.details.scientific_name || "Unknown"}</p>
              <p><strong className="text-green-300">Category:</strong> {data.details.category || "Unknown"}</p>
              <p><strong className="text-green-300">Local Names:</strong> {data.details.local_names?.join(", ") || "Unknown"}</p>
            </div>

            {/* Growing Conditions */}
            <div className="bg-gray-700 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-green-400 mb-4">Growing Conditions</h2>
              {data.growingCondition ? (
                <>
                  <p><strong className="text-green-300">Soil:</strong> {data.growingCondition.soil || "Unknown"}</p>
                  <p><strong className="text-green-300">Temperature:</strong> {data.growingCondition.temperature || "Unknown"}</p>
                  <p><strong className="text-green-300">Rainfall:</strong> {data.growingCondition.rainfall || "Unknown"}</p>
                  <p><strong className="text-green-300">Season:</strong> {data.growingCondition.season || "Unknown"}</p>
                </>
              ) : (
                <p>No condition data available.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-400 bg-gray-900">Select a crop to view details.</div>
        )}
      </div>
    </div>
  );
}
