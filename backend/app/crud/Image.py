from sqlalchemy.orm import Session
from ..models.Image import Image
from ..schemas.Image import ImageCreate, ImageUpdate

def get_image(db: Session, image_id: int):
    return db.query(Image).filter(Image.image_id == image_id).first()

def get_image_by_filename(db: Session, filename: str):
    return db.query(Image).filter(Image.filename == filename).first()

def get_images(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Image).offset(skip).limit(limit).all()

def get_images_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Image).filter(Image.user_id == user_id).offset(skip).limit(limit).all()

def get_images_by_format(db: Session, format: str, skip: int = 0, limit: int = 100):
    return db.query(Image).filter(Image.format.ilike(f"%{format}%")).offset(skip).limit(limit).all()

def create_image(db: Session, image: ImageCreate):
    db_image = Image(
        user_id=image.user_id,
        filename=image.filename,
        file_path=image.file_path,
        format=image.format
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def update_image(db: Session, image_id: int, image: ImageUpdate):
    db_image = db.query(Image).filter(Image.image_id == image_id).first()
    if db_image:
        update_data = image.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_image, field, value)
        db.commit()
        db.refresh(db_image)
    return db_image

def delete_image(db: Session, image_id: int):
    db_image = db.query(Image).filter(Image.image_id == image_id).first()
    if db_image:
        db.delete(db_image)
        db.commit()
    return db_image