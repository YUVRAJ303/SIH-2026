from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(title="SIH 2026 AI Service")

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ModelRequest(BaseModel):
    location_id: str
    current_aqi: float
    temperature: float
    wind_speed: float

# ----------------------------------------------------
# AI & ML BACKEND ROUTES (Predictive Models, WRF, etc.)
# ----------------------------------------------------

@app.get("/api/ai/health")
def health_check():
    return {"status": "OK", "service": "AI Python Backend"}


@app.post("/api/ai/predict-correction")
def predict_ai_correction(req: ModelRequest):
    """
    Mock AI Endpoint: In reality, you would load a Scikit-Learn or PyTorch model here,
    pass in the WRF raw output, and return the AI-corrected AQI.
    """
    
    # Simulating a model calculation where low wind & low temp = higher pollution stagnation
    stagnation_factor = (req.temperature < 15) and (req.wind_speed < 5)
    correction_value = random.randint(15, 40) if stagnation_factor else random.randint(-10, 10)
    
    corrected_aqi = req.current_aqi + correction_value
    
    return {
        "location": req.location_id,
        "raw_aqi": req.current_aqi,
        "ai_corrected_aqi": max(0, corrected_aqi),
        "correction_applied": correction_value,
        "confidence_score": round(random.uniform(0.85, 0.98), 2),
        "reasoning": "High inversion risk detected" if stagnation_factor else "Normal dispersion"
    }


@app.get("/api/ai/plume-risk")
def calculate_plume_risk(location_id: str = "delhi"):
    """
    Mock endpoint to process satellite fire data (FIRMS) and calculate plume trajectory risk.
    """
    return {
        "location": location_id,
        "stubble_burning_risk": "High",
        "predicted_impact_time": "Tomorrow, 14:00 IST",
        "pm25_contribution_estimate": 45 # Estimated PM2.5 rise
    }
