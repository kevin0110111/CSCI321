from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .AccountRole import account_roles
from ..database import Base
import enum

class AccountStateEnum(enum.Enum):
    active = "active"
    suspended = "suspended"

class Account(Base):
    __tablename__ = "accounts"

    account_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    avatar_url = Column(String)
    region = Column(String, index=True, nullable=False)
    password = Column(String, nullable=False)
    state = Column(Enum(AccountStateEnum), default=AccountStateEnum.active)
    is_premium = Column(Boolean, default=False)
    subscription_expiry = Column(Date)
    createDate = Column(Date, default=func.current_date())

    # Relationship
    profile = relationship("Profile", back_populates="account", uselist=False)
    role = relationship("Role", secondary=account_roles, back_populates="account")