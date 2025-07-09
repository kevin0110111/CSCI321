from sqlalchemy.orm import Session
from ..models.Model import Model
from ..schemas.Model import ModelCreate, ModelUpdate

def get_model(db: Session, model_id: int):
    return db.query(Model).filter(Model.model_id == model_id).first()

def get_models(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Model).offset(skip).limit(limit).all()

def get_models_by_uploader(db: Session, uploaded_by: int, skip: int = 0, limit: int = 100):
    return db.query(Model).filter(Model.uploaded_by == uploaded_by).offset(skip).limit(limit).all()

def create_model(db: Session, model: ModelCreate):
    db_model = Model(
        name=model.name,
        version=model.version,
        uploaded_by=model.uploaded_by,
        file_path=model.file_path,
        is_active=model.is_active,
        note=model.note
    )
    db.add(db_model)
    db.commit()
    db.refresh(db_model)
    return db_model

def update_model(db: Session, model_id: int, model: ModelUpdate):
    db_model = db.query(Model).filter(Model.model_id == model_id).first()
    if db_model:
        update_data = model.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_model, field, value)
        db.commit()
        db.refresh(db_model)
    return db_model

def delete_model(db: Session, model_id: int):
    db_model = db.query(Model).filter(Model.model_id == model_id).first()
    if db_model:
        db.delete(db_model)
        db.commit()
    return db_model