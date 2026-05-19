from fastapi import APIRouter
import joblib
import numpy as np

router = APIRouter(tags=["AI Risk Prediction"])

# Load your trained model and vectorizer once when server starts
model = joblib.load("model.pkl")
vectorizer = joblib.load("vectorizer.pkl")


@router.post("/ai/predict-risk")
def predict_risk(latitude: float, longitude: float, time: str, report_text: str):
    text_features = vectorizer.transform([report_text]).toarray()
    location_features = np.array([[latitude, longitude]])
    all_features = np.hstack([location_features, text_features])

    risk_score = model.predict(all_features)[0]
    risk_score = max(0.0, min(1.0, risk_score))

    if risk_score >= 0.7:
        level = "high"
        message = "This area is potentially dangerous. Stay alert and share your location."
    elif risk_score >= 0.5:
        level = "medium"
        message = "Exercise caution in this area."
    else:
        level = "low"
        message = "This area appears relatively safe."

    return {
        "risk_score": round(risk_score, 2),
        "risk_level": level,
        "message": message,
        "input": {
            "latitude": latitude,
            "longitude": longitude,
            "time": time,
            "report_text": report_text
        }
    }


@router.get("/ai/area-safety")
def area_safety(latitude: float, longitude: float):
    times_and_scenarios = [
        ("9:00 AM", "walking in the area"),
        ("3:00 PM", "normal crowd activity"),
        ("8:00 PM", "evening activity in area"),
        ("11:00 PM", "walking alone at night")
    ]

    predictions = []
    for time, scenario in times_and_scenarios:
        text_features = vectorizer.transform([scenario]).toarray()
        location_features = np.array([[latitude, longitude]])
        all_features = np.hstack([location_features, text_features])

        risk_score = model.predict(all_features)[0]
        risk_score = max(0.0, min(1.0, risk_score))

        predictions.append({
            "time": time,
            "scenario": scenario,
            "risk_score": round(risk_score, 2),
            "risk_level": "high" if risk_score >= 0.7 else "medium" if risk_score >= 0.5 else "low"
        })

    avg_risk = sum(p["risk_score"] for p in predictions) / len(predictions)

    return {
        "latitude": latitude,
        "longitude": longitude,
        "overall_risk": round(avg_risk, 2),
        "overall_level": "high" if avg_risk >= 0.7 else "medium" if avg_risk >= 0.5 else "low",
        "time_breakdown": predictions
    }