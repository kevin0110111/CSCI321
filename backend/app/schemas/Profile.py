from pydantic import BaseModel
from datetime import date
from typing import Optional
from enum import Enum

class ProfileLanguageEnum(str, Enum):
    en = "en"
    zh = "zh"

class ProfileBase(BaseModel):
    name: str
    dob: Optional[date] = None
    job: Optional[str] = None
    institution: Optional[str] = None
    reason_foruse: Optional[str] = None
    preferred_language: ProfileLanguageEnum = ProfileLanguageEnum.en

class ProfileCreate(ProfileBase):
    account_id: int

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    dob: Optional[date] = None
    job: Optional[str] = None
    institution: Optional[str] = None
    reason_foruse: Optional[str] = None
    preferred_language: Optional[ProfileLanguageEnum] = None

class ProfileResponse(ProfileBase):
    profile_id: int
    account_id: int

    class Config:
        from_attributes = True