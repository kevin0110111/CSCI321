from sqlalchemy.orm import Session
from ..models.Result import Result, ResultTypeEnum
from ..schemas.Result import ResultCreate, ResultUpdate

def get_result(db: Session, result_id: int):
    return db.query(Result).filter(Result.result_id == result_id).first()

def get_results(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Result).offset(skip).limit(limit).all()

def get_results_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Result).filter(Result.user_id == user_id).offset(skip).limit(limit).all()

def get_results_by_image(db: Session, image_id: int, skip: int = 0, limit: int = 100):
    return db.query(Result).filter(Result.image_id == image_id).offset(skip).limit(limit).all()

def get_results_by_type(db: Session, result_type: ResultTypeEnum, skip: int = 0, limit: int = 100):
    return db.query(Result).filter(Result.result_type == result_type).offset(skip).limit(limit).all()

def get_results_by_saved_status(db: Session, is_saved: bool, skip: int = 0, limit: int = 100):
    return db.query(Result).filter(Result.is_saved == is_saved).offset(skip).limit(limit).all()

def get_saved_results_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Result).filter(
        Result.user_id == user_id,
        Result.is_saved == True
    ).offset(skip).limit(limit).all()

def get_results_by_user_and_type(db: Session, user_id: int, result_type: ResultTypeEnum, skip: int = 0, limit: int = 100):
    return db.query(Result).filter(
        Result.user_id == user_id,
        Result.result_type == result_type
    ).offset(skip).limit(limit).all()

def create_result(db: Session, result: ResultCreate):
    db_result = Result(
        image_id=result.image_id,
        user_id=result.user_id,
        result_type=result.result_type,
        result_data=result.result_data,
        is_saved=result.is_saved,
        note=result.note
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

def update_result(db: Session, result_id: int, result: ResultUpdate):
    db_result = db.query(Result).filter(Result.result_id == result_id).first()
    if db_result:
        update_data = result.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_result, field, value)
        db.commit()
        db.refresh(db_result)
    return db_result

def toggle_result_save(db: Session, result_id: int, is_saved: bool):
    db_result = db.query(Result).filter(Result.result_id == result_id).first()
    if db_result:
        db_result.is_saved = is_saved
        db.commit()
        db.refresh(db_result)
    return db_result

def delete_result(db: Session, result_id: int):
    db_result = db.query(Result).filter(Result.result_id == result_id).first()
    if db_result:
        db.delete(db_result)
        db.commit()
    return db_result