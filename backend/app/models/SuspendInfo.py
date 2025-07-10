from sqlalchemy import Column, Integer, Date, String, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class SuspendInfo(Base):
    __tablename__ = "suspend_info"

    suspendinfo_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("accounts.account_id"), nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(String, nullable=False)

    # Relationship
    account = relationship("Account", back_populates="suspend_info")