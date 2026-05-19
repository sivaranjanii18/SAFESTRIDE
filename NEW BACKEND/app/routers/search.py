from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import CrimeData

router = APIRouter(tags=["Search & Heatmap"])


@router.get("/search")
def search_location(query: str, db: Session = Depends(get_db)):
    results = db.query(CrimeData).filter(
        CrimeData.location.ilike(f"%{query}%")
    ).all()

    if not results:
        return {"message": "No results found", "data": []}

    return {
        "query": query,
        "total_results": len(results),
        "data": [
            {
                "location": r.location,
                "latitude": r.latitude,
                "longitude": r.longitude,
                "time": r.time,
                "report_text": r.report_text,
                "risk_label": r.risk_label,
                "heel_tap": r.heel_tap
            }
            for r in results
        ]
    }


@router.get("/heatmap")
def get_heatmap_data(db: Session = Depends(get_db)):
    results = db.query(CrimeData).all()

    return [
        {
            "lat": r.latitude,
            "lng": r.longitude,
            "risk": r.risk_label,
            "location": r.location
        }
        for r in results
    ]


@router.get("/risk-check")
def check_risk(latitude: float, longitude: float, db: Session = Depends(get_db)):
    nearby = db.query(CrimeData).filter(
        CrimeData.latitude.between(latitude - 0.01, latitude + 0.01),
        CrimeData.longitude.between(longitude - 0.01, longitude + 0.01)
    ).all()

    if not nearby:
        return {"risk_level": "low", "message": "No incidents reported nearby"}

    avg_risk = sum(r.risk_label for r in nearby) / len(nearby)

    if avg_risk >= 0.7:
        level = "high"
    elif avg_risk >= 0.5:
        level = "medium"
    else:
        level = "low"

    return {
        "risk_level": level,
        "average_risk_score": round(avg_risk, 2),
        "incidents_nearby": len(nearby)
    }