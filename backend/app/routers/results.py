from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud
from app.schemas.Result import (
    ResultCreate, 
    ResultUpdate, 
    ResultResponse, 
    ResultSaveToggle,
    ResultTypeEnum
)
from ..database import get_db

router = APIRouter(prefix="/results", tags=["results"])

@router.post("/", response_model=ResultResponse)
def create_result(result: ResultCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = crud.get_account(db, account_id=result.user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Check if image exists
    db_image = crud.get_image(db, image_id=result.image_id)
    if not db_image:
        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )
    
    # Verify that the image belongs to the user
    if db_image.user_id != result.user_id:
        raise HTTPException(
            status_code=403,
            detail="Image does not belong to this user"
        )
    
    return crud.create_result(db=db, result=result)

@router.get("/", response_model=List[ResultResponse])
def read_results(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    results = crud.get_results(db, skip=skip, limit=limit)
    return results

@router.get("/{result_id}", response_model=ResultResponse)
def read_result(result_id: int, db: Session = Depends(get_db)):
    db_result = crud.get_result(db, result_id=result_id)
    if db_result is None:
        raise HTTPException(status_code=404, detail="Result not found")
    return db_result

@router.get("/user/{user_id}", response_model=List[ResultResponse])
def read_results_by_user(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = crud.get_account(db, account_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    results = crud.get_results_by_user(db, user_id=user_id, skip=skip, limit=limit)
    return results

@router.get("/image/{image_id}", response_model=List[ResultResponse])
def read_results_by_image(image_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Check if image exists
    db_image = crud.get_image(db, image_id=image_id)
    if not db_image:
        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )
    
    results = crud.get_results_by_image(db, image_id=image_id, skip=skip, limit=limit)
    return results

@router.get("/type/{result_type}", response_model=List[ResultResponse])
def read_results_by_type(result_type: ResultTypeEnum, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    results = crud.get_results_by_type(db, result_type=result_type, skip=skip, limit=limit)
    return results

@router.get("/saved/{is_saved}", response_model=List[ResultResponse])
def read_results_by_saved_status(is_saved: bool, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    results = crud.get_results_by_saved_status(db, is_saved=is_saved, skip=skip, limit=limit)
    return results

@router.get("/user/{user_id}/saved", response_model=List[ResultResponse])
def read_saved_results_by_user(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = crud.get_account(db, account_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    results = crud.get_saved_results_by_user(db, user_id=user_id, skip=skip, limit=limit)
    return results

@router.put("/{result_id}", response_model=ResultResponse)
def update_result(result_id: int, result: ResultUpdate, db: Session = Depends(get_db)):
    db_result = crud.update_result(db, result_id=result_id, result=result)
    if db_result is None:
        raise HTTPException(status_code=404, detail="Result not found")
    return db_result

@router.patch("/{result_id}/save", response_model=ResultResponse)
def toggle_result_save(result_id: int, save_toggle: ResultSaveToggle, db: Session = Depends(get_db)):
    db_result = crud.toggle_result_save(db, result_id=result_id, is_saved=save_toggle.is_saved)
    if db_result is None:
        raise HTTPException(status_code=404, detail="Result not found")
    return db_result

@router.delete("/{result_id}")
def delete_result(result_id: int, db: Session = Depends(get_db)):
    db_result = crud.delete_result(db, result_id=result_id)
    if db_result is None:
        raise HTTPException(status_code=404, detail="Result not found")
    return {"message": "Result deleted successfully"}