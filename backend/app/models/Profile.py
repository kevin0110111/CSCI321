from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from enum import Enum

class ProfileState(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"

class Profile(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        str_strip_whitespace=True,
        json_encoders={
            # This will be handled in the route layer
        }
    )
    
    profile_id: Optional[str] = Field(default=None, description="Primary key")
    profile_name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=500)
    state: ProfileState = Field(default=ProfileState.ACTIVE)

class ProfileCreate(BaseModel):
    profile_name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=500)
    state: ProfileState = Field(default=ProfileState.ACTIVE)

class ProfileUpdate(BaseModel):
    profile_name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=1, max_length=500)
    state: Optional[ProfileState] = None