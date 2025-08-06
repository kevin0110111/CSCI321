from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud
from ..schemas.Model import ModelCreate, ModelUpdate, ModelResponse
from ..database import get_db
from ..services import storage_service

router = APIRouter(prefix="/models", tags=["models"])

@router.post("/", response_model=ModelResponse)
async def create_model(
    name: str = Form(...),
    version: str = Form(...),
    uploaded_by: int = Form(...),
    note: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Check if uploader exists
    db_uploader = crud.get_account(db, account_id=uploaded_by)
    if not db_uploader:
        raise HTTPException(
            status_code=404,
            detail="Uploader account not found"
        )
    
    # Upload file to Supabase storage
    file_path = await storage_service.upload_model_file(file, name, version)
    
    # Create model record in database
    model_data = ModelCreate(
        name=name,
        version=version,
        uploaded_by=uploaded_by,
        file_path=file_path,
        note=note,
        is_active=True
    )
    
    return crud.create_model(db=db, model=model_data)

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

@router.get("/{model_id}/download-url")
def get_model_download_url(model_id: int, db: Session = Depends(get_db)):
    """Get the download URL for a model file"""
    db_model = crud.get_model(db, model_id=model_id)
    if db_model is None:
        raise HTTPException(status_code=404, detail="Model not found")
    
    download_url = storage_service.get_file_url(db_model.file_path)
    return {"download_url": download_url}

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
async def update_model(
    model_id: int,
    name: Optional[str] = Form(None),
    version: Optional[str] = Form(None),
    note: Optional[str] = Form(None),
    is_active: Optional[bool] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # Check if model exists
    db_model = crud.get_model(db, model_id=model_id)
    if db_model is None:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # Prepare update data
    update_data = {}
    if name is not None:
        update_data["name"] = name
    if version is not None:
        update_data["version"] = version
    if note is not None:
        update_data["note"] = note
    if is_active is not None:
        update_data["is_active"] = is_active
    
    # Handle file upload if provided
    if file:
        # Delete old file from storage
        await storage_service.delete_file(db_model.file_path)
        
        # Upload new file
        model_name = name if name else db_model.name
        model_version = version if version else db_model.version
        new_file_path = await storage_service.upload_model_file(file, model_name, model_version)
        update_data["file_path"] = new_file_path
    
    # Update model in database
    model_update = ModelUpdate(**update_data)
    updated_model = crud.update_model(db, model_id=model_id, model=model_update)
    
    return updated_model

@router.delete("/{model_id}")
async def delete_model(model_id: int, db: Session = Depends(get_db)):
    # Get model to delete file from storage
    db_model = crud.get_model(db, model_id=model_id)
    if db_model is None:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # Delete file from storage
    await storage_service.delete_file(db_model.file_path)
    
    # Delete model from database
    crud.delete_model(db, model_id=model_id)
    
    return {"message": "Model deleted successfully"}