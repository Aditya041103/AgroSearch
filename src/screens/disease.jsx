import { useState } from "react";

export default function DiseasePrediction() {
  const [prediction, setPrediction] = useState(null);
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("image", image);

    try {
      const response = await fetch(`${import.meta.env.VITE_MODEL_URL}/api/predict-disease`, {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      setPrediction(result);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">
          🌿 Predict Plant Disease
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Upload Leaf Image
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-sm text-gray-100 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Predict Button */}
          <button
            type="submit"
            className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Predict Disease
          </button>
        </form>

        {/* Prediction Result */}
        {prediction && (
          <div className="mt-6 p-4 bg-green-100/10 border-l-4 border-green-400 text-green-200 rounded-lg">
            <h3 className="text-lg font-semibold">
              Predicted Disease:{" "}
              <span className="font-bold">{prediction.prediction}</span>
              <br />
              Confidence:{" "}
              <span className="font-bold">{(prediction.confidence * 100).toFixed(2)}%</span>
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
