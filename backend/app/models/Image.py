from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class Image(Base):
    __tablename__ = "images"

    image_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("accounts.account_id"), nullable=False, index=True)
    filename = Column(String, nullable=False, unique=True, index=True)
    file_path = Column(String, nullable=False)
    format = Column(String, nullable=False, index=True)
    upload_time = Column(Date, default=func.current_date())

    # Relationships
    user = relationship("Account", back_populates="user_images")
    image_results = relationship("Result", back_populates="image")