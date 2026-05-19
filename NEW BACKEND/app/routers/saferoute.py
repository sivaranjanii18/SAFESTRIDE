from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import CrimeData

router = APIRouter(tags=["Safe Route"])


@router.get("/safe-route")
def check_route_safety(
    start_lat: float, start_lng: float,
    end_lat: float, end_lng: float,
    db: Session = Depends(get_db)
):
    # Calculate the bounding box between start and end
    min_lat = min(start_lat, end_lat) - 0.005
    max_lat = max(start_lat, end_lat) + 0.005
    min_lng = min(start_lng, end_lng) - 0.005
    max_lng = max(start_lng, end_lng) + 0.005

    # Find all crime data points along the route
    dangers = db.query(CrimeData).filter(
        CrimeData.latitude.between(min_lat, max_lat),
        CrimeData.longitude.between(min_lng, max_lng)
    ).all()

    if not dangers:
        return {
            "route_safety": "safe",
            "message": "No incidents reported along this route",
            "danger_zones": []
        }

    avg_risk = sum(d.risk_label for d in dangers) / len(dangers)

    if avg_risk >= 0.7:
        safety = "dangerous"
    elif avg_risk >= 0.5:
        safety = "moderate"
    else:
        safety = "safe"

    return {
        "route_safety": safety,
        "average_risk": round(avg_risk, 2),
        "total_incidents": len(dangers),
        "message": f"Found {len(dangers)} incidents along this route",
        "danger_zones": [
            {
                "location": d.location,
                "lat": d.latitude,
                "lng": d.longitude,
                "risk": d.risk_label,
                "report": d.report_text
            }
            for d in dangers
        ]
    }


@router.get("/safe-route/alternatives")
def get_alternative_routes(
    start_lat: float, start_lng: float,
    end_lat: float, end_lng: float,
    db: Session = Depends(get_db)
):
    # Check 3 possible paths: direct, shifted north, shifted south
    routes = []

    offsets = [
        ("Direct Route", 0),
        ("Northern Route", 0.01),
        ("Southern Route", -0.01)
    ]

    for name, offset in offsets:
        mid_lat = (start_lat + end_lat) / 2 + offset
        mid_lng = (start_lng + end_lng) / 2

        nearby = db.query(CrimeData).filter(
            CrimeData.latitude.between(mid_lat - 0.01, mid_lat + 0.01),
            CrimeData.longitude.between(mid_lng - 0.01, mid_lng + 0.01)
        ).all()

        incident_count = len(nearby)
        avg_risk = sum(d.risk_label for d in nearby) / len(nearby) if nearby else 0

        routes.append({
            "route_name": name,
            "incidents_nearby": incident_count,
            "average_risk": round(avg_risk, 2),
            "recommended": incident_count == min(len(nearby) for _ in offsets)
        })

    # Sort by risk - safest first
    routes.sort(key=lambda x: x["average_risk"])
    routes[0]["recommended"] = True
    for r in routes[1:]:
        r["recommended"] = False

    return {"alternatives": routes}