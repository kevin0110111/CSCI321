from pydantic import BaseModel
from datetime import date
from typing import Optional

class FAQBase(BaseModel):
    title: str
    content: str
    created_agent_id: int

class FAQCreate(FAQBase):
    pass

class FAQUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    last_updated: Optional[date] = None

class FAQResponse(FAQBase):
    faq_id: int
    created_at: date
    last_updated: Optional[date] = None

    class Config:
        from_attributes = True