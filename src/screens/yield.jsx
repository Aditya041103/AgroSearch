import { useState } from "react";
import axios from "axios";

export default function YieldPrediction() {
  const [formData, setFormData] = useState({
    crop: "",
    cropYear: "",
    season: "",
    state: "",
    area: "",
    annualRainfall: "",
    fertilizer: "",
    pesticide: ""
  });

  const crops = ["Wheat", "Rice", "Corn", "Barley", "Oats"];
  const seasons=["Kharif","Rabi","Zaid"];
  const states = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"];
  
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null); // To store any error messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before submitting

    // Ensure all numeric fields are numbers before submitting
    const { cropYear, area, annualRainfall, fertilizer, pesticide } = formData;
    if (
      isNaN(cropYear) ||
      isNaN(area) ||
      isNaN(annualRainfall) ||
      isNaN(fertilizer) ||
      isNaN(pesticide)
    ) {
      setError("Please ensure all numeric fields are correctly filled.");
      return;
    }

    try {
      const response = await axios.post(
        "https://agrosearch-yield-model.onrender.com/api/predict",
        formData
      );
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setError("An error occurred while fetching the prediction.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          🌾 Yield Prediction
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .replace(/^\w/, (c) => c.toUpperCase())}
                </label>

                {key === "crop" ? (
                  <select
                    name="crop"
                    value={formData.crop}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="" disabled>Select a crop</option>
                    {crops.map((crop, index) => (
                      <option key={index} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                ) : key === "season" ? (
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="" disabled>Select a season</option>
                    {seasons.map((season, index) => (
                      <option key={index} value={season}>
                        {season}
                      </option>
                    ))}
                  </select>
                ): key === "state" ? (
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="" disabled>Select a state</option>
                    {states.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                ): (
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                )}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {/* Predict Button */}
          <button
            type="submit"
            className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Predict Yield
          </button>
        </form>

        {/* Prediction Result */}
        {prediction !== null && (
          <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-600 text-green-800 rounded-lg">
            <h3 className="text-lg font-semibold">
              Predicted Production:{" "}
              <span className="font-bold">{prediction}</span>
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
