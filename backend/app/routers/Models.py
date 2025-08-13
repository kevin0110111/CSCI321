from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import base64
import io
from PIL import Image
from .. import crud
from ..schemas.Model import ModelCreate, ModelUpdate, ModelResponse
from ..database import get_db
from ..services import storage_service
from app.services.model_manager import model_manager
import torch

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

@router.post("/active/predict")
async def predict_model(
    file: UploadFile = File(...),
    task: str = Form(...),
):
    image_bytes = await file.read()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    if task == "detect":
        input_tensor = model_manager._Resnet_preprocess(img)
        categories = ["maize", "others"]
        model = model_manager._detect_model
        if model is None:
            return {"error": "Detection model is not loaded"}
        with torch.no_grad():
            output = model(input_tensor)
            pred = output.argmax(1).item()
            pred_class = categories[pred] 
        return {"result": f"{pred_class}"}
    
    elif task == "disease":
        input_tensor = model_manager._Resnet_preprocess(img)
        categories = ["Blight", "Common_Rust","Gray_Leaf_Spot","Healthy"]
        model = model_manager._disease_model
        if model is None:
            return {"error": "Disease model is not loaded"}
        with torch.no_grad():
            output = model(input_tensor)
            pred = output.argmax(1).item()
            pred_class = categories[pred]
        return {"result": f"disease_{pred_class}"}
    
    elif task == "count":
        model = model_manager._count_model  # 这里应是 ultralytics.YOLO 实例
        if model is None:
            return {"error": "Count model is not loaded"}

        results = model.predict(img, verbose=False)
        det = results[0]
        num = int(len(det.boxes) if det.boxes is not None else 0)
        annotated_img = det.plot()  # numpy (BGR)
        annotated_pil = Image.fromarray(annotated_img[..., ::-1])  # 转成 RGB
        buf = io.BytesIO()
        annotated_pil.save(buf, format="JPEG")
        img_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")
        return {
            "result": num,
            "image_base64": img_base64  # 前端用 data:image/jpeg;base64,xxx 直接显示
        }
    else:
        return {"error": "Unknown task type"}