from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class Comment(Base):
    __tablename__ = "comments"

    comment_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("accounts.account_id"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    rating = Column(Integer, nullable=False)
    created_at = Column(Date, default=func.current_date())
    reply_content = Column(Text)
    replied_agent_id = Column(Integer, ForeignKey("accounts.account_id"), index=True)
    replied_at = Column(Date)
    is_anonymous = Column(Boolean, default=False)

    # Relationships
    user = relationship("Account", foreign_keys=[user_id], back_populates="user_comments")
    replied_agent = relationship("Account", foreign_keys=[replied_agent_id], back_populates="agent_replies")