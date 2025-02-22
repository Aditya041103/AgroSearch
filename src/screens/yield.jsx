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

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://agrosearch-yield-model.onrender.com/api/predict",
        formData
      );
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error fetching prediction:", error);
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
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            ))}
          </div>

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
