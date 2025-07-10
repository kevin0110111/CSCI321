from sqlalchemy.orm import Session
from ..models.SuspendInfo import SuspendInfo
from ..schemas.SuspendInfo import SuspendInfoCreate

def create_suspend_info(db: Session, suspend_info: SuspendInfoCreate):
    db_suspend = SuspendInfo(
        user_id=suspend_info.user_id,
        end_date=suspend_info.end_date,
        reason=suspend_info.reason
    )
    db.add(db_suspend)
    db.commit()
    db.refresh(db_suspend)
    return db_suspend

def get_suspend_info(db: Session, user_id: int):
    return db.query(SuspendInfo).filter(SuspendInfo.user_id == user_id).first()

def delete_suspend_info(db: Session, user_id: int):
    db_suspend = db.query(SuspendInfo).filter(SuspendInfo.user_id == user_id).first()
    if db_suspend:
        db.delete(db_suspend)
        db.commit()
    return db_suspend