from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel, EmailStr
from datetime import date, datetime, timedelta
from .. import crud
from app.schemas.Account import AccountCreate, AccountUpdate, AccountResponse, AccountWithProfileCreate, PasswordChangeRequest, PasswordResetRequest, PasswordResetResponse, SubscriptionStatusResponse
from ..database import get_db
import os
import secrets
from fastapi.responses import JSONResponse
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import smtplib
from email.mime.text import MIMEText

WEB_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
WEB_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = os.getenv("SMTP_PORT", 587)
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

router = APIRouter(prefix="/accounts", tags=["accounts"])

# Login request model
class LoginRequest(BaseModel):
    username: str
    password: str

# Login response model
class LoginResponse(BaseModel):
    message: str
    account: AccountResponse

class GoogleOAuthRequest(BaseModel):
    id_token: str

# OTP storage (in-memory for simplicity, use database or Redis in production)
otp_storage = {}  # {email: {"otp": str, "expires": datetime}}

# OTP request model
class OTPRequest(BaseModel):
    email: EmailStr

# OTP verification model
class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str

# Send email with OTP
def send_otp_email(email: str, otp: str):
    msg = MIMEText(f"Your OTP for password reset is: {otp}\nThis OTP is valid for 10 minutes.")
    msg['Subject'] = 'Password Reset OTP'
    msg['From'] = SMTP_USERNAME
    msg['To'] = email

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(SMTP_USERNAME, email, msg.as_string())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send OTP email: {str(e)}")

# Validate password requirements
def validate_password(password: str):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one number"
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter"
    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter"
    if not any(c in "!@#$%^&*(),.?\":{}|<>" for c in password):
        return False, "Password must contain at least one special character"
    return True, ""

@router.post("/send-otp")
def send_otp(otp_request: OTPRequest, db: Session = Depends(get_db)):
    email = otp_request.email
    account = crud.get_account_by_email(db, email=email)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # Generate 4-digit OTP
    otp = ''.join([str(secrets.randbelow(10)) for _ in range(4)])
    expires = datetime.utcnow() + timedelta(minutes=10)

    # Store OTP
    otp_storage[email] = {"otp": otp, "expires": expires}

    # Send OTP via email
    send_otp_email(email, otp)

    return {"message": "OTP sent to your email"}

@router.post("/verify-otp")
def verify_otp(otp_verify: OTPVerifyRequest, db: Session = Depends(get_db)):
    email = otp_verify.email
    otp = otp_verify.otp

    if email not in otp_storage:
        raise HTTPException(status_code=400, detail="No OTP sent for this email")

    stored_otp = otp_storage[email]
    if stored_otp["expires"] < datetime.utcnow():
        del otp_storage[email]
        raise HTTPException(status_code=400, detail="OTP has expired")

    if stored_otp["otp"] != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # OTP is valid, keep it in storage until password reset
    return {"message": "OTP verified successfully"}

@router.post("/reset-password", response_model=PasswordResetResponse)
def reset_password(reset_data: PasswordResetRequest, db: Session = Depends(get_db)):
    """
    Reset password using email after OTP verification.
    """
    email = reset_data.email
    new_password = reset_data.new_password

    # Check if OTP was verified
    if email not in otp_storage:
        raise HTTPException(status_code=400, detail="OTP verification required")

    # Validate password requirements
    is_valid, error_message = validate_password(new_password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_message)

    account = crud.reset_password_by_email(db, email=email, new_password=new_password)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # Clear OTP after successful password reset
    del otp_storage[email]

    return PasswordResetResponse(
        message="Password reset successfully",
        success=True
    )

@router.get("/subscription-status", response_model=SubscriptionStatusResponse)
def get_subscription_status(account_id: int, db: Session = Depends(get_db)):

    account = crud.get_account(db, account_id=account_id)
    if account is None:
        raise HTTPException(status_code=404, detail="Account not found")

    # 计算剩余天数
    days_remaining = None
    if account.is_premium and account.subscription_expiry:
        if account.subscription_expiry < date.today():
            account.is_premium = False
            db.commit()
            db.refresh(account)
        else:
            # 计算剩余天数
            days_remaining = (account.subscription_expiry - date.today()).days

    # 返回带有订阅过期时间和剩余天数的响应
    return SubscriptionStatusResponse(
        is_premium=account.is_premium,
        subscription_expiry=account.subscription_expiry if account.is_premium else None,
        days_remaining=days_remaining
    )

