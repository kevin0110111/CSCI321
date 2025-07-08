from sqlalchemy.orm import Session
from ..models.Profile import Profile
from ..schemas.Profile import ProfileCreate, ProfileUpdate

def get_profile(db: Session, profile_id: int):
    return db.query(Profile).filter(Profile.profile_id == profile_id).first()

def get_profile_by_account_id(db: Session, account_id: int):
    return db.query(Profile).filter(Profile.account_id == account_id).first()

def get_profiles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Profile).offset(skip).limit(limit).all()

def create_profile(db: Session, profile: ProfileCreate):
    db_profile = Profile(**profile.dict())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

def update_profile(db: Session, profile_id: int, profile: ProfileUpdate):
    db_profile = db.query(Profile).filter(Profile.profile_id == profile_id).first()
    if db_profile:
        update_data = profile.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_profile, field, value)
        db.commit()
        db.refresh(db_profile)
    return db_profile

def delete_profile(db: Session, profile_id: int):
    db_profile = db.query(Profile).filter(Profile.profile_id == profile_id).first()
    if db_profile:
        db.delete(db_profile)
        db.commit()
    return db_profile