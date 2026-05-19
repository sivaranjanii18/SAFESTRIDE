from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ---- User Schemas ----
class UserCreate(BaseModel):
    name: str
    email: str
    phone: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---- Device Schemas ----
class DeviceCreate(BaseModel):
    device_name: str
    mac_address: str

class DeviceUpdate(BaseModel):
    battery_level: Optional[int] = None
    is_connected: Optional[bool] = None

class DeviceResponse(BaseModel):
    id: int
    device_name: str
    mac_address: str
    battery_level: int
    is_connected: bool
    last_synced: Optional[datetime]

    class Config:
        from_attributes = True


# ---- Emergency Contact Schemas ----
class ContactCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    priority_order: Optional[int] = 1

class ContactResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str]
    priority_order: int

    class Config:
        from_attributes = True


# ---- SOS Alert Schemas ----
class SOSCreate(BaseModel):
    device_id: int
    alert_type: str  # "heel_tap" or "fall_detected"
    latitude: float
    longitude: float

class SOSResponse(BaseModel):
    id: int
    alert_type: str
    latitude: float
    longitude: float
    status: str
    triggered_at: datetime
    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True


# ---- Crime Data / Search Schema ----
class CrimeDataResponse(BaseModel):
    id: int
    location: str
    latitude: float
    longitude: float
    time: str
    report_text: str
    heel_tap: int
    risk_label: float

    class Config:
        from_attributes = True


# ---- Incident / Report Schema ----
class IncidentResponse(BaseModel):
    id: int
    description: str
    severity: str
    created_at: datetime

    class Config:
        from_attributes = True