from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud
from app.schemas.Image import ImageCreate, ImageUpdate, ImageResponse
from ..database import get_db

router = APIRouter(prefix="/images", tags=["images"])

@router.post("/", response_model=ImageResponse)
def create_image(image: ImageCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = crud.get_account(db, account_id=image.user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Validate image format
    allowed_formats = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "tiff", "svg"]
    if image.format.lower() not in allowed_formats:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image format. Allowed formats: {', '.join(allowed_formats)}"
        )
    
    return crud.create_image(db=db, image=image)

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
def update_image(image_id: int, image: ImageUpdate, db: Session = Depends(get_db)):
    # Validate image format if provided
    if image.format:
        allowed_formats = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "tiff", "svg"]
        if image.format.lower() not in allowed_formats:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported image format. Allowed formats: {', '.join(allowed_formats)}"
            )
    
    # Check if filename already exists (if being updated)
    if image.filename:
        db_existing_image = crud.get_image_by_filename(db, filename=image.filename)
        if db_existing_image and db_existing_image.image_id != image_id:
            raise HTTPException(
                status_code=400,
                detail="Filename already exists"
            )
    
    db_image = crud.update_image(db, image_id=image_id, image=image)
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return db_image

@router.delete("/{image_id}")
def delete_image(image_id: int, db: Session = Depends(get_db)):
    db_image = crud.delete_image(db, image_id=image_id)
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"message": "Image deleted successfully"}