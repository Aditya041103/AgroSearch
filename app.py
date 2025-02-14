from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
model = joblib.load("yield_model.pkl")  # Ensure this file exists

@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        print("Received data:", data)  # Debugging log

        if not data:
            return jsonify({"error": "No input data received"}), 400

        # Rename keys to match the model's expected column names
        data_renamed = {
            "Crop": data["crop"],
            "Crop_Year": int(data["cropYear"]),
            "Season": data["season"],
            "State": data["state"],
            "Area": float(data["area"]),
            "Annual_Rainfall": float(data["annualRainfall"]),
            "Fertilizer": float(data["fertilizer"]),
            "Pesticide": float(data["pesticide"]),
        }

        df = pd.DataFrame([data_renamed])
        prediction = model.predict(df)[0]
        print("Prediction:", prediction)  # Debugging log
        
        return jsonify({"prediction": float(prediction)})

    except Exception as e:
        print("Server error:", str(e))  # Debugging log
        return jsonify({"error": "Server error: " + str(e)}), 500



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)  # Change port if needed
