from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models import Device
from app.schemas import DeviceCreate, DeviceUpdate, DeviceResponse

router = APIRouter(tags=["Devices"])


@router.post("/devices/{user_id}", response_model=DeviceResponse)
def register_device(user_id: int, device: DeviceCreate, db: Session = Depends(get_db)):
    new_device = Device(
        user_id=user_id,
        device_name=device.device_name,
        mac_address=device.mac_address,
        last_synced=datetime.utcnow()
    )
    db.add(new_device)
    db.commit()
    db.refresh(new_device)
    return new_device


@router.get("/devices/{user_id}")
def get_devices(user_id: int, db: Session = Depends(get_db)):
    devices = db.query(Device).filter(Device.user_id == user_id).all()
    return devices


@router.put("/devices/{device_id}/sync")
def sync_device(device_id: int, update: DeviceUpdate, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    if update.battery_level is not None:
        device.battery_level = update.battery_level
    if update.is_connected is not None:
        device.is_connected = update.is_connected
    device.last_synced = datetime.utcnow()

    db.commit()
    db.refresh(device)
    return {"message": "Device synced", "device": device.device_name}