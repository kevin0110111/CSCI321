from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud
from app.schemas.Account import AccountCreate, AccountUpdate, AccountResponse, AccountWithProfileCreate
from ..database import get_db

router = APIRouter(prefix="/accounts", tags=["accounts"])

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