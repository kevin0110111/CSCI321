from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..schemas.FAQ import FAQCreate, FAQUpdate, FAQResponse
from ..crud.FAQ import get_faq, get_faqs, create_faq, update_faq, delete_faq
from ..database import get_db

router = APIRouter(prefix="/faqs", tags=["faqs"])

@router.post("/", response_model=FAQResponse)
def create_faq_endpoint(faq: FAQCreate, db: Session = Depends(get_db)):
    return create_faq(db=db, faq=faq)

@router.get("/", response_model=List[FAQResponse])
def read_faqs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_faqs(db, skip=skip, limit=limit)

@router.get("/{faq_id}", response_model=FAQResponse)
def read_faq(faq_id: int, db: Session = Depends(get_db)):
    db_faq = get_faq(db, faq_id=faq_id)
    if db_faq is None:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return db_faq

@router.put("/{faq_id}", response_model=FAQResponse)
def update_faq_endpoint(faq_id: int, faq: FAQUpdate, db: Session = Depends(get_db)):
    db_faq = update_faq(db, faq_id=faq_id, faq=faq)
    if db_faq is None:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return db_faq

@router.delete("/{faq_id}")
def delete_faq_endpoint(faq_id: int, db: Session = Depends(get_db)):
    db_faq = delete_faq(db, faq_id=faq_id)
    if db_faq is None:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return {"message": "FAQ deleted successfully"}