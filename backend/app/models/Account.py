from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
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
    role_id = Column(Integer, ForeignKey("roles.role_id"))

    # Relationship
    profile = relationship("Profile", back_populates="account", uselist=False)
    role = relationship("Role", back_populates="account")
    created_faqs = relationship("FAQ", back_populates="agent")
    user_comments = relationship("Comment", foreign_keys="Comment.user_id", back_populates="user")
    agent_replies = relationship("Comment", foreign_keys="Comment.replied_agent_id", back_populates="replied_agent")
    user_bug_reports = relationship("BugReport", foreign_keys="BugReport.user_id", back_populates="user")
    resolved_bug_reports = relationship("BugReport", foreign_keys="BugReport.resolved_by_agent_id", back_populates="resolved_by_agent")
    user_images = relationship("Image", back_populates="user")
    user_results = relationship("Result", back_populates="user")
    uploaded_models = relationship("Model", back_populates="uploader")
    suspend_info = relationship("SuspendInfo", back_populates="account", uselist=False)