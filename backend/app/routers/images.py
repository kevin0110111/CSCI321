from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud
from app.schemas.Image import ImageCreate, ImageUpdate, ImageResponse
from ..database import get_db
from ..services import storage_service

router = APIRouter(prefix="/images", tags=["images"])

@router.post("/", response_model=ImageResponse)
async def create_image(
    user_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Check if user exists
    db_user = crud.get_account(db, account_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Upload image to Supabase storage
    file_path, format = await storage_service.upload_image_file(file, user_id)
    
    # Create image record in database
    image_data = ImageCreate(
        user_id=user_id,
        filename=file.filename,
        file_path=file_path,
        format=format
    )
    
    return crud.create_image(db=db, image=image_data)

@router.post("/upload-multiple", response_model=List[ImageResponse])
async def create_multiple_images(
    user_id: int = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    # Check if user exists
    db_user = crud.get_account(db, account_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    uploaded_images = []
    
    for file in files:
        try:
            # Upload image to Supabase storage
            file_path, format = await storage_service.upload_image_file(file, user_id)
            
            # Create image record in database
            image_data = ImageCreate(
                user_id=user_id,
                filename=file.filename,
                file_path=file_path,
                format=format
            )
            
            db_image = crud.create_image(db=db, image=image_data)
            uploaded_images.append(db_image)
            
        except Exception as e:
            # If one file fails, we could either:
            # 1. Fail the entire operation (current behavior)
            # 2. Continue with other files and return partial success
            # For now, we'll fail the entire operation
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload {file.filename}: {str(e)}"
            )
    
    return uploaded_images

@router.get("/", response_model=List[ImageResponse])
def read_images(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    images = crud.get_images(db, skip=skip, limit=limit)
    return images

@router.get("/{image_id}", response_model=ImageResponse)
def read_image(image_id: int, db: Session = Depends(get_db)):
    db_image = crud.get_image(db, image_id=image_id)
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return db_image

@router.get("/{image_id}/download-url")
def get_image_download_url(image_id: int, db: Session = Depends(get_db)):
    """Get the download URL for an image file"""
    db_image = crud.get_image(db, image_id=image_id)
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    
    download_url = storage_service.get_image_url(db_image.file_path)
    return {"download_url": download_url}

@router.get("/user/{user_id}", response_model=List[ImageResponse])
def read_images_by_user(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = crud.get_account(db, account_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    images = crud.get_images_by_user(db, user_id=user_id, skip=skip, limit=limit)
    return images

@router.get("/format/{format}", response_model=List[ImageResponse])
def read_images_by_format(format: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Validate format
    allowed_formats = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "tiff", "svg"]
    if format.lower() not in allowed_formats:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image format. Allowed formats: {', '.join(allowed_formats)}"
        )
    
    images = crud.get_images_by_format(db, format=format, skip=skip, limit=limit)
    return images

@router.get("/filename/{filename}", response_model=ImageResponse)
def read_image_by_filename(filename: str, db: Session = Depends(get_db)):
    db_image = crud.get_image_by_filename(db, filename=filename)
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return db_image

@router.put("/{image_id}", response_model=ImageResponse)
async def update_image(
    image_id: int,
    filename: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # Check if image exists
    db_image = crud.get_image(db, image_id=image_id)
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Prepare update data
    update_data = {}
    if filename is not None:
        # Check if filename already exists
        db_existing_image = crud.get_image_by_filename(db, filename=filename)
        if db_existing_image and db_existing_image.image_id != image_id:
            raise HTTPException(
                status_code=400,
                detail="Filename already exists"
            )
        update_data["filename"] = filename
    
    # Handle file upload if provided
    if file:
        # Delete old file from storage
        await storage_service.delete_image_file(db_image.file_path)
        
        # Upload new file
        new_file_path, new_format = await storage_service.upload_image_file(file, db_image.user_id)
        update_data["file_path"] = new_file_path
        update_data["format"] = new_format
        
        # Update filename if not explicitly provided
        if filename is None:
            update_data["filename"] = file.filename
    
    # Update image in database
    if update_data:
        image_update = ImageUpdate(**update_data)
        updated_image = crud.update_image(db, image_id=image_id, image=image_update)
        return updated_image
    
    return db_image

@router.delete("/{image_id}")
async def delete_image(image_id: int, db: Session = Depends(get_db)):
    # Get image to delete file from storage
    db_image = crud.get_image(db, image_id=image_id)
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Delete file from storage
    await storage_service.delete_image_file(db_image.file_path)
    
    # Delete image from database
    crud.delete_image(db, image_id=image_id)
    
    return {"message": "Image deleted successfully"}