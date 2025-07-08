from pydantic import BaseModel
from enum import Enum
from typing import Optional

class RoleStateEnum(str, Enum):
    active = "active"
    suspended = "suspended"

class RoleBase(BaseModel):
    role_name: str
    description: Optional[str] = None
    state: RoleStateEnum = RoleStateEnum.active

class RoleCreate(RoleBase):
    pass

class RoleUpdate(BaseModel):
    role_name: Optional[str] = None
    description: Optional[str] = None
    state: Optional[RoleStateEnum] = None

class RoleResponse(RoleBase):
    role_id: int

    class Config:
        from_attributes = True