from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import date, timedelta
from typing import Optional
from fastapi import Header
from .. import crud
from app.schemas.Account import AccountCreate, AccountUpdate, AccountResponse, AccountWithProfileCreate, PasswordChangeRequest, PasswordResetRequest, PasswordResetResponse, SubscriptionStatusResponse
from ..database import get_db
from app.services.authToken import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, verify_access_token


router = APIRouter(prefix="/accounts", tags=["accounts"])

# Login request model
class LoginRequest(BaseModel):
    username: str
    password: str

# Login response model
class LoginResponse(BaseModel):
    message: str
    account: AccountResponse
    access_token: str
    token_type: str

def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid Authorization header")
    token = authorization.split(" ", 1)[1]
    payload = verify_access_token(token)
    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing subject")

    user = crud.get_account(db, account_id=int(sub))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

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

    # generate token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": str(account_with_role.account_id)},
        expires_delta=access_token_expires
    )
    
    return LoginResponse(
        message="Login successful",
        account=account_with_role,
        access_token=token,
        token_type="Bearer"
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

@router.get("/subscription-status", response_model=SubscriptionStatusResponse)
def get_subscription_status(
    account_id: int, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)):

    if int(account_id) != int(current_user.account_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")

    account = crud.get_account(db, account_id=account_id)
    if account is None:
        raise HTTPException(status_code=404, detail="Account not found")

    if account.is_premium and account.subscription_expiry and account.subscription_expiry < date.today():
        account.is_premium = False
        db.commit()
        db.refresh(account)

    # Return only the premium status using the new response model
    return SubscriptionStatusResponse(is_premium=account.is_premium)