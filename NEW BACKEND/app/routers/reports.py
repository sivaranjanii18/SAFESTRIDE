from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import SOSAlert, Incident, LocationHistory

router = APIRouter(tags=["Reports"])


@router.get("/reports/{user_id}/summary")
def get_report_summary(user_id: int, db: Session = Depends(get_db)):
    total_alerts = db.query(SOSAlert).filter(SOSAlert.user_id == user_id).count()
    heel_taps = db.query(SOSAlert).filter(
        SOSAlert.user_id == user_id,
        SOSAlert.alert_type == "heel_tap"
    ).count()
    falls = db.query(SOSAlert).filter(
        SOSAlert.user_id == user_id,
        SOSAlert.alert_type == "fall_detected"
    ).count()
    resolved = db.query(SOSAlert).filter(
        SOSAlert.user_id == user_id,
        SOSAlert.status == "resolved"
    ).count()
    cancelled = db.query(SOSAlert).filter(
        SOSAlert.user_id == user_id,
        SOSAlert.status == "cancelled"
    ).count()

    return {
        "user_id": user_id,
        "total_alerts": total_alerts,
        "heel_tap_alerts": heel_taps,
        "fall_detected_alerts": falls,
        "resolved": resolved,
        "cancelled": cancelled
    }


@router.get("/reports/{user_id}/locations")
def get_location_history(user_id: int, db: Session = Depends(get_db)):
    locations = db.query(LocationHistory).filter(
        LocationHistory.user_id == user_id
    ).order_by(LocationHistory.timestamp.desc()).limit(50).all()

    return [
        {
            "latitude": loc.latitude,
            "longitude": loc.longitude,
            "timestamp": loc.timestamp
        }
        for loc in locations
    ]