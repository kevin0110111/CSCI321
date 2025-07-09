from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud
from ..schemas.Model import ModelCreate, ModelUpdate, ModelResponse
from ..database import get_db

router = APIRouter(prefix="/models", tags=["models"])

@router.post("/", response_model=ModelResponse)
def create_model(
    model: ModelCreate,
    db: Session = Depends(get_db)
):
    # Check if uploader exists
    db_uploader = crud.get_account(db, account_id=model.uploaded_by)
    if not db_uploader:
        raise HTTPException(
            status_code=404,
            detail="Uploader account not found"
        )
    
    return crud.create_model(db=db, model=model)

@router.get("/", response_model=List[ModelResponse])
def read_models(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    models = crud.get_models(db, skip=skip, limit=limit)
    return models

@router.get("/{model_id}", response_model=ModelResponse)
def read_model(model_id: int, db: Session = Depends(get_db)):
    db_model = crud.get_model(db, model_id=model_id)
    if db_model is None:
        raise HTTPException(status_code=404, detail="Model not found")
    return db_model

@router.get("/uploader/{uploaded_by}", response_model=List[ModelResponse])
def read_models_by_uploader(
    uploaded_by: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    # Check if uploader exists
    db_uploader = crud.get_account(db, account_id=uploaded_by)
    if not db_uploader:
        raise HTTPException(
            status_code=404,
            detail="Uploader account not found"
        )
    
    models = crud.get_models_by_uploader(db, uploaded_by=uploaded_by, skip=skip, limit=limit)
    return models

@router.put("/{model_id}", response_model=ModelResponse)
def update_model(
    model_id: int,
    model: ModelUpdate,
    db: Session = Depends(get_db)
):
    db_model = crud.update_model(db, model_id=model_id, model=model)
    if db_model is None:
        raise HTTPException(status_code=404, detail="Model not found")
    return db_model

@router.delete("/{model_id}")
def delete_model(model_id: int, db: Session = Depends(get_db)):
    db_model = crud.delete_model(db, model_id=model_id)
    if db_model is None:
        raise HTTPException(status_code=404, detail="Model not found")
    return {"message": "Model deleted successfully"}