@router.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user login with username and password.
    """
    # First authenticate with basic credentials
    authenticated_account = crud.authenticate_account(db, username=login_data.username, password=login_data.password)
    
    if not authenticated_account:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Check if account is suspended
    if authenticated_account.state.value == "suspended":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended"
        )
    
    # Get account with role information for better response
    account_with_role = crud.get_account_with_role(db, account_id=authenticated_account.account_id)
    return LoginResponse(
        message="Login successful",
        account=account_with_role
    )

@router.post("/", response_model=AccountResponse)
def create_account(account: AccountCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    db_account = crud.get_account_by_email(db, email=account.email)
    if db_account:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Check if username already exists
    db_account = crud.get_account_by_username(db, username=account.username)
    if db_account:
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )
    
    return crud.create_account(db=db, account=account)

@router.post("/with-profile", response_model=AccountResponse)
def create_account_with_profile(account_data: AccountWithProfileCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    db_account = crud.get_account_by_email(db, email=account_data.email)
    if db_account:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Check if username already exists
    db_account = crud.get_account_by_username(db, username=account_data.username)
    if db_account:
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )
    
    return crud.create_account_with_profile(db=db, account_data=account_data)

@router.get("/", response_model=List[AccountResponse])
def read_accounts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    accounts = crud.get_accounts(db, skip=skip, limit=limit)
    return accounts

@router.get("/{account_id}", response_model=AccountResponse)
def read_account(account_id: int, db: Session = Depends(get_db)):
    db_account = crud.get_account(db, account_id=account_id)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account

@router.get("/by-email/{email}", response_model=AccountResponse)
def read_account_by_email(email: str, db: Session = Depends(get_db)):
    db_account = crud.get_account_by_email(db, email=email)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account

@router.get("/by-username/{username}", response_model=AccountResponse)
def read_account_by_username(username: str, db: Session = Depends(get_db)):
    db_account = crud.get_account_by_username(db, username=username)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account

@router.put("/{account_id}", response_model=AccountResponse)
def update_account(account_id: int, account: AccountUpdate, db: Session = Depends(get_db)):
    # Check if email already exists (if being updated)
    if account.email:
        db_account = crud.get_account_by_email(db, email=account.email)
        if db_account and db_account.account_id != account_id:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
    
    # Check if username already exists (if being updated)
    if account.username:
        db_account = crud.get_account_by_username(db, username=account.username)
        if db_account and db_account.account_id != account_id:
            raise HTTPException(
                status_code=400,
                detail="Username already taken"
            )
    
    db_account = crud.update_account(db, account_id=account_id, account=account)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account

@router.delete("/{account_id}")
def delete_account(account_id: int, db: Session = Depends(get_db)):
    db_account = crud.delete_account(db, account_id=account_id)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return {"message": "Account deleted successfully"}

@router.put("/{account_id}/assign-role/{role_id}", response_model=AccountResponse)
def assign_role_to_account(account_id: int, role_id: int, db: Session = Depends(get_db)):
    db_account = crud.assign_role_to_account(db, account_id=account_id, role_id=role_id)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account

@router.put("/{account_id}/remove-role", response_model=AccountResponse)
def remove_role_from_account(account_id: int, db: Session = Depends(get_db)):
    db_account = crud.remove_role_from_account(db, account_id=account_id)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account

@router.put("/{account_id}/update-role/{role_id}", response_model=AccountResponse)
def update_account_role(account_id: int, role_id: int, db: Session = Depends(get_db)):
    db_account = crud.update_account_role(db, account_id=account_id, role_id=role_id)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account

@router.get("/{account_id}/with-role", response_model=AccountResponse)
def read_account_with_role(account_id: int, db: Session = Depends(get_db)):
    db_account = crud.get_account_with_role(db, account_id=account_id)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account

@router.put("/{account_id}/change-password", response_model=PasswordResetResponse)
def change_password(
    account_id: int, 
    password_data: PasswordChangeRequest, 
    db: Session = Depends(get_db)
):
    """
    Change password for an account after verifying current password.
    """
    result = crud.change_password(
        db, 
        account_id=account_id, 
        current_password=password_data.current_password,
        new_password=password_data.new_password
    )
    
    if result is None:
        raise HTTPException(status_code=404, detail="Account not found")
    elif result is False:
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    return PasswordResetResponse(
        message="Password changed successfully",
        success=True
    )

@router.post("/reset-password", response_model=PasswordResetResponse)
def reset_password(
    reset_data: PasswordResetRequest, 
    db: Session = Depends(get_db)
):
    """
    Reset password using email (for forgot password scenarios).
    Note: In production, this should be protected with email verification/tokens.
    """
    account = crud.reset_password_by_email(
        db, 
        email=reset_data.email, 
        new_password=reset_data.new_password
    )
    
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    return PasswordResetResponse(
        message="Password reset successfully",
        success=True
    )

@router.put("/{account_id}/update-password", response_model=PasswordResetResponse)
def update_password(
    account_id: int, 
    new_password: str, 
    db: Session = Depends(get_db)
):
    """
    Update password directly (admin function).
    """
    account = crud.update_password(db, account_id=account_id, new_password=new_password)
    
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    return PasswordResetResponse(
        message="Password updated successfully",
        success=True
    )

@router.post("/oauth/google")
def google_oauth_login(payload: GoogleOAuthRequest, db: Session = Depends(get_db)):
    """
    Handles login via Google OAuth.
    Verifies Google ID token, logs in existing accounts or creates minimal ones.
    """
    try:
        idinfo = id_token.verify_oauth2_token(
            payload.id_token, google_requests.Request(), WEB_CLIENT_ID
        )
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google ID token")

    email = idinfo.get("email")
    name = idinfo.get("name")
    picture = idinfo.get("picture")

    # Existing account → login
    db_account = crud.get_account_by_email(db, email=email)
    if db_account:
        account_with_role = crud.get_account_with_role(
            db, account_id=db_account.account_id
        )
        return {
            "message": "Login successful",
            "account": account_with_role
        }

    # New account → create minimal profile
    username_base = (email.split("@")[0]).replace('.', '')[:20] or "guser"
    username = username_base
    i = 1
    while crud.get_account_by_username(db, username=username):
        username = f"{username_base}{i}"
        i += 1

    generated_password = secrets.token_urlsafe(24)

    account_payload = AccountWithProfileCreate(
        username=username,
        email=email,
        password=generated_password,
        avatar_url=picture,
        country="",
        city="",
        is_premium=False,
        subscription_expiry=None,
        name=name,
        dob=None,
        job="",
        institution="",
        reason_foruse=""
    )
    created_account = crud.create_account_with_profile(db=db, account_data=account_payload)

    return JSONResponse(
        status_code=201,
        content={
            "message": "Account created via Google. Complete profile.",
            "needs_profile_completion": True,
            "account_id": created_account.account_id,
            "email": email,
            "username": username,
            "name": name,
            "avatar_url": picture
        }
    )