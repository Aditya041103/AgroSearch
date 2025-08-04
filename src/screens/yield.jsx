import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function YieldPrediction() {
  const crops = ["Wheat", "Rice", "Corn", "Barley", "Oats"];
  const seasons = ["Kharif", "Rabi", "Zaid"];
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi",
    "Puducherry", "Ladakh", "Jammu and Kashmir",
  ];

  const [selectedOption, setSelectedOption] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [formData, setFormData] = useState({
    crop: "", cropYear: "", season: "", state: "",
    area: "", annualRainfall: "", fertilizer: "", pesticide: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/predict-yield", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center py-12 px-4">
      <div className="max-w-3xl w-full bg-gray-800 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">
          🌾 AgroSearch AI
        </h2>

        {/* Option Buttons */}
        {!selectedOption && (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setSelectedOption("yield")}
              className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
            >
              Predict Agriculture Yield
            </button>
            <button
              onClick={() => navigate("/disease")}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              Predict Crop Disease
            </button>
          </div>
        )}

        {/* Yield Prediction Form */}
        {selectedOption === "yield" && (
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.keys(formData).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {key.replace(/([A-Z])/g, " $1")
                      .trim()
                      .replace(/^\w/, (c) => c.toUpperCase())}
                  </label>
                  {["crop", "season", "state"].includes(key) ? (
                    <select
                      name={key}
                      required
                      value={formData[key]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="" disabled>
                        Select {key}
                      </option>
                      {(key === "crop" ? crops : key === "season" ? seasons : states).map(
                        (option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        )
                      )}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Predict Yield
            </button>
          </form>
        )}

        {/* Yield Result */}
        {prediction !== null && selectedOption === "yield" && (
          <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-600 text-green-800 rounded-lg">
            <h3 className="text-lg font-semibold">
              Predicted Production: <span className="font-bold">{prediction}</span>
            </h3>
          </div>
        )}

        {/* Placeholder for Disease Prediction */}
        {selectedOption === "disease" && (
          <div className="mt-6 text-center">
            <p className="text-gray-300 mb-4">Disease prediction module coming soon.</p>
            <button
              onClick={() => navigate("/disease")}
              className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
