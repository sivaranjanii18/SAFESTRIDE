from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import EmergencyContact
from app.schemas import ContactCreate, ContactResponse

router = APIRouter(tags=["Emergency Contacts"])


@router.post("/contacts/{user_id}", response_model=ContactResponse)
def add_contact(user_id: int, contact: ContactCreate, db: Session = Depends(get_db)):
    new_contact = EmergencyContact(
        user_id=user_id,
        name=contact.name,
        phone=contact.phone,
        email=contact.email,
        priority_order=contact.priority_order
    )
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact


@router.get("/contacts/{user_id}")
def get_contacts(user_id: int, db: Session = Depends(get_db)):
    contacts = db.query(EmergencyContact).filter(
        EmergencyContact.user_id == user_id
    ).order_by(EmergencyContact.priority_order).all()
    return contacts


@router.delete("/contacts/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(EmergencyContact).filter(EmergencyContact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(contact)
    db.commit()
    return {"message": "Contact deleted"}