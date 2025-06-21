from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional
from datetime import date
from enum import Enum

class PreferredLanguage(str, Enum):
    ENGLISH = "en"
    CHINESE = "zh"

class AccountState(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"

class Account(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        str_strip_whitespace=True,
        json_encoders={
            # This will be handled in the route layer
        }
    )
    
    account_id: Optional[str] = Field(default=None, description="Primary key")
    profile_id: str = Field(..., description="Foreign key to Profile")
    username: str = Field(..., min_length=3, max_length=50, description="Unique username")
    name: str = Field(..., min_length=1, max_length=100)
    dob: date = Field(..., description="Date of birth")
    email: EmailStr = Field(..., description="Unique email address")
    avatar_url: str = Field(..., max_length=500, description="URL to avatar image")
    password: str = Field(..., min_length=8, description="Hashed password")
    preferred_language: PreferredLanguage = Field(default=PreferredLanguage.ENGLISH)
    state: AccountState = Field(default=AccountState.ACTIVE)
    is_premium: bool = Field(default=False)
    subscription_expiry: Optional[date] = Field(default=None, description="Premium subscription expiry date")
    create_date: date = Field(..., description="Account creation date", alias="createDate")

class AccountCreate(BaseModel):
    profile_id: str = Field(..., description="Foreign key to Profile")
    username: str = Field(..., min_length=3, max_length=50, description="Unique username")
    name: str = Field(..., min_length=1, max_length=100)
    dob: date = Field(..., description="Date of birth")
    email: EmailStr = Field(..., description="Unique email address")
    avatar_url: str = Field(..., max_length=500, description="URL to avatar image")
    password: str = Field(..., min_length=8, description="Password")
    preferred_language: PreferredLanguage = Field(default=PreferredLanguage.ENGLISH)
    state: AccountState = Field(default=AccountState.ACTIVE)
    is_premium: bool = Field(default=False)
    subscription_expiry: Optional[date] = Field(default=None, description="Premium subscription expiry date")
    create_date: date = Field(..., description="Account creation date", alias="createDate")

class AccountUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50, description="Unique username")
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    dob: Optional[date] = Field(None, description="Date of birth")
    email: Optional[EmailStr] = Field(None, description="Unique email address")
    avatar_url: Optional[str] = Field(None, max_length=500, description="URL to avatar image")
    password: Optional[str] = Field(None, min_length=8, description="Password")
    preferred_language: Optional[PreferredLanguage] = None
    state: Optional[AccountState] = None
    is_premium: Optional[bool] = None
    subscription_expiry: Optional[date] = Field(None, description="Premium subscription expiry date")

class AccountLogin(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)

class AccountResponse(BaseModel):
    """Response model that excludes password for security"""
    account_id: Optional[str] = Field(default=None, description="Primary key")
    profile_id: str = Field(..., description="Foreign key to Profile")
    username: str = Field(..., description="Unique username")
    name: str = Field(...)
    dob: date = Field(..., description="Date of birth")
    email: EmailStr = Field(..., description="Unique email address")
    avatar_url: str = Field(..., description="URL to avatar image")
    preferred_language: PreferredLanguage = Field(default=PreferredLanguage.ENGLISH)
    state: AccountState = Field(default=AccountState.ACTIVE)
    is_premium: bool = Field(default=False)
    subscription_expiry: Optional[date] = Field(default=None, description="Premium subscription expiry date")
    create_date: date = Field(..., description="Account creation date", alias="createDate")