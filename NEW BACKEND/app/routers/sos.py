from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models import SOSAlert, Notification, EmergencyContact, LocationHistory

router = APIRouter(tags=["SOS Alerts"])


@router.post("/sos/{user_id}")
def trigger_sos(user_id: int, device_id: int, alert_type: str, latitude: float, longitude: float, db: Session = Depends(get_db)):
    # 1. Create the SOS alert
    alert = SOSAlert(
        user_id=user_id,
        device_id=device_id,
        alert_type=alert_type,  # "heel_tap" or "fall_detected"
        latitude=latitude,
        longitude=longitude,
        status="triggered"
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    # 2. Save location
    location = LocationHistory(
        user_id=user_id,
        latitude=latitude,
        longitude=longitude
    )
    db.add(location)

    # 3. Notify all emergency contacts
    contacts = db.query(EmergencyContact).filter(
        EmergencyContact.user_id == user_id
    ).order_by(EmergencyContact.priority_order).all()

    notifications_sent = []
    for contact in contacts:
        notification = Notification(
            alert_id=alert.id,
            contact_id=contact.id,
            channel="sms",
            status="sent",
            sent_at=datetime.utcnow()
        )
        db.add(notification)
        notifications_sent.append(contact.name)

    db.commit()

    return {
        "message": "SOS triggered",
        "alert_id": alert.id,
        "alert_type": alert_type,
        "contacts_notified": notifications_sent,
        "location": {"lat": latitude, "lng": longitude}
    }


@router.put("/sos/{alert_id}/cancel")
def cancel_sos(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(SOSAlert).filter(SOSAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.status = "cancelled"
    alert.resolved_at = datetime.utcnow()
    db.commit()

    return {"message": "SOS cancelled", "alert_id": alert_id}


@router.put("/sos/{alert_id}/resolve")
def resolve_sos(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(SOSAlert).filter(SOSAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.status = "resolved"
    alert.resolved_at = datetime.utcnow()
    db.commit()

    return {"message": "SOS resolved", "alert_id": alert_id}


@router.get("/sos/{user_id}/history")
def get_sos_history(user_id: int, db: Session = Depends(get_db)):
    alerts = db.query(SOSAlert).filter(
        SOSAlert.user_id == user_id
    ).order_by(SOSAlert.triggered_at.desc()).all()

    return [
        {
            "id": a.id,
            "alert_type": a.alert_type,
            "status": a.status,
            "latitude": a.latitude,
            "longitude": a.longitude,
            "triggered_at": a.triggered_at,
            "resolved_at": a.resolved_at
        }
        for a in alerts
    ]