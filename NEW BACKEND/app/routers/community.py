from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models import CrimeData

router = APIRouter(tags=["Community Reports"])


@router.post("/community/report")
def submit_report(
    user_id: int,
    location: str,
    latitude: float,
    longitude: float,
    report_text: str,
    risk_level: float = 0.5,
    db: Session = Depends(get_db)
):
    # User reports an unsafe area - adds to the heatmap data
    new_report = CrimeData(
        location=location,
        latitude=latitude,
        longitude=longitude,
        time=datetime.now().strftime("%I:%M %p"),
        report_text=report_text,
        heel_tap=0,
        risk_label=risk_level
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return {
        "message": "Report submitted successfully",
        "report_id": new_report.id,
        "location": location,
        "risk_level": risk_level
    }


@router.get("/community/recent")
def get_recent_reports(limit: int = 10, db: Session = Depends(get_db)):
    # Get most recent community reports
    reports = db.query(CrimeData).order_by(
        CrimeData.id.desc()
    ).limit(limit).all()

    return [
        {
            "id": r.id,
            "location": r.location,
            "latitude": r.latitude,
            "longitude": r.longitude,
            "time": r.time,
            "report_text": r.report_text,
            "risk_label": r.risk_label
        }
        for r in reports
    ]


@router.get("/community/hotspots")
def get_hotspots(db: Session = Depends(get_db)):
    # Find locations with most incidents
    all_data = db.query(CrimeData).all()

    # Group by location and count
    location_counts = {}
    for r in all_data:
        if r.location not in location_counts:
            location_counts[r.location] = {
                "count": 0,
                "total_risk": 0,
                "lat": r.latitude,
                "lng": r.longitude
            }
        location_counts[r.location]["count"] += 1
        location_counts[r.location]["total_risk"] += r.risk_label

    # Sort by count and return top 10
    hotspots = []
    for loc, data in location_counts.items():
        hotspots.append({
            "location": loc,
            "incident_count": data["count"],
            "average_risk": round(data["total_risk"] / data["count"], 2),
            "latitude": data["lat"],
            "longitude": data["lng"]
        })

    hotspots.sort(key=lambda x: x["incident_count"], reverse=True)

    return {"hotspots": hotspots[:10]}