from pydantic import BaseModel
from datetime import date

class SuspendInfoBase(BaseModel):
    user_id: int
    end_date: date
    reason: str

class SuspendInfoCreate(SuspendInfoBase):
    pass

class SuspendInfoResponse(SuspendInfoBase):
    suspendinfo_id: int

    class Config:
        from_attributes = True