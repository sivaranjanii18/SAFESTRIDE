from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import CrimeData

router = APIRouter(tags=["Time-Based Analytics"])


@router.get("/analytics/time-risk")
def time_based_risk(location: str, db: Session = Depends(get_db)):
    # Find all incidents for this location
    incidents = db.query(CrimeData).filter(
        CrimeData.location.ilike(f"%{location}%")
    ).all()

    if not incidents:
        return {"message": "No data found for this location"}

    # Categorize by time of day
    morning = []    # 6 AM - 12 PM
    afternoon = []  # 12 PM - 6 PM
    evening = []    # 6 PM - 10 PM
    night = []      # 10 PM - 6 AM

    for inc in incidents:
        time_str = inc.time.upper()
        try:
            # Extract hour from time string like "9:21 PM"
            parts = time_str.replace(":", " ").split()
            hour = int(parts[0])
            period = parts[-1]

            if period == "PM" and hour != 12:
                hour += 12
            if period == "AM" and hour == 12:
                hour = 0

            if 6 <= hour < 12:
                morning.append(inc.risk_label)
            elif 12 <= hour < 18:
                afternoon.append(inc.risk_label)
            elif 18 <= hour < 22:
                evening.append(inc.risk_label)
            else:
                night.append(inc.risk_label)
        except:
            continue

    def avg(lst):
        return round(sum(lst) / len(lst), 2) if lst else 0

    time_analysis = {
        "morning_6am_12pm": {
            "incidents": len(morning),
            "average_risk": avg(morning),
            "safety": "safe" if avg(morning) < 0.5 else "moderate" if avg(morning) < 0.7 else "dangerous"
        },
        "afternoon_12pm_6pm": {
            "incidents": len(afternoon),
            "average_risk": avg(afternoon),
            "safety": "safe" if avg(afternoon) < 0.5 else "moderate" if avg(afternoon) < 0.7 else "dangerous"
        },
        "evening_6pm_10pm": {
            "incidents": len(evening),
            "average_risk": avg(evening),
            "safety": "safe" if avg(evening) < 0.5 else "moderate" if avg(evening) < 0.7 else "dangerous"
        },
        "night_10pm_6am": {
            "incidents": len(night),
            "average_risk": avg(night),
            "safety": "safe" if avg(night) < 0.5 else "moderate" if avg(night) < 0.7 else "dangerous"
        }
    }

    # Find safest and most dangerous time
    times = time_analysis
    safest = min(times.items(), key=lambda x: x[1]["average_risk"])
    dangerous = max(times.items(), key=lambda x: x[1]["average_risk"])

    return {
        "location": location,
        "total_incidents": len(incidents),
        "time_analysis": time_analysis,
        "safest_time": safest[0],
        "most_dangerous_time": dangerous[0],
        "recommendation": f"Avoid {location} during {dangerous[0].replace('_', ' ')}. Safest time is {safest[0].replace('_', ' ')}."
    }