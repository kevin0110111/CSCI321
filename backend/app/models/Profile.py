from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base
import enum

class ProfileLanguageEnum(enum.Enum):
    en = "en"
    zh = "zh"

class Profile(Base):
    __tablename__ = "profiles"

    profile_id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.account_id"), nullable=False)
    name = Column(String, nullable=False)
    dob = Column(Date)
    job = Column(String)
    institution = Column(String)
    reason_foruse = Column(String)
    preferred_language = Column(Enum(ProfileLanguageEnum), default=ProfileLanguageEnum.en)

    # Relationship - One-to-One with Account
    account = relationship("Account", back_populates="profile")