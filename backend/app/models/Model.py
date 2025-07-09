from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class Model(Base):
    __tablename__ = "models"

    model_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    version = Column(String, nullable=False)
    uploaded_by = Column(Integer, ForeignKey("accounts.account_id"), nullable=False)
    file_path = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    upload_time = Column(Date, default=func.current_date())
    note = Column(String)

    # Relationships
    uploader = relationship("Account", back_populates="uploaded_models")