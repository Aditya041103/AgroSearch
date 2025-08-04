from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import google.generativeai as genai
from pydantic import BaseModel
import numpy as np
import pandas as pd
import os
import joblib
from dotenv import load_dotenv
from openai import OpenAI
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

# Init FastAPI
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
yield_model = joblib.load("yield_model_compressed.pkl")
disease_model = load_model("plant_disease_model.h5")

# Constants
IMAGE_SIZE = 256
UPLOAD_PATH = "temp.jpg"
CLASS_NAMES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Blueberry___healthy", "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight", "Corn_(maize)___healthy", "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)", "Peach___Bacterial_spot", "Peach___healthy",
    "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy", "Potato___Early_blight", "Potato___Late_blight",
    "Potato___healthy", "Raspberry___healthy", "Soybean___healthy", "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch", "Strawberry___healthy", "Tomato___Bacterial_spot", "Tomato___Early_blight",
    "Tomato___Late_blight", "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite", "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus", "Tomato___healthy"
]

# Load environment
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Load static context
with open("site_info.txt", "r", encoding="utf-8") as f:
    site_info = f.read()


# Request model
class YieldInput(BaseModel):
    crop: str
    cropYear: int
    season: str
    state: str
    area: float
    annualRainfall: float
    fertilizer: float
    pesticide: float


@app.post("/api/predict-yield")
async def predict_yield(data: YieldInput):
    try:
        df = pd.DataFrame([{
            "Crop": data.crop,
            "Crop_Year": int(data.cropYear),
            "Season": data.season,
            "State": data.state,
            "Area": float(data.area),
            "Annual_Rainfall": float(data.annualRainfall),
            "Fertilizer": float(data.fertilizer),
            "Pesticide": float(data.pesticide),
        }])
        prediction = yield_model.predict(df)[0]
        return {"prediction": float(prediction)}
    except Exception as e:
        return JSONResponse(content={"error": f"Server error: {str(e)}"}, status_code=500)


def preprocess_image(path):
    img = load_img(path, target_size=(IMAGE_SIZE, IMAGE_SIZE))
    img = img_to_array(img)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img


@app.post("/api/predict-disease")
async def predict_disease(image: UploadFile = File(...)):
    try:
        print(1)
        with open(UPLOAD_PATH, "wb") as buffer:
            buffer.write(await image.read())

        input_img = preprocess_image(UPLOAD_PATH)
        predictions = disease_model.predict(input_img)[0]
        class_idx = np.argmax(predictions)
        class_name = CLASS_NAMES[class_idx]
        confidence = float(np.max(predictions))

        return {
            "prediction": class_name,
            "confidence": round(confidence, 4)
        }
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    finally:
        if os.path.exists(UPLOAD_PATH):
            os.remove(UPLOAD_PATH)


class ChatInput(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(data: ChatInput):
    try:
        model = genai.GenerativeModel("gemini-2.5-pro")
        chat_session = model.start_chat(history=[])

        prompt = f"""You are AgroBot, an assistant for AgroSearch. Use the following site information to answer questions:
        
{site_info}

User: {data.message}"""

        response = chat_session.send_message(prompt)
        return {"response": response.text}

    except Exception as e:
        print(e)
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)