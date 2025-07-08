from sqlalchemy.orm import Session
from ..models.FAQ import FAQ
from ..schemas.FAQ import FAQCreate, FAQUpdate

def get_faq(db: Session, faq_id: int):
    return db.query(FAQ).filter(FAQ.faq_id == faq_id).first()

def get_faqs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(FAQ).offset(skip).limit(limit).all()

def create_faq(db: Session, faq: FAQCreate):
    db_faq = FAQ(
        title=faq.title,
        content=faq.content,
        created_agent_id=faq.created_agent_id
    )
    db.add(db_faq)
    db.commit()
    db.refresh(db_faq)
    return db_faq

def update_faq(db: Session, faq_id: int, faq: FAQUpdate):
    db_faq = db.query(FAQ).filter(FAQ.faq_id == faq_id).first()
    if db_faq:
        update_data = faq.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_faq, field, value)
        db.commit()
        db.refresh(db_faq)
    return db_faq

def delete_faq(db: Session, faq_id: int):
    db_faq = db.query(FAQ).filter(FAQ.faq_id == faq_id).first()
    if db_faq:
        db.delete(db_faq)
        db.commit()
    return db_faq