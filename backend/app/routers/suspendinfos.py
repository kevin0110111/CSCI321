from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.SuspendInfo import SuspendInfoCreate, SuspendInfoResponse
from ..crud.SuspendInfo import create_suspend_info, get_suspend_info, delete_suspend_info

router = APIRouter(prefix="/suspend-info", tags=["suspend_info"])

@router.post("/", response_model=SuspendInfoResponse)
def create_suspend_record(
    suspend_info: SuspendInfoCreate,
    db: Session = Depends(get_db)
):
    # Check if user exists
    existing = get_suspend_info(db, user_id=suspend_info.user_id)
    if existing:
        raise HTTPException(
            status_code=400,
            detail="User already has a suspend record"
        )
    
    return create_suspend_info(db=db, suspend_info=suspend_info)

@router.get("/{user_id}", response_model=SuspendInfoResponse)
def read_suspend_info(user_id: int, db: Session = Depends(get_db)):
    db_suspend = get_suspend_info(db, user_id=user_id)
    if not db_suspend:
        raise HTTPException(status_code=404, detail="Suspend record not found")
    return db_suspend

@router.delete("/{user_id}")
def remove_suspend_record(user_id: int, db: Session = Depends(get_db)):
    db_suspend = delete_suspend_info(db, user_id=user_id)
    if not db_suspend:
        raise HTTPException(status_code=404, detail="Suspend record not found")
    return {"message": "Suspend record removed"}