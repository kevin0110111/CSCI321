from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class FAQ(Base):
    __tablename__ = "faqs"

    faq_id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    created_agent_id = Column(Integer, ForeignKey("accounts.account_id"), nullable=False)
    created_at = Column(Date, default=func.current_date())
    last_updated = Column(Date, onupdate=func.current_date())

    # Relationship
    agent = relationship("Account", back_populates="created_faqs")