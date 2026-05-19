from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


# 1. Users table - stores login info
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    devices = relationship("Device", back_populates="owner")
    contacts = relationship("EmergencyContact", back_populates="owner")
    alerts = relationship("SOSAlert", back_populates="owner")


# 2. Devices table - insole chip info
class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    device_name = Column(String)
    mac_address = Column(String, unique=True)
    battery_level = Column(Integer, default=100)
    is_connected = Column(Boolean, default=False)
    last_synced = Column(DateTime)

    owner = relationship("User", back_populates="devices")


# 3. Emergency Contacts - who gets the SOS
class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String)
    priority_order = Column(Integer, default=1)

    owner = relationship("User", back_populates="contacts")


# 4. SOS Alerts - every emergency event
class SOSAlert(Base):
    __tablename__ = "sos_alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    device_id = Column(Integer, ForeignKey("devices.id"))
    alert_type = Column(String)  # "heel_tap" or "fall_detected"
    latitude = Column(Float)
    longitude = Column(Float)
    status = Column(String, default="triggered")  # triggered / cancelled / resolved
    triggered_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    owner = relationship("User", back_populates="alerts")


# 5. Notifications - tracks messages sent
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, ForeignKey("sos_alerts.id"))
    contact_id = Column(Integer, ForeignKey("emergency_contacts.id"))
    channel = Column(String)  # "sms" or "push"
    status = Column(String, default="pending")  # pending / sent / failed
    sent_at = Column(DateTime, nullable=True)


# 6. Incidents - historical record for reports
class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, ForeignKey("sos_alerts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    description = Column(String)
    severity = Column(String)  # low / medium / high / critical
    created_at = Column(DateTime, default=datetime.utcnow)


# 7. Location History - live tracking during emergencies
class LocationHistory(Base):
    __tablename__ = "location_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)


# 8. Crime Data - your CSV heatmap data
class CrimeData(Base):
    __tablename__ = "crime_data"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    time = Column(String)
    report_text = Column(String)
    heel_tap = Column(Integer)
    risk_label = Column(Float)