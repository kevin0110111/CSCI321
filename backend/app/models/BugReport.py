from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base
import enum

class BugReportStatusEnum(enum.Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"

class BugReport(Base):
    __tablename__ = "bug_reports"

    bug_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("accounts.account_id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(Date, default=func.current_date())
    status = Column(Enum(BugReportStatusEnum), default=BugReportStatusEnum.open)
    resolved_by_agent_id = Column(Integer, ForeignKey("accounts.account_id"), index=True)
    resolved_at = Column(Date)
    resolution_note = Column(Text)

    # Relationships
    user = relationship("Account", foreign_keys=[user_id], back_populates="user_bug_reports")
    resolved_by_agent = relationship("Account", foreign_keys=[resolved_by_agent_id], back_populates="resolved_bug_reports")