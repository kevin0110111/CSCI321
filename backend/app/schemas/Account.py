from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional, ForwardRef
from enum import Enum

# Forward reference to avoid circular imports
ProfileResponse = ForwardRef('ProfileResponse')
RoleResponse = ForwardRef('RoleResponse')

class AccountStateEnum(str, Enum):
    active = "active"
    suspended = "suspended"

class AccountBase(BaseModel):
    username: str
    email: EmailStr
    avatar_url: Optional[str] = None
    region: Optional[str] = None
    state: AccountStateEnum = AccountStateEnum.active
    is_premium: bool = False
    subscription_expiry: Optional[date] = None

class AccountCreate(AccountBase):
    password: str

class AccountUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = None
    region: Optional[str] = None
    state: Optional[AccountStateEnum] = None
    is_premium: Optional[bool] = None
    subscription_expiry: Optional[date] = None

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

class PasswordResetRequest(BaseModel):
    email: EmailStr
    new_password: str

class PasswordResetResponse(BaseModel):
    message: str
    success: bool

class AccountResponse(AccountBase):
    account_id: int
    createDate: date
    role_id: Optional[int] = None
    profile: Optional['ProfileResponse'] = None
    role: Optional['RoleResponse'] = None

    class Config:
        from_attributes = True

class AccountWithProfileCreate(BaseModel):
    # Account data
    username: str
    email: EmailStr
    password: str
    avatar_url: Optional[str] = None
    region: Optional[str] = None
    is_premium: bool = False
    subscription_expiry: Optional[date] = None
    
    # Profile data
    name: str
    dob: Optional[date] = None
    job: Optional[str] = None
    institution: Optional[str] = None
    reason_foruse: Optional[str] = None
    profile_preferred_language: 'ProfileLanguageEnum' = 'en'

# Import ProfileResponse after AccountResponse is defined
from .Profile import ProfileResponse, ProfileLanguageEnum
from .Role import RoleResponse
AccountResponse.model_rebuild()
AccountWithProfileCreate.model_rebuild()