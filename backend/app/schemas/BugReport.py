from pydantic import BaseModel
from datetime import date
from typing import Optional
from enum import Enum

class BugReportStatusEnum(str, Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"

class BugReportBase(BaseModel):
    title: str
    description: str

class BugReportCreate(BugReportBase):
    user_id: int

class BugReportUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[BugReportStatusEnum] = None

class BugReportResolve(BaseModel):
    resolved_by_agent_id: int
    resolution_note: str

class BugReportStatusUpdate(BaseModel):
    status: BugReportStatusEnum

class BugReportResponse(BugReportBase):
    bug_id: int
    user_id: int
    created_at: date
    status: BugReportStatusEnum
    resolved_by_agent_id: Optional[int] = None
    resolved_at: Optional[date] = None
    resolution_note: Optional[str] = None

    class Config:
        from_attributes = True