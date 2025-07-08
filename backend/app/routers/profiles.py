from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud
from app.schemas.Profile import ProfileCreate, ProfileUpdate, ProfileResponse
from ..database import get_db

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.post("/", response_model=ProfileResponse)
def create_profile(profile: ProfileCreate, db: Session = Depends(get_db)):
    # Check if account exists
    db_account = crud.get_account(db, account_id=profile.account_id)
    if not db_account:
        raise HTTPException(
            status_code=400,
            detail="Account not found"
        )
    
    # Check if profile already exists for this account
    existing_profile = crud.get_profile_by_account_id(db, account_id=profile.account_id)
    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Profile already exists for this account"
        )
    
    return crud.create_profile(db=db, profile=profile)

@router.get("/", response_model=List[ProfileResponse])
def read_profiles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    profiles = crud.get_profiles(db, skip=skip, limit=limit)
    return profiles

@router.get("/{profile_id}", response_model=ProfileResponse)
def read_profile(profile_id: int, db: Session = Depends(get_db)):
    db_profile = crud.get_profile(db, profile_id=profile_id)
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return db_profile

@router.get("/by-account/{account_id}", response_model=ProfileResponse)
def read_profile_by_account(account_id: int, db: Session = Depends(get_db)):
    db_profile = crud.get_profile_by_account_id(db, account_id=account_id)
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return db_profile

@router.put("/{profile_id}", response_model=ProfileResponse)
def update_profile(profile_id: int, profile: ProfileUpdate, db: Session = Depends(get_db)):
    db_profile = crud.update_profile(db, profile_id=profile_id, profile=profile)
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return db_profile

@router.delete("/{profile_id}")
def delete_profile(profile_id: int, db: Session = Depends(get_db)):
    db_profile = crud.delete_profile(db, profile_id=profile_id)
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"message": "Profile deleted successfully"}