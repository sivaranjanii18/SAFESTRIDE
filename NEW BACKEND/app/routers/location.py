from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models import LocationHistory

router = APIRouter(tags=["Live Location"])


@router.post("/location/{user_id}")
def update_location(user_id: int, latitude: float, longitude: float, db: Session = Depends(get_db)):
    # Frontend sends GPS every 30 seconds, this saves it
    location = LocationHistory(
        user_id=user_id,
        latitude=latitude,
        longitude=longitude,
        timestamp=datetime.utcnow()
    )
    db.add(location)
    db.commit()

    return {"message": "Location updated", "lat": latitude, "lng": longitude}


@router.get("/location/{user_id}/live")
def get_live_location(user_id: int, db: Session = Depends(get_db)):
    # Get the most recent location of a user
    latest = db.query(LocationHistory).filter(
        LocationHistory.user_id == user_id
    ).order_by(LocationHistory.timestamp.desc()).first()

    if not latest:
        raise HTTPException(status_code=404, detail="No location data found")

    return {
        "user_id": user_id,
        "latitude": latest.latitude,
        "longitude": latest.longitude,
        "last_updated": latest.timestamp
    }


@router.get("/location/{user_id}/trail")
def get_location_trail(user_id: int, limit: int = 20, db: Session = Depends(get_db)):
    # Get recent location history - shows user's path on map
    locations = db.query(LocationHistory).filter(
        LocationHistory.user_id == user_id
    ).order_by(LocationHistory.timestamp.desc()).limit(limit).all()

    return [
        {
            "latitude": loc.latitude,
            "longitude": loc.longitude,
            "timestamp": loc.timestamp
        }
        for loc in locations
    ]