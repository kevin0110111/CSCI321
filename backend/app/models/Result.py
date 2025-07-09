from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base
import enum

class ResultTypeEnum(enum.Enum):
    count = "count"
    disease = "disease"

class Result(Base):
    __tablename__ = "results"

    result_id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("images.image_id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("accounts.account_id"), nullable=False, index=True)
    result_type = Column(Enum(ResultTypeEnum), nullable=False, index=True)
    result_data = Column(String, nullable=False)
    is_saved = Column(Boolean, default=False, index=True)
    created_at = Column(Date, default=func.current_date())
    note = Column(String)

    # Relationships
    image = relationship("Image", back_populates="image_results")
    user = relationship("Account", back_populates="user_results")